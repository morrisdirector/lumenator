/*
  "Lumenator" v1.0
  by Patrick Morris
*/
#include <ArduinoJson.h>
// #include <ArduinoOTA.h>
#include <DNSServer.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
// #include <ESP8266mDNS.h>

// #include <FS.h>
// #include <PubSubClient.h> //https://github.com/knolleary/pubsubclient
// #include <WebSocketsServer.h>
// #include <WiFiUdp.h>
// #include <Wire.h>

bool apMode = false; // True when in "setup" access point mode is on
IPAddress apIP(192, 168, 4, 1);
IPAddress apSubnet(255, 255, 255, 0);

// DNS server
const byte DNS_PORT = 53;
DNSServer dnsServer;

WiFiClient espClient;

// Enums
enum controlMode
{
  STANDBY,
  RGB,
  WHITE,
  GPIO_R,
  GPIO_G,
  GPIO_B,
  GPIO_W,
  GPIO_WW,
};

int ctrlMode;

#include "utils.h"

#include "config.h"

#include "control.h"

#include "webserver.h"

#include "websockets.h"

#include "mqtt.h"

// #include "eeprom-service.h"

// bool configured = false;

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

// PubSubClient mqttClient(espClient);

/* ------- NETWORK CREDENTIALS ------- */
/* Fallback configuration if config.json is empty or fails */
// const char *fallbackSsid = mySSID;
// const char *fallbackPassword = myPASSWORD;
/* ----------------------------------- */

// const char CONFIG_FILE[] = "/config.json";

// To make Arduino IDE autodetect OTA device
// WiFiServer TelnetServer(8266);

// WebSockets Server port 1337
// WebSocketsServer webSocket = WebSocketsServer(1337);
// char msg_buf[10];

void printWiFiStatus()
{

  Serial.println(" ");
  Serial.println("----------------------------");
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
  Serial.println("----------------------------");
}

// void ctrlCommand(char *command) {
//   if (ctrlMode != CTRL_GPIO) {
//     ctrlMode = CTRL_GPIO;
//     resetGpios();
//   }
//   if (strncmp((char *)command, "ctrl-ww:1", 9) == 0) {
//     // Warm White On
//     if (deviceConfig.device_type == LRGBWW) {
//       analogWrite(deviceConfig.gpio_ww, 255);
//     }
//   } else if (strncmp((char *)command, "ctrl-ww:0", 9) == 0) {
//     // Warm White Off
//     if (deviceConfig.device_type == LRGBWW) {
//       analogWrite(deviceConfig.gpio_ww, 0);
//     }
//   } else if (strncmp((char *)command, "ctrl-w:1", 8) == 0) {
//     // Cool White On
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW) {
//       analogWrite(deviceConfig.gpio_w, 255);
//     }
//   } else if (strncmp((char *)command, "ctrl-w:0", 8) == 0) {
//     // Cool White Off
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW) {
//       analogWrite(deviceConfig.gpio_w, 0);
//     }
//   } else if (strncmp((char *)command, "ctrl-r:1", 8) == 0) {
//     // Red On
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
//         deviceConfig.device_type == LRGB) {
//       analogWrite(deviceConfig.gpio_r, 255);
//     }
//   } else if (strncmp((char *)command, "ctrl-r:0", 8) == 0) {
//     // Red Off
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
//         deviceConfig.device_type == LRGB) {
//       analogWrite(deviceConfig.gpio_r, 0);
//     }
//   } else if (strncmp((char *)command, "ctrl-g:1", 8) == 0) {
//     // Green On
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
//         deviceConfig.device_type == LRGB) {
//       analogWrite(deviceConfig.gpio_g, 255);
//     }
//   } else if (strncmp((char *)command, "ctrl-g:0", 8) == 0) {
//     // Green Off
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
//         deviceConfig.device_type == LRGB) {
//       analogWrite(deviceConfig.gpio_g, 0);
//     }
//   } else if (strncmp((char *)command, "ctrl-b:1", 8) == 0) {
//     // Blue On
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
//         deviceConfig.device_type == LRGB) {
//       analogWrite(deviceConfig.gpio_b, 255);
//     }
//   } else if (strncmp((char *)command, "ctrl-b:0", 8) == 0) {
//     // Blue Off
//     if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
//         deviceConfig.device_type == LRGB) {
//       analogWrite(deviceConfig.gpio_b, 0);
//     }
//   }
// }

// void rgbCtrlCommand(char *command) {
//   if (ctrlMode != CTRL_RGB) {
//     ctrlMode = CTRL_RGB;
//     resetGpios();
//   }

//   String rgb;
//   rgb = command;
//   String r = rgb.substring(10, 13);
//   String g = rgb.substring(16, 19);
//   String b = rgb.substring(22);

//   int rVal = r.toInt();
//   int gVal = g.toInt();
//   int bVal = b.toInt();

//   analogWrite(deviceConfig.gpio_r, rVal);
//   analogWrite(deviceConfig.gpio_g, gVal);
//   analogWrite(deviceConfig.gpio_b, bVal);
// }

// void whiteCtrlCommand(char *command) {
//   if (ctrlMode != CTRL_WHITE) {
//     ctrlMode = CTRL_WHITE;
//     resetGpios();
//   }

//   String white;
//   white = command;
//   String w = white.substring(12, 15);
//   String ww = white.substring(19, 22);

//   int wVal = w.toInt();
//   int wwVal = ww.toInt();

//   analogWrite(deviceConfig.gpio_w, wVal);
//   analogWrite(deviceConfig.gpio_ww, wwVal);
// }

// Callback: receiving any WebSocket message
// void onWebSocketEvent(uint8_t client_num, WStype_t type, uint8_t *payload, size_t length) {

//   // Figure out the type of WebSocket event
//   switch (type) {

//   // Client has disconnected
//   case WStype_DISCONNECTED:
//     Serial.printf("[%u] Disconnected!\n", client_num);
//     break;

//   // New client has connected
//   case WStype_CONNECTED: {
//     IPAddress ip = webSocket.remoteIP(client_num);
//     Serial.printf("[%u] Connection from ", client_num);
//     Serial.println(ip.toString());
//   } break;

//   // Handle text messages from client
//   case WStype_TEXT:

//     char *text;
//     text = (char *)payload;

//     // Print out raw message
//     Serial.printf("[%u] Command: %s\n", client_num, text);

//     if (strncmp(text, "config:", 7) == 0) {
//       // Save Configuration
//       String dto;
//       dto = text;
//       saveConfiguration(dto.substring(7));
//     } else if (strncmp(text, "ctrl", 4) == 0) {
//       // ctrl command:
//       ctrlCommand(text);
//     } else if (strncmp(text, "rgbctrl", 7) == 0) {
//       // rgbctrl command:
//       rgbCtrlCommand(text);
//     } else if (strncmp(text, "whitectrl", 9) == 0) {
//       // white command:
//       whiteCtrlCommand(text);
//     } else if (strncmp(text, "standby", 7) == 0) {
//       // Standby Mode
//       resetGpios();
//       ctrlMode = STANDBY;
//     }

//     break;

//   // For everything else: do nothing
//   case WStype_BIN:
//   case WStype_ERROR:
//   case WStype_FRAGMENT_TEXT_START:
//   case WStype_FRAGMENT_BIN_START:
//   case WStype_FRAGMENT:
//   case WStype_FRAGMENT_FIN:
//   default:
//     break;
//   }
// }

void startAccessPoint()
{

  Serial.println("Starting access point");

  apMode = true;
  WiFi.disconnect();
  delay(100);

  WiFi.softAPConfig(apIP, apIP, apSubnet);
  WiFi.softAP("Lumenator Setup");
  delay(500); // Without delay I've seen the IP address blank

  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  /* Setup the DNS server redirecting all the domains to the apIP */
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);

  // if (WiFi.softAPConfig(local_IP, gateway, subnet)) {
  //   Serial.println();
  //   Serial.println("Starting Access Point...");

  //   WiFi.softAP("lumenator", "getstarted");

  //   Serial.println();
  //   Serial.print("Soft-AP IP address = ");
  //   Serial.println(WiFi.softAPIP());
  // }

  // int n = WiFi.scanNetworks();
  // Serial.println("scan done");
  // if (n == 0)
  //   Serial.println("no networks found");
  // else {
  //   Serial.print(n);
  //   Serial.println(" networks found");
  //   for (int i = 0; i < n; ++i) {
  //     // Print SSID and RSSI for each network found
  //     Serial.print(i + 1);
  //     Serial.print(": ");
  //     Serial.print(WiFi.SSID(i));
  //     Serial.print(" (");
  //     Serial.print(WiFi.RSSI(i));
  //     Serial.print(")");
  //     Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
  //     delay(10);
  //   }
  // }
  // Serial.println("");
  // st = "<ol>";
  // for (int i = 0; i < n; ++i) {
  //   // Print SSID and RSSI for each network found
  //   st += "<li>";
  //   st += WiFi.SSID(i);
  //   st += " (";
  //   st += WiFi.RSSI(i);

  //   st += ")";
  //   st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
  //   st += "</li>";
  // }
  // st += "</ol>";
  // delay(100);
  // Serial.println("softap");
  // launchWeb();
  // Serial.println("over");
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
  if (deviceConfig.type == LRGBWW || deviceConfig.type == LWW)
  {
    // pinMode(gpioConfig.ww, OUTPUT);
    // analogWrite(gpioConfig.ww, 0);
  }
  if (deviceConfig.type == LRGBWW || deviceConfig.type == LRGBW || deviceConfig.type == LWW || deviceConfig.type == LW)
  {
    // pinMode(gpioConfig.w, OUTPUT);
    // analogWrite(gpioConfig.w, 0);
  }
  if (deviceConfig.type == LRGBWW || deviceConfig.type == LRGBW ||
      deviceConfig.type == LRGB)
  {
    pinMode(gpioConfig.r, OUTPUT);
    // pinMode(gpioConfig.g, OUTPUT);
    // pinMode(gpioConfig.b, OUTPUT);
    analogWrite(gpioConfig.r, 0);
    // analogWrite(gpioConfig.g, 0);
    // analogWrite(gpioConfig.b, 0);
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
    DynamicJsonDocument json(EEPROM_SIZE);
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

  // clearEEPROM();
  // delay(1000);
  // String myTest =
  //     "{\"device\":{\"name\":\"My "
  //     "Device\",\"type\":2},\"network\":{\"ssid\":\"MorrisWifi20\",\"pass\":\"xxxxx\"}}";

  // Serial.println("Configuration Data: ");
  // Serial.println(myTest);

  // readConfigJson(myTest);

  // // String myTest = "HI there haha";
  // for (int i = 0; i < myTest.length(); ++i)
  // {
  //   EEPROM.write(i, myTest[i]);
  // }
  // EEPROM.commit();

  // Serial.println();

  readConfigJson(readEEPROM());

  setupHardwareConfiguration();

  if (networkConfig.ssid.length() && networkConfig.pass.length())
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

  // if (mqttConfig.mqtt_enabled == true) {
  //   setupMqtt();
  // }

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
  // MQTT:
  // if (mqttConfig.mqtt_enabled == true) {
  //   if (!mqttClient.connected()) {
  //     reconnectMqtt();
  //   }
  //   mqttClient.loop();
  // }

  // ArduinoOTA.handle();

  // DNS
  dnsServer.processNextRequest();
}
