#include <Arduino.h>

struct DeviceConfig {
  String name;
  uint8_t type;
};

struct NetworkConfig {
  String ssid;
  String pass;
};

struct AccessPointConfig {
  String ssid = "Lumenator";
  String pass = "setup";
};

struct GpioConfig {
  uint8_t r;
  uint8_t g;
  uint8_t b;
  uint8_t w;
  uint8_t ww;
};

struct MqttConfig {
  bool enabled;
  uint8_t ip[4];
  uint16_t port;
  String client;
  String user;
  String pass;
};

DeviceConfig deviceConfig;
NetworkConfig networkConfig;
AccessPointConfig accessPointConfig;
GpioConfig gpioConfig;
MqttConfig mqttConfig;

void deserializeDeviceConfig(const JsonObject &json) {
  if (json.containsKey("device")) {
    JsonObject deviceJson = json["device"];

    if (deviceJson.containsKey("name"))
      deviceConfig.name = deviceJson["name"].as<String>();

    if (deviceJson.containsKey("type"))
      deviceConfig.type = deviceJson["type"].as<uint8_t>();
#ifdef DEBUG
    Serial.println("[DS]: * Device settings loaded");
#endif
  } else {
#ifdef DEBUG
    Serial.println("[DS]:   No device settings found");
#endif
  }
}

void deserializeGpioConfig(const JsonObject &json) {
  if (json.containsKey("gpio")) {
    JsonObject gpioJson = json["gpio"];

    if (gpioJson.containsKey("r"))
      gpioConfig.r = gpioJson["r"].as<uint8_t>();

    if (gpioJson.containsKey("g"))
      gpioConfig.g = gpioJson["g"].as<uint8_t>();

    if (gpioJson.containsKey("b"))
      gpioConfig.b = gpioJson["b"].as<uint8_t>();

    if (gpioJson.containsKey("w"))
      gpioConfig.w = gpioJson["w"].as<uint8_t>();

    if (gpioJson.containsKey("ww"))
      gpioConfig.ww = gpioJson["ww"].as<uint8_t>();
#ifdef DEBUG
    Serial.println("[DS]: * GPIO settings loaded");
#endif
  } else {
#ifdef DEBUG
    Serial.println("[DS]:   No GPIO settings found");
#endif
  }
}

void deserializeMqttConfig(const JsonObject &json) {
  if (json.containsKey("mqtt")) {
    JsonObject mqttJson = json["mqtt"];

    if (mqttJson.containsKey("enabled"))
      mqttConfig.enabled = mqttJson["enabled"].as<bool>();

    if (mqttJson.containsKey("ip")) {
      for (int i = 0; i < 4; ++i) {
        mqttConfig.ip[i] = mqttJson["ip"][i];
      }
    }

    if (mqttJson.containsKey("port"))
      mqttConfig.port = mqttJson["port"].as<uint8_t>();

    if (mqttJson.containsKey("client"))
      mqttConfig.client = mqttJson["client"].as<String>();

    if (mqttJson.containsKey("user"))
      mqttConfig.user = mqttJson["user"].as<String>();

    if (mqttJson.containsKey("pass"))
      mqttConfig.pass = mqttJson["pass"].as<String>();
#ifdef DEBUG
    Serial.println("[DS]: * MQTT settings loaded");
#endif
  } else {
#ifdef DEBUG
    Serial.println("[DS]:   No MQTT settings found");
#endif
  }
}

void deserializeNetworkConfig(const JsonObject &json) {
  if (json.containsKey("network")) {
    JsonObject networkJson = json["network"];

    if (networkJson.containsKey("ssid"))
      networkConfig.ssid = networkJson["ssid"].as<String>();

    if (networkJson.containsKey("pass"))
      networkConfig.pass = networkJson["pass"].as<String>();
#ifdef DEBUG
    Serial.println("[DS]: * Network settings loaded");
#endif
  } else {
#ifdef DEBUG
    Serial.println("[DS]:   No Network settings found");
#endif
  }
}

void deserializeAccessPointConfig(const JsonObject &json) {
  if (json.containsKey("accessPoint")) {
    JsonObject accessPointJson = json["network"];

    if (accessPointJson.containsKey("ssid"))
      accessPointConfig.ssid = accessPointJson["ssid"].as<String>();

    if (accessPointJson.containsKey("pass"))
      accessPointConfig.pass = accessPointJson["pass"].as<String>();
#ifdef DEBUG
    Serial.println("[DS]: * Access Point settings loaded");
#endif
  } else {
#ifdef DEBUG
    Serial.println("[DS]:   No Access Point settings found");
#endif
  }
}

void deserializeAll(DynamicJsonDocument json) {
  // Compile with serial printouts
#ifdef DEBUG
  Serial.println();
#endif
  deserializeDeviceConfig(json.as<JsonObject>());
  deserializeNetworkConfig(json.as<JsonObject>());
  deserializeAccessPointConfig(json.as<JsonObject>());
  deserializeGpioConfig(json.as<JsonObject>());
  deserializeMqttConfig(json.as<JsonObject>());
}

bool saveConfiguration(String dto) {
  // Serial.println();
  // Serial.println("Configuration Update DTO: ");
  // Serial.println(dto);

  // // Open file for writing
  // File file = SPIFFS.open(CONFIG_FILE, "w");
  // if (!file) {
  //   Serial.println(F("Failed to create config.json file"));
  //   return false;
  // }

  // DynamicJsonDocument json(1024);
  // DeserializationError error = deserializeJson(json, dto);
  // if (error) {
  //   Serial.println("");
  //   Serial.println("------- Save Configuration Parse Error -------");
  //   return false;
  // }

  // deserializeAll(json);

  // // Serialize JSON to file
  // if (serializeJson(json, file) == 0) {
  //   Serial.println(F("Failed to write to config.json file"));
  //   return false;
  // }

  // // Close the file
  // file.close();

  // return true;
}