#include <Arduino.h>

#include "eeprom-service.h"

enum DeviceType
{
  LRGBWW,
  LRGBW,
  LRGB,
  LWW,
  LW
};

struct IPv4
{
  uint8_t a = 0;
  uint8_t b = 0;
  uint8_t c = 0;
  uint8_t d = 0;
};

struct IPGateway
{
  uint8_t a = 192;
  uint8_t b = 168;
  uint8_t c = 1;
  uint8_t d = 1;
};

struct IPSubnet
{
  uint8_t a = 255;
  uint8_t b = 255;
  uint8_t c = 255;
  uint8_t d = 0;
};

struct DeviceConfig
{
  String name = "Lumenator";
  DeviceType type = LRGBWW;
};

struct NetworkConfig
{
  String ssid = "SSID";
  String pass = "password";
  bool dhcp = true;
  IPv4 ip;
  IPGateway gateway;
  IPSubnet subnet;
};

struct AccessPointConfig
{
  String pass;
};

struct GpioConfig
{
  uint8_t r = 0;
  uint8_t g = 0;
  uint8_t b = 0;
  uint8_t w = 0;
  uint8_t ww = 0;
};

struct MqttConfig
{
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

const int configJsonTotalCapacity =
    JSON_OBJECT_SIZE(20)   // Total sections at parent level plus buffer
    + JSON_OBJECT_SIZE(2)  // Total device props
    + JSON_OBJECT_SIZE(5)  // Total gpio props
    + JSON_OBJECT_SIZE(15) // Total network props
    + JSON_OBJECT_SIZE(1); // Total access point props

void deserializeDeviceConfig(const JsonObject &json)
{
  if (json.containsKey("device"))
  {
    JsonObject deviceJson = json["device"];

    if (deviceJson.containsKey("name"))
      deviceConfig.name = deviceJson["name"].as<String>();

    if (deviceJson.containsKey("type"))
      deviceConfig.type = deviceJson["type"].as<DeviceType>();

    Serial.println("[DS]: * Device settings loaded");
  }
  else
  {

    Serial.println("[DS]:   No device settings found");
  }
}

void deserializeGpioConfig(const JsonObject &json)
{
  if (json.containsKey("gpio"))
  {
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

    Serial.println("[DS]: * GPIO settings loaded");
  }
  else
  {

    Serial.println("[DS]:   No GPIO settings found");
  }
}

void deserializeMqttConfig(const JsonObject &json)
{
  if (json.containsKey("mqtt"))
  {
    JsonObject mqttJson = json["mqtt"];

    if (mqttJson.containsKey("enabled"))
      mqttConfig.enabled = mqttJson["enabled"].as<bool>();

    if (mqttJson.containsKey("ip"))
    {
      for (int i = 0; i < 4; ++i)
      {
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

    Serial.println("[DS]: * MQTT settings loaded");
  }
  else
  {

    Serial.println("[DS]:   No MQTT settings found");
  }
}

void deserializeNetworkConfig(const JsonObject &json)
{
  if (json.containsKey("network"))
  {
    JsonObject networkJson = json["network"];

    if (networkJson.containsKey("ssid"))
      networkConfig.ssid = networkJson["ssid"].as<String>();

    if (networkJson.containsKey("pass"))
      networkConfig.pass = networkJson["pass"].as<String>();

    if (networkJson.containsKey("dhcp"))
      networkConfig.dhcp = networkJson["dhcp"].as<bool>();

    if (networkJson.containsKey("ip"))
    {
      JsonObject ipJson = networkJson["ip"];

      if (ipJson.containsKey("a"))
        networkConfig.ip.a = ipJson["a"].as<uint8_t>();

      if (ipJson.containsKey("b"))
        networkConfig.ip.b = ipJson["b"].as<uint8_t>();

      if (ipJson.containsKey("c"))
        networkConfig.ip.c = ipJson["c"].as<uint8_t>();

      if (ipJson.containsKey("d"))
        networkConfig.ip.d = ipJson["d"].as<uint8_t>();
    }

    if (networkJson.containsKey("gateway"))
    {
      JsonObject gatewayJson = networkJson["gateway"];

      if (gatewayJson.containsKey("a"))
        networkConfig.gateway.a = gatewayJson["a"].as<uint8_t>();

      if (gatewayJson.containsKey("b"))
        networkConfig.gateway.b = gatewayJson["b"].as<uint8_t>();

      if (gatewayJson.containsKey("c"))
        networkConfig.gateway.c = gatewayJson["c"].as<uint8_t>();

      if (gatewayJson.containsKey("d"))
        networkConfig.gateway.d = gatewayJson["d"].as<uint8_t>();
    }

    if (networkJson.containsKey("subnet"))
    {
      JsonObject subnetJson = networkJson["subnet"];

      if (subnetJson.containsKey("a"))
        networkConfig.subnet.a = subnetJson["a"].as<uint8_t>();

      if (subnetJson.containsKey("b"))
        networkConfig.subnet.b = subnetJson["b"].as<uint8_t>();

      if (subnetJson.containsKey("c"))
        networkConfig.subnet.c = subnetJson["c"].as<uint8_t>();

      if (subnetJson.containsKey("d"))
        networkConfig.subnet.d = subnetJson["d"].as<uint8_t>();
    }

    Serial.println("[DS]: * Network settings loaded");
  }
  else
  {

    Serial.println("[DS]:   No Network settings found");
  }
}

void deserializeAccessPointConfig(const JsonObject &json)
{
  if (json.containsKey("accessPoint"))
  {
    JsonObject accessPointJson = json["accessPoint"];

    if (accessPointJson.containsKey("pass"))
      accessPointConfig.pass = accessPointJson["pass"].as<String>();

    Serial.println("[DS]: * Access Point settings loaded");
  }
  else
  {

    Serial.println("[DS]:   No Access Point settings found");
  }
}

void deserializeAll(DynamicJsonDocument json)
{
  // Compile with serial printouts

  Serial.println();

  deserializeDeviceConfig(json.as<JsonObject>());
  deserializeNetworkConfig(json.as<JsonObject>());
  deserializeAccessPointConfig(json.as<JsonObject>());
  deserializeGpioConfig(json.as<JsonObject>());
  deserializeMqttConfig(json.as<JsonObject>());
}

bool saveConfiguration(String dto)
{
  Serial.println();
  Serial.println("Configuration Update DTO: ");
  Serial.println(dto);

  DynamicJsonDocument json(1024);
  DeserializationError error = deserializeJson(json, dto);
  if (error)
  {
    Serial.println("");
    Serial.println("------- Save Configuration Parse Error -------");
    return false;
  }

  deserializeAll(json);

  clearEEPROM();
  writeEEPROM(dto);

  return true;
}