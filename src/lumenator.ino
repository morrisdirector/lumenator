/*
  "Lumenator" v1.0
  by Patrick Morris
*/
#include <Arduino.h>
#include <ArduinoJson.h>

#include <DNSServer.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h> //https://github.com/knolleary/pubsubclient

#define EEPROM_SIZE 2000
#define CONFIG_DTO_SIZE 2000

#define CONFIG_MAJOR_VERSION_COMPATABILITY 1

#define P(...) Serial.print(__VA_ARGS__)    // P stands for "Print"
#define PL(...) Serial.println(__VA_ARGS__) // PL stands for "Print Line"

const char ___[] = "----------------------------";

bool apMode = false; // True when in "setup" access point mode is on
IPAddress apIP(192, 168, 4, 1);
IPAddress apSubnet(255, 255, 255, 0);

// DNS server
const byte DNS_PORT = 53;
DNSServer dnsServer;

WiFiClient espClient;

#include "utils.h"
#include "config.h"
#include "state.h"
#include "webserver.h"
#include "mqtt.h"
#include "e131.h"
#include "websockets.h"

void printWiFiStatus()
{
  PL();
  PL(___);
  PL("Connected to wifi");
  P("Status: ");
  PL(WiFi.status());
  P("IP: ");
  PL(WiFi.localIP());
  P("Subnet: ");
  PL(WiFi.subnetMask());
  P("Gateway: ");
  PL(WiFi.gatewayIP());
  P("SSID: ");
  PL(WiFi.SSID());
  P("Signal: ");
  PL(WiFi.RSSI());
  P("Networks: ");
  PL(WiFi.scanNetworks());
  PL(___);
}

void startAccessPoint()
{

  PL("Starting access point");

  apMode = true;
  WiFi.disconnect();
  delay(100);

  char nameBuff[50];
  int randomId = random(1000, 9999);
  sprintf(nameBuff, "Lumenator Setup - %d", randomId);
  WiFi.softAPConfig(apIP, apIP, apSubnet);
  WiFi.softAP(nameBuff);
  delay(500); // Without delay I've seen the IP address blank

  P("AP IP address: ");
  PL(WiFi.softAPIP());

  /* Setup the DNS server redirecting all the domains to the apIP */
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);
}

void startWiFi()
{

  PL();
  PL("Connecting to WiFi:");

  if (networkConfig.dhcp == false)
  {
    PL("Static IP: ");
    P(networkConfig.ip.a);
    P(".");
    P(networkConfig.ip.b);
    P(".");
    P(networkConfig.ip.c);
    P(".");
    PL(networkConfig.ip.d);

    IPAddress local_IP(networkConfig.ip.a, networkConfig.ip.b, networkConfig.ip.c, networkConfig.ip.d);
    IPAddress gateway(192, 168, 1, 1);
    IPAddress subnet(255, 255, 0, 0);
    WiFi.config(local_IP, gateway, subnet);
  }

  WiFi.begin(networkConfig.ssid, networkConfig.pass);

  int i = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);

    P(".");

    if (i >= 30)
      break;
    i = ++i;
  }
  if (WiFi.status() == WL_CONNECTED)
  {

    P("Status: ");
    PL(WiFi.status());
    printWiFiStatus();
  }
  else
  {

    PL("Failed");

    startAccessPoint();
  }
}

void setupHardwareConfiguration()
{
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
  {
    if (gpioConfig.ww > 0)
    {
      pinMode(gpioConfig.ww, OUTPUT);
      analogWrite(gpioConfig.ww, 0);
    }
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::WW || deviceConfig.type == DeviceType::WW)
  {
    if (gpioConfig.w > 0)
    {
      pinMode(gpioConfig.w, OUTPUT);
      analogWrite(gpioConfig.w, 0);
    }
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
      deviceConfig.type == DeviceType::RGB)
  {
    if (gpioConfig.r > 0)
    {
      pinMode(gpioConfig.r, OUTPUT);
      analogWrite(gpioConfig.r, 0);
    }
    if (gpioConfig.g > 0)
    {
      pinMode(gpioConfig.g, OUTPUT);
      analogWrite(gpioConfig.g, 0);
    }
    if (gpioConfig.b > 0)
    {
      pinMode(gpioConfig.b, OUTPUT);
      analogWrite(gpioConfig.b, 0);
    }
  }
}

void readConfigJson(String configuration)
{
  if (configuration.length())
  {
    DynamicJsonDocument json(2048);
    DeserializationError error = deserializeJson(json, configuration);
    if (error)
    {

      P(error.c_str());

      PL();
      PL("----- Cannot Parse Configuration -----");
      PL();

      if (configuration[0] != 0)
        clearEEPROM();
      return;
    }
    deserializeAll(json);
  }
}

void setupWriteSettings()
{
  analogWriteRange(255);
  analogWriteFreq(880);
}

void initialStartup()
{
  // Serial port for debugging purposes
  Serial.begin(115200);
  PL();
  P("Starting Lumenator...");
  PL();
}

void resetPreviousConnections()
{
  WiFi.disconnect();
  WiFi.softAPdisconnect(true);
}

void setupWirelessConnection()
{
  if (strlen(networkConfig.ssid) && strlen(networkConfig.pass))
  {
    startWiFi();
  }
  else
  {
    startAccessPoint();
  }
}

void setupWebServer()
{
  // Setup HTTP server routes
  initRoutes();

  // Setup APIs
  initAPIs();

  // Start web server
  server.begin();
}

void setupEEPROM()
{
  EEPROM.begin(EEPROM_SIZE); // Initialising EEPROM
  delay(10);
}

void handleE131Loop()
{
  if (e131Config.enabled == true)
  {
    e131Loop();
  }
}

void handleMQTTLoop()
{
  if (mqttConfig.enabled == true)
  {
    if (!mqttClient.connected())
    {
      reconnectMqtt();
    }
    mqttLoop();
  }
}

void setupWebSockets()
{
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

void setupE131()
{
  if (e131Config.enabled == true)
  {
    if (e131.begin(E131_UNICAST)) // Listen via Unicast
    {
      PL(___);
      PL(F("Listening for e131 data..."));
      PL(___);
    }
    else
      PL(F("*** e131.begin failed ***"));
  }
}

void setup()
{
  setupWriteSettings();         // Setup analog write settings
  initialStartup();             // Setup environment
  resetPreviousConnections();   // Reset previous connections
  setupEEPROM();                // Setup EEPROM
  readConfigJson(readEEPROM()); // Read config from EEPROM
  setupHardwareConfiguration(); // Setup GPIOs
  setStateFromSaved();          // Load saved state from EEPROM
  updateLumenatorLevels(true);  // Turn light on immediately on boot up
  setupWirelessConnection();    // Connect to WiFi or start access point
  setupWebServer();             // Start web server and assign callback
  setupWebSockets();            // Start web socket server and assign callback
  setupMqtt();                  // Setup MQTT
  setupE131();                  // Setup E131
}

void loop()
{
  webSocket.loop();               // Handle web socket events
  handleE131Loop();               // Handle E131 events
  handleMQTTLoop();               // Handle MQTT events
  server.handleClient();          // Handle webserver requests
  dnsServer.processNextRequest(); // Handle dns requests
  saveLevelsQueue();              // Save levels to eeprom if marked for save
}
