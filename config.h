#include <Arduino.h>

#include "eeprom-service.h"

#define STRING_SIZE 45
#define STRING_SIZE_SMALL 25

enum class Conf
{
  // Device
  DEVICE_CONFIG_VERSION = 1,
  DEVICE_NAME,
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
  E131_MIXING_STRATEGY,
  E131_UNIVERSE,
  E131_START_CHAN,
  E131_MANUAL,
  E131_G_CHAN,
  E131_B_CHAN,
  E131_W_CHAN,
  E131_WW_CHAN,
  // SAVED STATE
  STATE_CTRL_MODE,
  STATE_ON,
  STATE_BRIGHTNESS,
  STATE_TEMP,
  STATE_R,
  STATE_G,
  STATE_B,
  STATE_W,
  STATE_WW
};

enum class CtrlMode
{
  STANDBY, // OFF
  RGB,
  WHITE,      // SINGLE COLD WHITE
  WARM_WHITE, // SINGLE WARM WHITE
  TEMP,       // WARM/COLD WHITE
  E131,       // Active E131 streaming
  GPIO_R = 10,
  GPIO_G,
  GPIO_B,
  GPIO_W,
  GPIO_WW
};

enum class DeviceType
{
  RGBWW = 1,
  RGBW,
  RGB,
  WW,
  W
};

enum class E131MixingStrategy
{
  RGB_WWW = 1,
  RGBWWW
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
  float configVersion = 0.0; // Major version = incompatable config; Minor version = backwards compatable
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

struct SavedState
{
  CtrlMode ctrlMode = CtrlMode::WARM_WHITE;
  bool on = true;
  uint16_t brightness = 255;
  uint16_t temp = 500; // Mireds
  uint8_t r = 0;
  uint8_t g = 0;
  uint8_t b = 0;
  uint8_t w = 0;
  uint8_t ww = 255;
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
  E131MixingStrategy mixing = E131MixingStrategy::RGB_WWW;
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
E131Config e131Config;
SavedState savedState;

const int configJsonTotalCapacity = EEPROM_SIZE;

bool hasCharValue(char *val)
{
  return strlen(val) && strncmp(val, "null", 4) != 0;
}

char dtoBuffer[CONFIG_DTO_SIZE];

void serializeAll()
{
  DynamicJsonDocument doc(2048);
  JsonArray arr = doc.to<JsonArray>();

  arr.add(nullptr); // First item is null to align enums with indexes

  arr.add((float)deviceConfig.configVersion);
  arr.add(deviceConfig.name);
  arr.add((uint8_t)deviceConfig.type);

  arr.add((uint8_t)networkConfig.ip.a);
  arr.add((uint8_t)networkConfig.ip.b);
  arr.add((uint8_t)networkConfig.ip.c);
  arr.add((uint8_t)networkConfig.ip.d);

  arr.add((uint8_t)networkConfig.gateway.a);
  arr.add((uint8_t)networkConfig.gateway.b);
  arr.add((uint8_t)networkConfig.gateway.c);
  arr.add((uint8_t)networkConfig.gateway.d);

  arr.add((uint8_t)networkConfig.subnet.a);
  arr.add((uint8_t)networkConfig.subnet.b);
  arr.add((uint8_t)networkConfig.subnet.c);
  arr.add((uint8_t)networkConfig.subnet.d);

  arr.add(hasCharValue(networkConfig.ssid) ? networkConfig.ssid : nullptr);
  arr.add(hasCharValue(networkConfig.pass) ? networkConfig.pass : nullptr);
  arr.add((bool)networkConfig.dhcp);

  arr.add(hasCharValue(accessPointConfig.pass) ? accessPointConfig.pass : nullptr);

  arr.add((uint8_t)gpioConfig.w);
  arr.add((uint8_t)gpioConfig.ww);
  arr.add((uint8_t)gpioConfig.r);
  arr.add((uint8_t)gpioConfig.g);
  arr.add((uint8_t)gpioConfig.b);

  arr.add((bool)mqttConfig.enabled);
  arr.add(hasCharValue(mqttConfig.clientId) ? mqttConfig.clientId : nullptr);
  arr.add(hasCharValue(mqttConfig.user) ? mqttConfig.user : nullptr);
  arr.add(hasCharValue(mqttConfig.pass) ? mqttConfig.pass : nullptr);

  arr.add((uint8_t)mqttConfig.ip.a);
  arr.add((uint8_t)mqttConfig.ip.b);
  arr.add((uint8_t)mqttConfig.ip.c);
  arr.add((uint8_t)mqttConfig.ip.d);

  arr.add((uint16_t)mqttConfig.port);
  arr.add(hasCharValue(mqttConfig.topic) ? mqttConfig.topic : nullptr);
  arr.add((bool)mqttConfig.autoDiscovery);

  arr.add((bool)e131Config.enabled);
  arr.add((uint8_t)e131Config.mixing);
  arr.add((uint8_t)e131Config.universe);
  arr.add((uint8_t)e131Config.channel);
  arr.add((bool)e131Config.manual);
  arr.add((uint8_t)e131Config.g);
  arr.add((uint8_t)e131Config.b);
  arr.add((uint8_t)e131Config.w);
  arr.add((uint8_t)e131Config.ww);

  arr.add((uint8_t)savedState.ctrlMode);
  arr.add((bool)savedState.on);
  arr.add((uint16_t)savedState.brightness);
  arr.add((uint16_t)savedState.temp);
  arr.add((uint8_t)savedState.r);
  arr.add((uint8_t)savedState.g);
  arr.add((uint8_t)savedState.b);
  arr.add((uint8_t)savedState.w);
  arr.add((uint8_t)savedState.ww);

  serializeJson(arr, dtoBuffer);
}

bool configCompatabilityCheck()
{
  return ((int)deviceConfig.configVersion == CONFIG_MAJOR_VERSION_COMPATABILITY);
}

void deserializeAll(DynamicJsonDocument json)
{

  JsonArray arr = json.as<JsonArray>();

  deviceConfig.configVersion = (float)arr[(int)Conf::DEVICE_CONFIG_VERSION];

  if (!configCompatabilityCheck())
  {
    Serial.println("***** Detected incompatable configuration version *****");
    clearEEPROM();
    return;
  }

  strlcpy(deviceConfig.name, arr[(int)Conf::DEVICE_NAME] | deviceConfig.name, STRING_SIZE);
  deviceConfig.type = (DeviceType)(uint8_t)arr[(int)Conf::DEVICE_TYPE];

  networkConfig.ip.a = (uint8_t)arr[(int)Conf::NETWORK_IP1];
  networkConfig.ip.b = (uint8_t)arr[(int)Conf::NETWORK_IP2];
  networkConfig.ip.c = (uint8_t)arr[(int)Conf::NETWORK_IP3];
  networkConfig.ip.d = (uint8_t)arr[(int)Conf::NETWORK_IP4];

  networkConfig.gateway.a = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY1];
  networkConfig.gateway.b = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY2];
  networkConfig.gateway.c = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY3];
  networkConfig.gateway.d = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY4];

  networkConfig.subnet.a = (uint8_t)arr[(int)Conf::NETWORK_SUBNET1];
  networkConfig.subnet.b = (uint8_t)arr[(int)Conf::NETWORK_SUBNET2];
  networkConfig.subnet.c = (uint8_t)arr[(int)Conf::NETWORK_SUBNET3];
  networkConfig.subnet.d = (uint8_t)arr[(int)Conf::NETWORK_SUBNET4];

  strlcpy(networkConfig.ssid, arr[(int)Conf::NETWORK_SSID] | networkConfig.ssid, STRING_SIZE);
  strlcpy(networkConfig.pass, arr[(int)Conf::NETWORK_PASS] | networkConfig.pass, STRING_SIZE_SMALL);
  networkConfig.dhcp = (bool)arr[(int)Conf::NETWORK_DHCP];

  strlcpy(accessPointConfig.pass, arr[(int)Conf::ACCESS_POINT_PASS] | accessPointConfig.pass, STRING_SIZE_SMALL);

  gpioConfig.w = (uint8_t)arr[(int)Conf::GPIO_W];
  gpioConfig.ww = (uint8_t)arr[(int)Conf::GPIO_WW];
  gpioConfig.r = (uint8_t)arr[(int)Conf::GPIO_R];
  gpioConfig.g = (uint8_t)arr[(int)Conf::GPIO_G];
  gpioConfig.b = (uint8_t)arr[(int)Conf::GPIO_B];

  mqttConfig.enabled = (bool)arr[(int)Conf::MQTT_ENABLED];
  strlcpy(mqttConfig.clientId, arr[(int)Conf::MQTT_CLIENT_ID] | mqttConfig.clientId, STRING_SIZE_SMALL);
  strlcpy(mqttConfig.user, arr[(int)Conf::MQTT_USER] | mqttConfig.user, STRING_SIZE);
  strlcpy(mqttConfig.pass, arr[(int)Conf::MQTT_PASSWORD] | mqttConfig.pass, STRING_SIZE_SMALL);

  mqttConfig.ip.a = (uint8_t)arr[(int)Conf::MQTT_IP1];
  mqttConfig.ip.b = (uint8_t)arr[(int)Conf::MQTT_IP2];
  mqttConfig.ip.c = (uint8_t)arr[(int)Conf::MQTT_IP3];
  mqttConfig.ip.d = (uint8_t)arr[(int)Conf::MQTT_IP4];

  mqttConfig.port = (uint16_t)arr[(int)Conf::MQTT_PORT];

  strlcpy(mqttConfig.topic, arr[(int)Conf::MQTT_DEVICE_TOPIC] | mqttConfig.topic, STRING_SIZE);
  mqttConfig.autoDiscovery = (bool)arr[(int)Conf::MQTT_AUTO_DISCOVERY];

  e131Config.enabled = (bool)arr[(int)Conf::E131_ENABLED];
  e131Config.mixing = (E131MixingStrategy)(uint8_t)arr[(int)Conf::E131_MIXING_STRATEGY];
  e131Config.universe = (uint8_t)arr[(int)Conf::E131_UNIVERSE];
  e131Config.channel = (uint8_t)arr[(int)Conf::E131_START_CHAN];
  e131Config.manual = (bool)arr[(int)Conf::E131_MANUAL];
  e131Config.g = (uint8_t)arr[(int)Conf::E131_G_CHAN];
  e131Config.b = (uint8_t)arr[(int)Conf::E131_B_CHAN];
  e131Config.w = (uint8_t)arr[(int)Conf::E131_W_CHAN];
  e131Config.ww = (uint8_t)arr[(int)Conf::E131_WW_CHAN];

  savedState.ctrlMode = (CtrlMode)(uint8_t)arr[(int)Conf::STATE_CTRL_MODE];
  savedState.on = (bool)arr[(int)Conf::STATE_ON];
  savedState.brightness = (uint16_t)arr[(int)Conf::STATE_BRIGHTNESS];
  savedState.temp = (uint16_t)arr[(int)Conf::STATE_TEMP];
  savedState.r = (uint16_t)arr[(int)Conf::STATE_R];
  savedState.g = (uint16_t)arr[(int)Conf::STATE_G];
  savedState.b = (uint16_t)arr[(int)Conf::STATE_B];
  savedState.w = (uint16_t)arr[(int)Conf::STATE_W];
  savedState.ww = (uint16_t)arr[(int)Conf::STATE_WW];

  Serial.println();
  Serial.println("[DS]: * Loaded device configuration");
}

void commitConfiguration(char dto[CONFIG_DTO_SIZE])
{
  clearEEPROM();
  writeEEPROM(dto);
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

  deserializeAll(json);

  commitConfiguration(dto);

  return true;
}