#include <Arduino.h>

#include "eeprom-service.h"

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
  MQTT_CLIENT_NAME,
  MQTT_USER,
  MQTT_PASSWORD,
  MQTT_IP1,
  MQTT_IP2,
  MQTT_IP3,
  MQTT_IP4,
  MQTT_PORT
};

enum DeviceType
{
  LNONE,
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
  bool enabled = false;
  IPv4 ip;
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

const int configJsonTotalCapacity = JSON_OBJECT_SIZE(100);

String id(Conf id)
{
  return String(static_cast<int>(id));
}

void deserializeAll(DynamicJsonDocument json)
{
  Serial.println();

  deviceConfig.name = json[id(Conf::DEVICE_NAME)].as<String>();
  deviceConfig.type = json[id(Conf::DEVICE_TYPE)].as<DeviceType>();

  gpioConfig.r = json[id(Conf::GPIO_R)].as<uint8_t>();
  gpioConfig.g = json[id(Conf::GPIO_G)].as<uint8_t>();
  gpioConfig.b = json[id(Conf::GPIO_B)].as<uint8_t>();
  gpioConfig.w = json[id(Conf::GPIO_W)].as<uint8_t>();
  gpioConfig.ww = json[id(Conf::GPIO_WW)].as<uint8_t>();

  networkConfig.ssid = json[id(Conf::NETWORK_SSID)].as<String>();
  networkConfig.pass = json[id(Conf::NETWORK_PASS)].as<String>();
  networkConfig.dhcp = json[id(Conf::NETWORK_DHCP)].as<bool>();

  networkConfig.ip.a = json[id(Conf::NETWORK_IP1)].as<uint8_t>();
  networkConfig.ip.b = json[id(Conf::NETWORK_IP2)].as<uint8_t>();
  networkConfig.ip.c = json[id(Conf::NETWORK_IP3)].as<uint8_t>();
  networkConfig.ip.d = json[id(Conf::NETWORK_IP4)].as<uint8_t>();

  networkConfig.gateway.a = json[id(Conf::NETWORK_GATEWAY1)].as<uint8_t>();
  networkConfig.gateway.b = json[id(Conf::NETWORK_GATEWAY2)].as<uint8_t>();
  networkConfig.gateway.c = json[id(Conf::NETWORK_GATEWAY3)].as<uint8_t>();
  networkConfig.gateway.d = json[id(Conf::NETWORK_GATEWAY4)].as<uint8_t>();

  networkConfig.subnet.a = json[id(Conf::NETWORK_SUBNET1)].as<uint8_t>();
  networkConfig.subnet.b = json[id(Conf::NETWORK_SUBNET2)].as<uint8_t>();
  networkConfig.subnet.c = json[id(Conf::NETWORK_SUBNET3)].as<uint8_t>();
  networkConfig.subnet.d = json[id(Conf::NETWORK_SUBNET4)].as<uint8_t>();

  accessPointConfig.pass = json[id(Conf::ACCESS_POINT_PASS)].as<String>();

  mqttConfig.enabled = json[id(Conf::MQTT_ENABLED)].as<bool>();
  mqttConfig.client = json[id(Conf::MQTT_CLIENT_NAME)].as<String>();
  mqttConfig.user = json[id(Conf::MQTT_USER)].as<String>();
  mqttConfig.pass = json[id(Conf::MQTT_PASSWORD)].as<String>();

  mqttConfig.ip.a = json[id(Conf::MQTT_IP1)].as<uint8_t>();
  mqttConfig.ip.b = json[id(Conf::MQTT_IP2)].as<uint8_t>();
  mqttConfig.ip.c = json[id(Conf::MQTT_IP3)].as<uint8_t>();
  mqttConfig.ip.d = json[id(Conf::MQTT_IP4)].as<uint8_t>();

  mqttConfig.port = json[id(Conf::MQTT_PORT)].as<uint16_t>();

  Serial.println("[DS]: * Loaded device configuration");
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