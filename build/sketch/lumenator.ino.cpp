#include <Arduino.h>
#line 1 "/Users/patrickmorris/git/lumenator/lumenator.ino"
/*
  "Lumenator" v1.0
  by Patrick Morris
*/
#include <ArduinoJson.h>
#include <DNSServer.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h> //https://github.com/knolleary/pubsubclient

#define EEPROM_SIZE 1000
#define CONFIG_DTO_SIZE 1000

const char printLine[] = "----------------------------";

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

//  D1 Mini Pin Number Reference:
//  D0  16
//  D1  5
//  D2  4
//  D3  0
//  D4  2  (also this is the built in LED)
//  D5  14
//  D6  12
//  D7  13
//  D8  15
//  TX  1
//  RX  3

// To make Arduino IDE autodetect OTA device
// WiFiServer TelnetServer(8266);

#line 56 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void printWiFiStatus();
#line 79 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void startAccessPoint();
#line 103 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void startWiFi();
#line 155 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void setupHardwareConfiguration();
#line 220 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void readConfigJson(String configuration);
#line 243 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void setup();
#line 311 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void loop();
#line 56 "/Users/patrickmorris/git/lumenator/lumenator.ino"
void printWiFiStatus()
{

  Serial.println(" ");
  Serial.println(printLine);
  Serial.println("Connected to wifi");
  Serial.print("Status: ");
  Serial.println(WiFi.status());
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Subnet: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  Serial.print("Signal: ");
  Serial.println(WiFi.RSSI());
  Serial.print("Networks: ");
  Serial.println(WiFi.scanNetworks());
  Serial.println(printLine);
}

void startAccessPoint()
{

  Serial.println("Starting access point");

  apMode = true;
  WiFi.disconnect();
  delay(100);

  char nameBuff[50];
  int randomId = random(1000, 9999);
  sprintf(nameBuff, "Lumenator Setup - %d", randomId);
  WiFi.softAPConfig(apIP, apIP, apSubnet);
  WiFi.softAP(nameBuff);
  delay(500); // Without delay I've seen the IP address blank

  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  /* Setup the DNS server redirecting all the domains to the apIP */
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);
}

void startWiFi()
{

  Serial.println();
  Serial.println("Connecting to WiFi:");

  if (networkConfig.dhcp == false)
  {
    Serial.println("Static IP: ");
    Serial.print(networkConfig.ip.a);
    Serial.print(".");
    Serial.print(networkConfig.ip.b);
    Serial.print(".");
    Serial.print(networkConfig.ip.c);
    Serial.print(".");
    Serial.println(networkConfig.ip.d);

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

    Serial.print(".");

    if (i >= 30)
      break;
    i = ++i;
  }
  if (WiFi.status() == WL_CONNECTED)
  {

    Serial.print("Status: ");
    Serial.println(WiFi.status());
    printWiFiStatus();
  }
  else
  {

    Serial.println("Failed");

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

// void startOTAServer() {
//   TelnetServer.begin();
//   ArduinoOTA.onStart([]() { Serial.println("OTA Start"); });
//   ArduinoOTA.onEnd([]() {
//     Serial.println("OTA End");
//     Serial.println("Rebooting...");
//   });
//   ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
//     Serial.printf("Progress: %u%%\r\n", (progress / (total / 100)));
//   });
//   ArduinoOTA.onError([](ota_error_t error) {
//     Serial.printf("Error[%u]: ", error);
//     if (error == OTA_AUTH_ERROR)
//       Serial.println("Auth Failed");
//     else if (error == OTA_BEGIN_ERROR)
//       Serial.println("Begin Failed");
//     else if (error == OTA_CONNECT_ERROR)
//       Serial.println("Connect Failed");
//     else if (error == OTA_RECEIVE_ERROR)
//       Serial.println("Receive Failed");
//     else if (error == OTA_END_ERROR)
//       Serial.println("End Failed");
//   });
//   ArduinoOTA.begin();
// }

void readConfigJson(String configuration)
{
  if (configuration.length())
  {
    DynamicJsonDocument json(2048);
    DeserializationError error = deserializeJson(json, configuration);
    if (error)
    {

      Serial.print(error.c_str());

      Serial.println();
      Serial.println("----- Cannot Parse Configuration -----");
      Serial.println();

      if (configuration[0] != 0)
        clearEEPROM();
      return;
    }
    deserializeAll(json);
  }
}

void setup()
{
  analogWriteRange(255);
  analogWriteFreq(880);

  // Serial port for debugging purposes
  Serial.begin(115200);
  Serial.println();
  Serial.println("Starting Lumenator...");
  Serial.println();
  Serial.println("Disconnecting previously connected WiFi");

  WiFi.disconnect();
  WiFi.softAPdisconnect(true);
  EEPROM.begin(EEPROM_SIZE); // Initialasing EEPROM
  delay(10);

  readConfigJson(readEEPROM());

  setupHardwareConfiguration();

  updateLumenatorLevels(); // Turn light on immediately on boot up

  if (strlen(networkConfig.ssid) && strlen(networkConfig.pass))
  {
    startWiFi();
  }
  else
  {
    startAccessPoint();
  }

  // Setup HTTP server routes
  initRoutes();

  // Start web server
  server.begin();

  // Start WebSocket server and assign callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

  if (mqttConfig.enabled == true)
  {
    setupMqtt();
  }

  if (e131.begin(E131_UNICAST)) // Listen via Unicast
    Serial.println(F("Listening for e131 data..."));
  else
    Serial.println(F("*** e131.begin failed ***"));

  // startOTAServer();

  // char data[4096]; // Max 100 Bytes
  // int len = 0;
  // unsigned char k;
  // k = EEPROM.read(len);
  // while (k != '\0' && len < 4096) // Read until null character
  // {
  //   k = EEPROM.read(len);
  //   data[len] = k;
  //   len++;
  // }
  // data[len] = '\0';
  // Serial.println(String(data));
}

void loop()
{
  webSocket.loop();

  // E131:
  if (!e131.isEmpty())
  {
    e131Loop();
  }
  // MQTT:
  if (mqttConfig.enabled == true)
  {
    if (!mqttClient.connected())
    {
      reconnectMqtt();
    }
    mqttClient.loop();
  }

  // ArduinoOTA.handle();

  // DNS
  dnsServer.processNextRequest();
}

