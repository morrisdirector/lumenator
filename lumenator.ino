/*
  "Lumenator" v1.0
  by Patrick Morris
*/
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <WebSocketsServer.h>
#include <Wire.h>
#include <credentials.h>

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

/* ------- NETWORK CREDENTIALS ------- */
/* Fallback configuration if config.json is empty or fails */
const char *ssid = mySSID;
const char *password = myPASSWORD;
/* ----------------------------------- */

const char CONFIG_FILE[] = "/config.json";

String dtoBuffer;

// Enums
enum ctrlModeSetting { STANDBY, CTRL_RGB, CTRL_WHITE, CTRL_GPIO };
enum deviceType { LRGBWW, LRGBW, LRGB };

int ctrlMode;

struct DeviceConfig {
  String name;
  String map_preset;
  uint8_t device_type;
  uint8_t gpio_w;
  uint8_t gpio_ww;
  uint8_t gpio_r;
  uint8_t gpio_g;
  uint8_t gpio_b;
};

struct NetworkConfig {
  String ssid;
  String password;
};

DeviceConfig deviceConfig;
NetworkConfig networkConfig;

// Web Server port 80
AsyncWebServer server(80);

// WebSockets Server port 1337
WebSocketsServer webSocket = WebSocketsServer(1337);
char msg_buf[10];

// Replaces placeholder with LED state value
String processor(const String &var) {
  Serial.println(var);
  // if (var == "STATE") {
  //   if (digitalRead(ledPin)) {
  //     ledState = "ON";
  //   } else {
  //     ledState = "OFF";
  //   }
  //   Serial.print(ledState);
  //   return ledState;
  // }
}

void initRoutes() {
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/index.html", String(), false, processor);
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/style.css", "text/css");
  });
  server.on("/icons.css", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/icons.css", "text/css");
  });
  server.on("/lumenator.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/lumenator.js", "application/javascript");
  });
  server.on("/components.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/components.js", "application/javascript");
  });
  server.on("/settings.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/settings.js", "application/javascript");
  });
  server.on("/utils.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/utils.js", "application/javascript");
  });
  server.on("/cp.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/www/cp.js", "application/javascript");
  });
  // Data:
  server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/config.json", "application/json");
  });
  server.on("/devicePresets", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/device-presets.json", "application/json");
  });
  server.on(
      "/config", HTTP_POST,
      [](AsyncWebServerRequest *request) {
        if (dtoBuffer == "" || !saveConfiguration(dtoBuffer)) {
          request->send(500, "application/json", "{\"success\": false}");
        } else {
          request->send(200, "application/json", "{\"success\": true}");
        }
      },
      NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
        if (index == 0) {
          dtoBuffer = "";
        }
        char *text;
        text = (char *)data;

        for (size_t i = 0; i < len; i++) {
          dtoBuffer.concat(text[i]);
        }
      });
}

void printWiFiStatus() {
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

void resetGpios() {
  if (deviceConfig.device_type == LRGBWW) {
    analogWrite(deviceConfig.gpio_ww, 0);
  }
  if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW) {
    analogWrite(deviceConfig.gpio_w, 0);
  }
  if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
      deviceConfig.device_type == LRGB) {
    analogWrite(deviceConfig.gpio_r, 0);
    analogWrite(deviceConfig.gpio_g, 0);
    analogWrite(deviceConfig.gpio_b, 0);
  }
}

void ctrlCommand(char *command) {
  if (ctrlMode != CTRL_GPIO) {
    ctrlMode = CTRL_GPIO;
    resetGpios();
  }
  if (strncmp((char *)command, "ctrl-ww:1", 9) == 0) {
    // Warm White On
    if (deviceConfig.device_type == LRGBWW) {
      analogWrite(deviceConfig.gpio_ww, 255);
    }
  } else if (strncmp((char *)command, "ctrl-ww:0", 9) == 0) {
    // Warm White Off
    if (deviceConfig.device_type == LRGBWW) {
      analogWrite(deviceConfig.gpio_ww, 0);
    }
  } else if (strncmp((char *)command, "ctrl-w:1", 8) == 0) {
    // Cool White On
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW) {
      analogWrite(deviceConfig.gpio_w, 255);
    }
  } else if (strncmp((char *)command, "ctrl-w:0", 8) == 0) {
    // Cool White Off
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW) {
      analogWrite(deviceConfig.gpio_w, 0);
    }
  } else if (strncmp((char *)command, "ctrl-r:1", 8) == 0) {
    // Red On
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
        deviceConfig.device_type == LRGB) {
      analogWrite(deviceConfig.gpio_r, 255);
    }
  } else if (strncmp((char *)command, "ctrl-r:0", 8) == 0) {
    // Red Off
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
        deviceConfig.device_type == LRGB) {
      analogWrite(deviceConfig.gpio_r, 0);
    }
  } else if (strncmp((char *)command, "ctrl-g:1", 8) == 0) {
    // Green On
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
        deviceConfig.device_type == LRGB) {
      analogWrite(deviceConfig.gpio_g, 255);
    }
  } else if (strncmp((char *)command, "ctrl-g:0", 8) == 0) {
    // Green Off
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
        deviceConfig.device_type == LRGB) {
      analogWrite(deviceConfig.gpio_g, 0);
    }
  } else if (strncmp((char *)command, "ctrl-b:1", 8) == 0) {
    // Blue On
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
        deviceConfig.device_type == LRGB) {
      analogWrite(deviceConfig.gpio_b, 255);
    }
  } else if (strncmp((char *)command, "ctrl-b:0", 8) == 0) {
    // Blue Off
    if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
        deviceConfig.device_type == LRGB) {
      analogWrite(deviceConfig.gpio_b, 0);
    }
  }
}

bool saveConfiguration(String dto) {
  Serial.println();
  Serial.println("Configuration Update DTO: ");
  Serial.println(dto);

  // Open file for writing
  File file = SPIFFS.open(CONFIG_FILE, "w");
  if (!file) {
    Serial.println(F("Failed to create config.json file"));
    return false;
  }

  DynamicJsonDocument json(1024);
  DeserializationError error = deserializeJson(json, dto);
  if (error) {
    Serial.println("");
    Serial.println("------- Save Configuration Parse Error -------");
    return false;
  }

  deserializeDeviceConfig(json.as<JsonObject>());
  deserializeNetworkConfig(json.as<JsonObject>());

  // Serialize JSON to file
  if (serializeJson(json, file) == 0) {
    Serial.println(F("Failed to write to config.json file"));
    return false;
  }

  // Close the file
  file.close();

  return true;
}

void rgbCtrlCommand(char *command) {
  if (ctrlMode != CTRL_RGB) {
    ctrlMode = CTRL_RGB;
    resetGpios();
  }

  String rgb;
  rgb = command;
  String r = rgb.substring(10, 13);
  String g = rgb.substring(16, 19);
  String b = rgb.substring(22);

  int rVal = r.toInt();
  int gVal = g.toInt();
  int bVal = b.toInt();

  analogWrite(deviceConfig.gpio_r, rVal);
  analogWrite(deviceConfig.gpio_g, gVal);
  analogWrite(deviceConfig.gpio_b, bVal);
}

// Callback: receiving any WebSocket message
void onWebSocketEvent(uint8_t client_num, WStype_t type, uint8_t *payload, size_t length) {

  // Figure out the type of WebSocket event
  switch (type) {

  // Client has disconnected
  case WStype_DISCONNECTED:
    Serial.printf("[%u] Disconnected!\n", client_num);
    break;

  // New client has connected
  case WStype_CONNECTED: {
    IPAddress ip = webSocket.remoteIP(client_num);
    Serial.printf("[%u] Connection from ", client_num);
    Serial.println(ip.toString());
  } break;

  // Handle text messages from client
  case WStype_TEXT:

    char *text;
    text = (char *)payload;

    // Print out raw message
    Serial.printf("[%u] Command: %s\n", client_num, text);

    if (strncmp(text, "config:", 7) == 0) {
      // Save Configuration
      String dto;
      dto = text;
      saveConfiguration(dto.substring(7));
    } else if (strncmp(text, "ctrl", 4) == 0) {
      // ctrl command:
      ctrlCommand(text);
    } else if (strncmp(text, "rgbctrl", 7) == 0) {
      // rgbctrl command:
      rgbCtrlCommand(text);
    } else if (strncmp(text, "standby", 7) == 0) {
      // Standby Mode
      resetGpios();
      ctrlMode = STANDBY;
    }

    break;

  // For everything else: do nothing
  case WStype_BIN:
  case WStype_ERROR:
  case WStype_FRAGMENT_TEXT_START:
  case WStype_FRAGMENT_BIN_START:
  case WStype_FRAGMENT:
  case WStype_FRAGMENT_FIN:
  default:
    break;
  }
}

void deserializeDeviceConfig(const JsonObject &json) {
  if (json.containsKey("device")) {
    JsonObject deviceJson = json["device"];
    deviceConfig.name = deviceJson["name"].as<String>();
    deviceConfig.map_preset = deviceJson["map_preset"].as<String>();
    deviceConfig.device_type = deviceJson["device_type"].as<uint8_t>();
    deviceConfig.gpio_w = deviceJson["gpio_w"].as<uint8_t>();
    deviceConfig.gpio_ww = deviceJson["gpio_ww"].as<uint8_t>();
    deviceConfig.gpio_r = deviceJson["gpio_r"].as<uint8_t>();
    deviceConfig.gpio_g = deviceJson["gpio_g"].as<uint8_t>();
    deviceConfig.gpio_b = deviceJson["gpio_b"].as<uint8_t>();
  } else {
    Serial.println("No device settings found.");
  }
}

void deserializeNetworkConfig(const JsonObject &json) {
  if (json.containsKey("network")) {
    JsonObject networkJson = json["network"];

    // Fallback to embedded ssid and password if null in config
    networkConfig.ssid = networkJson["ssid"].as<String>();
    networkConfig.password = networkJson["password"].as<String>();
    if (!networkConfig.ssid.length() || !networkConfig.password.length()) {
      networkConfig.ssid = ssid;
      networkConfig.password = password;
      Serial.println("No network credentials found in config.json.");
      Serial.println("Using fallback for credentials:");

    } else {
      Serial.println();
      Serial.println("Network credentials found in config.json:");
    }
    Serial.print("SSID: ");
    Serial.println(networkConfig.ssid);

  } else {
    Serial.println("No network settings found.");
  }
}

void readConfigJson() {
  File file = SPIFFS.open(CONFIG_FILE, "r");
  size_t size = file.size();

  std::unique_ptr<char[]> buf(new char[size]);
  file.readBytes(buf.get(), size);

  DynamicJsonDocument json(1024);
  DeserializationError error = deserializeJson(json, buf.get());
  if (error) {
    Serial.println("");
    Serial.println("------- Configuration File Parse Error -------");
    return;
  }

  deserializeDeviceConfig(json.as<JsonObject>());
  deserializeNetworkConfig(json.as<JsonObject>());
}

void startWiFi() {
  // Connect to Wi-Fi
  Serial.println(" ");
  Serial.println("Connecting to WiFi:");
  WiFi.begin(networkConfig.ssid, networkConfig.password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  printWiFiStatus();
}

void setupHardwareConfiguration() {
  if (deviceConfig.device_type == LRGBWW) {
    pinMode(deviceConfig.gpio_ww, OUTPUT);
    analogWrite(deviceConfig.gpio_ww, 0);
  }
  if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW) {
    pinMode(deviceConfig.gpio_w, OUTPUT);
    analogWrite(deviceConfig.gpio_w, 0);
  }
  if (deviceConfig.device_type == LRGBWW || deviceConfig.device_type == LRGBW ||
      deviceConfig.device_type == LRGB) {
    pinMode(deviceConfig.gpio_r, OUTPUT);
    pinMode(deviceConfig.gpio_g, OUTPUT);
    pinMode(deviceConfig.gpio_b, OUTPUT);
    analogWrite(deviceConfig.gpio_r, 0);
    analogWrite(deviceConfig.gpio_g, 0);
    analogWrite(deviceConfig.gpio_b, 0);
  }
}

void setup() {
  // Serial port for debugging purposes
  Serial.begin(115200);
  delay(10);
  analogWriteRange(255);
  analogWriteFreq(880);

  // Initialize SPIFFS
  if (!SPIFFS.begin()) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  readConfigJson();

  setupHardwareConfiguration();

  startWiFi();

  // Setup HTTP server routes
  initRoutes();

  // Start web server
  server.begin();

  // Start WebSocket server and assign callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

void loop() {
  // Look for and handle WebSocket data
  webSocket.loop();
}
