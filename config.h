#include <Arduino.h>

#include "eeprom-service.h"

#define STRING_SIZE 45
#define STRING_SIZE_SMALL 25

enum class Conf
{
  // Device
  DEVICE_NAME = 1,
  DEVICE_TYPE,
  // Network
  NETWORK_IP1,
  NETWORK_IP2,
  NETWORK_IP3,
  NETWORK_IP4,
  NETWORK_GATEWAY1,
  NETWORK_GATEWAY2,
  NETWORK_GATEWAY3,
  NETWORK_GATEWAY4,
  NETWORK_SUBNET1,
  NETWORK_SUBNET2,
  NETWORK_SUBNET3,
  NETWORK_SUBNET4,
  NETWORK_SSID,
  NETWORK_PASS,
  NETWORK_DHCP,
  NETWORK_GATEWAY,
  NETWORK_SUBNET,
  // Access Point
  ACCESS_POINT_PASS,
  // GPIO
  GPIO_W,
  GPIO_WW,
  GPIO_R,
  GPIO_G,
  GPIO_B,
  // MQTT
  MQTT_ENABLED,
  MQTT_CLIENT_ID,
  MQTT_USER,
  MQTT_PASSWORD,
  MQTT_IP1,
  MQTT_IP2,
  MQTT_IP3,
  MQTT_IP4,
  MQTT_PORT,
  MQTT_DEVICE_TOPIC,
  MQTT_AUTO_DISCOVERY
};

enum class DeviceType
{
  RGBWW = 1,
  RGBW,
  RGB,
  WW,
  W
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
  char name[STRING_SIZE] = "Lumenator";
  DeviceType type = DeviceType::RGBWW;
};

struct NetworkConfig
{
  char ssid[STRING_SIZE] = "MorrisWifi20";
  char pass[STRING_SIZE_SMALL] = "movies956chief9903";
  bool dhcp = true;
  IPv4 ip;
  IPGateway gateway;
  IPSubnet subnet;
};

struct AccessPointConfig
{
  char pass[STRING_SIZE_SMALL];
};

struct GpioConfig
{
  uint8_t r = 12;
  uint8_t g = 14;
  uint8_t b = 16;
  uint8_t w = 15;
  uint8_t ww = 13;
};

struct MqttConfig
{
  bool enabled = false;
  IPv4 ip;
  uint16_t port;
  char clientId[STRING_SIZE_SMALL];
  char user[STRING_SIZE];
  char pass[STRING_SIZE_SMALL];
  char topic[STRING_SIZE] = "lumenator";
  bool autoDiscovery = false;
};

DeviceConfig deviceConfig;
NetworkConfig networkConfig;
AccessPointConfig accessPointConfig;
GpioConfig gpioConfig;
MqttConfig mqttConfig;

const int configJsonTotalCapacity = EEPROM_SIZE;

#define MAX_DIGITS 3

char *id(Conf id)
{
  int number = static_cast<int>(id);
  char num_char[MAX_DIGITS + sizeof(char)];

  std::sprintf(num_char, "%d", number);
  return num_char;
}

void deserializeAll(DynamicJsonDocument json)
{
  strcpy(deviceConfig.name, json[id(Conf::DEVICE_NAME)]);
  deviceConfig.type = (DeviceType)(uint8_t)json[id(Conf::DEVICE_TYPE)];

  gpioConfig.r = (uint8_t)json[id(Conf::GPIO_R)];
  gpioConfig.g = (uint8_t)json[id(Conf::GPIO_G)];
  gpioConfig.b = (uint8_t)json[id(Conf::GPIO_B)];
  gpioConfig.w = (uint8_t)json[id(Conf::GPIO_W)];
  gpioConfig.ww = (uint8_t)json[id(Conf::GPIO_WW)];

  strcpy(networkConfig.ssid, json[id(Conf::NETWORK_SSID)]);
  strcpy(networkConfig.pass, json[id(Conf::NETWORK_PASS)]);
  networkConfig.dhcp = (bool)json[id(Conf::NETWORK_DHCP)];

  networkConfig.ip.a = (uint8_t)json[id(Conf::NETWORK_IP1)];
  networkConfig.ip.b = (uint8_t)json[id(Conf::NETWORK_IP2)];
  networkConfig.ip.c = (uint8_t)json[id(Conf::NETWORK_IP3)];
  networkConfig.ip.d = (uint8_t)json[id(Conf::NETWORK_IP4)];

  networkConfig.gateway.a = (uint8_t)json[id(Conf::NETWORK_GATEWAY1)];
  networkConfig.gateway.b = (uint8_t)json[id(Conf::NETWORK_GATEWAY2)];
  networkConfig.gateway.c = (uint8_t)json[id(Conf::NETWORK_GATEWAY3)];
  networkConfig.gateway.d = (uint8_t)json[id(Conf::NETWORK_GATEWAY4)];

  networkConfig.subnet.a = (uint8_t)json[id(Conf::NETWORK_SUBNET1)];
  networkConfig.subnet.b = (uint8_t)json[id(Conf::NETWORK_SUBNET2)];
  networkConfig.subnet.c = (uint8_t)json[id(Conf::NETWORK_SUBNET3)];
  networkConfig.subnet.d = (uint8_t)json[id(Conf::NETWORK_SUBNET4)];

  strcpy(accessPointConfig.pass, json[id(Conf::ACCESS_POINT_PASS)]);

  mqttConfig.enabled = (bool)json[id(Conf::MQTT_ENABLED)];
  strcpy(mqttConfig.clientId, json[id(Conf::MQTT_CLIENT_ID)]);

  mqttConfig.autoDiscovery = (bool)json[id(Conf::MQTT_AUTO_DISCOVERY)];

  strcpy(mqttConfig.user, json[id(Conf::MQTT_USER)]);
  strcpy(mqttConfig.pass, json[id(Conf::MQTT_PASSWORD)]);

  mqttConfig.ip.a = (uint8_t)json[id(Conf::MQTT_IP1)];
  mqttConfig.ip.b = (uint8_t)json[id(Conf::MQTT_IP2)];
  mqttConfig.ip.c = (uint8_t)json[id(Conf::MQTT_IP3)];
  mqttConfig.ip.d = (uint8_t)json[id(Conf::MQTT_IP4)];

  mqttConfig.port = (uint16_t)json[id(Conf::MQTT_PORT)];

  strcpy(mqttConfig.topic, json[id(Conf::MQTT_DEVICE_TOPIC)]);

  Serial.println("[DS]: * Loaded device configuration");
}

bool saveConfiguration(char dto[CONFIG_DTO_SIZE])
{
  const char *dBuffer = dto; // Needs to hold char[] in a const for deserializJson to work properly
  Serial.println("Config to save: ");
  Serial.println(dBuffer);
  Serial.println(printLine);
  DynamicJsonDocument json(configJsonTotalCapacity);
  DeserializationError error = deserializeJson(json, dBuffer);
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