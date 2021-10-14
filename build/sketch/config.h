#line 1 "/Users/patrickmorris/git/lumenator/config.h"
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
  MQTT_AUTO_DISCOVERY,
  // E131
  E131_ENABLED,
  E131_UNIVERSE,
  E131_START_CHAN,
  E131_MANUAL,
  E131_G_CHAN,
  E131_B_CHAN,
  E131_W_CHAN,
  E131_WW_CHAN,
  // INITIAL STATE
  INITIAL_W,
  INITIAL_WW,
  INITIAL_R,
  INITIAL_G,
  INITIAL_B
};

enum class DeviceType
{
  RGBWW = 1,
  RGBW,
  RGB,
  WW,
  W
};

char deviceTypeId[6][6] = {
    "\0",
    "rgbww",
    "rgbw",
    "rgb",
    "ww",
    "w"};

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
  char ssid[STRING_SIZE];
  char pass[STRING_SIZE_SMALL];
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

struct InitialState
{
  uint8_t r = 0;
  uint8_t g = 0;
  uint8_t b = 0;
  uint8_t w = 255;
  uint8_t ww = 0;
};

struct MqttConfig
{
  bool enabled = false;
  IPv4 ip;
  uint16_t port;
  char clientId[STRING_SIZE_SMALL];
  char user[STRING_SIZE];
  char pass[STRING_SIZE_SMALL];
  bool autoDiscovery = false;
  // Base Topic
  char topic[STRING_SIZE] = "lumenator";
  // Generated Topics
  char configTopic[50];
  char availTopic[50];
  char stateTopic[50];
  char commandTopic[50];
};

struct E131Config
{
  bool enabled = false;
  uint16_t universe = 1;
  uint16_t channel = 1;
  bool manual = false;
  uint16_t g = 2;
  uint16_t b = 3;
  uint16_t w = 4;
  uint16_t ww = 5;
};

DeviceConfig deviceConfig;
NetworkConfig networkConfig;
AccessPointConfig accessPointConfig;
GpioConfig gpioConfig;
MqttConfig mqttConfig;
InitialState initialState;
E131Config e131Config;

const int configJsonTotalCapacity = EEPROM_SIZE;

void deserializeAll(DynamicJsonDocument json)
{

  JsonArray arr = json.as<JsonArray>();
  strlcpy(deviceConfig.name, arr[(int)Conf::DEVICE_NAME] | deviceConfig.name, STRING_SIZE);
  deviceConfig.type = (DeviceType)(uint8_t)arr[(int)Conf::DEVICE_TYPE];

  // gpioConfig.r = (uint8_t)json[confId[(int)Conf::GPIO_R]];
  // gpioConfig.g = (uint8_t)json[confId[(int)Conf::GPIO_G]];
  // gpioConfig.b = (uint8_t)json[confId[(int)Conf::GPIO_B]];
  // gpioConfig.w = (uint8_t)json[confId[(int)Conf::GPIO_W]];
  // gpioConfig.ww = (uint8_t)json[confId[(int)Conf::GPIO_WW]];

  // strcpy(networkConfig.ssid, json[confId[(int)Conf::NETWORK_SSID]]);
  // strcpy(networkConfig.pass, json[confId[(int)Conf::NETWORK_PASS]]);
  // networkConfig.dhcp = (bool)json[confId[(int)Conf::NETWORK_DHCP]];

  // networkConfig.ip.a = (uint8_t)json[confId[(int)Conf::NETWORK_IP1]];
  // networkConfig.ip.b = (uint8_t)json[confId[(int)Conf::NETWORK_IP2]];
  // networkConfig.ip.c = (uint8_t)json[confId[(int)Conf::NETWORK_IP3]];
  // networkConfig.ip.d = (uint8_t)json[confId[(int)Conf::NETWORK_IP4]];

  // networkConfig.gateway.a = (uint8_t)json[confId[(int)Conf::NETWORK_GATEWAY1]];
  // networkConfig.gateway.b = (uint8_t)json[confId[(int)Conf::NETWORK_GATEWAY2]];
  // networkConfig.gateway.c = (uint8_t)json[confId[(int)Conf::NETWORK_GATEWAY3]];
  // networkConfig.gateway.d = (uint8_t)json[confId[(int)Conf::NETWORK_GATEWAY4]];

  // networkConfig.subnet.a = (uint8_t)json[confId[(int)Conf::NETWORK_SUBNET1]];
  // networkConfig.subnet.b = (uint8_t)json[confId[(int)Conf::NETWORK_SUBNET2]];
  // networkConfig.subnet.c = (uint8_t)json[confId[(int)Conf::NETWORK_SUBNET3]];
  // networkConfig.subnet.d = (uint8_t)json[confId[(int)Conf::NETWORK_SUBNET4]];

  // strcpy(accessPointConfig.pass, json[confId[(int)Conf::ACCESS_POINT_PASS]]);

  // mqttConfig.enabled = (bool)json[confId[(int)Conf::MQTT_ENABLED]];
  // strcpy(mqttConfig.clientId, json[confId[(int)Conf::MQTT_CLIENT_ID]]);

  // mqttConfig.autoDiscovery = (bool)json[confId[(int)Conf::MQTT_AUTO_DISCOVERY]];

  // strcpy(mqttConfig.user, json[confId[(int)Conf::MQTT_USER]]);
  // strcpy(mqttConfig.pass, json[confId[(int)Conf::MQTT_PASSWORD]]);

  // mqttConfig.ip.a = (uint8_t)json[confId[(int)Conf::MQTT_IP1]];
  // mqttConfig.ip.b = (uint8_t)json[confId[(int)Conf::MQTT_IP2]];
  // mqttConfig.ip.c = (uint8_t)json[confId[(int)Conf::MQTT_IP3]];
  // mqttConfig.ip.d = (uint8_t)json[confId[(int)Conf::MQTT_IP4]];

  // mqttConfig.port = (uint16_t)json[confId[(int)Conf::MQTT_PORT]];

  // strcpy(mqttConfig.topic, json[confId[(int)Conf::MQTT_DEVICE_TOPIC]]);

  // e131Config.enabled = (bool)json[confId[(int)Conf::E131_ENABLED]];
  // e131Config.universe = (uint8_t)json[confId[(int)Conf::E131_UNIVERSE]];
  // e131Config.channel = (uint8_t)json[confId[(int)Conf::E131_START_CHAN]];
  // e131Config.manual = (bool)json[confId[(int)Conf::E131_MANUAL]];
  // e131Config.g = (uint8_t)json[confId[(int)Conf::E131_G_CHAN]];
  // e131Config.b = (uint8_t)json[confId[(int)Conf::E131_B_CHAN]];
  // e131Config.w = (uint8_t)json[confId[(int)Conf::E131_W_CHAN]];
  // e131Config.ww = (uint8_t)json[confId[(int)Conf::E131_WW_CHAN]];

  Serial.println();
  Serial.println("[DS]: * Loaded device configuration");
}

bool saveConfiguration(char dto[CONFIG_DTO_SIZE])
{
  const char *dBuffer = dto; // Needs to hold char[] in a const for deserializJson to work properly
  Serial.println("Config to save: ");
  Serial.println(dBuffer);
  Serial.println(printLine);
  DynamicJsonDocument json(2048);
  DeserializationError error = deserializeJson(json, dBuffer);
  if (error)
  {
    Serial.println("");
    Serial.println("------- Save Configuration Parse Error -------");
    return false;
  }

  return false;

  deserializeAll(json);

  clearEEPROM();
  writeEEPROM(dto);

  return true;
}