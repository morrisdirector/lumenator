#include <Arduino.h>

char MQTT_ON[] = "ON";
char MQTT_OFF[] = "OFF";
char MQTT_ONLINE[] = "online";
char MQTT_OFFLINE[] = "offline";
char MQTT_ERROR[] = "-- Error parsing MQTT message --";

PubSubClient mqttClient;
String startAppendPayload(char *key, bool skipComma = false)
{
    String str = "";
    if (strlen(key))
    {
        if (!skipComma)
        {
            str += ",";
        }
        str += "\"";
        str += key;
        str += "\":";
    }
    return str;
}

String appendPayloadString(char *key, char *value, bool skipComma = false)
{
    String str = "";
    if (strlen(key) && strlen(value))
    {
        str += startAppendPayload(key, skipComma);
        str += "\"";
        str += value;
        str += "\"";
    }
    return str;
}

String appendPayloadBool(char *key, bool value = false, bool skipComma = false)
{
    String str = "";
    if (strlen(key))
    {
        str += startAppendPayload(key, skipComma);
        str += !!value ? "true" : "false";
    }
    return str;
}

String appendPayloadObjectString(char *key, char *value, bool skipComma = false)
{
    String str = "";
    if (strlen(key) && strlen(value))
    {
        str += startAppendPayload(key, skipComma);
        str += value;
    }
    return str;
}

void setTopics()
{
    // Set Config Topic
    if (strlen(mqttConfig.clientId))
    {
        for (int i = 0; i <= 50; ++i)
        {
            mqttConfig.configTopic[i] = NULL;
        }
        mqttConfig.configTopic[0] = '\0';
        strncpy(mqttConfig.configTopic, "homeassistant/light/", 20);
        strncat(mqttConfig.configTopic, mqttConfig.clientId, strlen(mqttConfig.clientId));
        strncat(mqttConfig.configTopic, "/config", 7);
    }

    // Set Availability Topic
    if (strlen(mqttConfig.topic))
    {
        for (int i = 0; i <= 50; ++i)
        {
            mqttConfig.availTopic[i] = NULL;
        }
        mqttConfig.availTopic[0] = '\0';
        strncat(mqttConfig.availTopic, mqttConfig.topic, strlen(mqttConfig.topic));
        strncat(mqttConfig.availTopic, "/avail", 6);
    }

    // Set State Topic
    if (strlen(mqttConfig.topic))
    {
        for (int i = 0; i <= 50; ++i)
        {
            mqttConfig.stateTopic[i] = NULL;
        }
        mqttConfig.stateTopic[0] = '\0';
        strncat(mqttConfig.stateTopic, mqttConfig.topic, strlen(mqttConfig.topic));
        strncat(mqttConfig.stateTopic, "/state", 6);
    }

    // Set Command Topic
    if (strlen(mqttConfig.topic))
    {
        for (int i = 0; i <= 50; ++i)
        {
            mqttConfig.commandTopic[i] = NULL;
        }
        mqttConfig.commandTopic[0] = '\0';
        strncat(mqttConfig.commandTopic, mqttConfig.topic, strlen(mqttConfig.topic));
        strncat(mqttConfig.commandTopic, "/set", 4);
    }
}

void sendState()
{
    DynamicJsonDocument json(512);
    json["state"] = (lumState.on == true ? MQTT_ON : MQTT_OFF);
    switch (lumState.ctrlMode)
    {
    case CtrlMode::WHITE:
        json["brightness"] = lumState.brightness;
        json["color_mode"] = "color_temp";
        json["color_temp"] = 153;
        break;
    case CtrlMode::WARM_WHITE:
        json["brightness"] = lumState.brightness;
        json["color_mode"] = "color_temp";
        json["color_temp"] = 500;
        break;
    case CtrlMode::TEMP:
        json["brightness"] = lumState.brightness;
        json["color_mode"] = "color_temp";
        json["color_temp"] = lumState.temp;
        break;
    case CtrlMode::RGB:
        json["brightness"] = lumState.brightness;
        json["color_mode"] = "rgb";
        JsonObject color = json.createNestedObject("color");
        color["r"] = lumState.r;
        color["g"] = lumState.g;
        color["b"] = lumState.b;
        break;
    }
    char msg[300];
    serializeJson(json, msg);
    mqttClient.publish(mqttConfig.stateTopic, msg);
}

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }
    Serial.println();

    // Received Command
    if (strncmp(topic, mqttConfig.commandTopic, strlen(mqttConfig.commandTopic)) == 0)
    {
        DynamicJsonDocument msg(JSON_OBJECT_SIZE(10));
        DeserializationError error = deserializeJson(msg, payload);
        if (error)
            Serial.println(MQTT_ERROR);
        else
        {
            lumState.on = !!(strncmp(msg["state"], MQTT_ON, 2) == 0);
            if (msg["brightness"] != nullptr)
            {
                lumState.brightness = (uint16_t)msg["brightness"];
            }
            if (msg["color"] != nullptr)
            {
                lumState.r = (uint16_t)msg["color"]["r"];
                lumState.g = (uint16_t)msg["color"]["g"];
                lumState.b = (uint16_t)msg["color"]["b"];
                lumState.ctrlMode = CtrlMode::RGB;
            }
            else if (msg["color_temp"] != nullptr)
            {
                if (msg["color_temp"] == 153)
                {
                    lumState.ctrlMode = CtrlMode::WHITE;
                }
                else if (msg["color_temp"] == 500)
                {
                    lumState.ctrlMode = CtrlMode::WARM_WHITE;
                }
                else
                {
                    lumState.ctrlMode = CtrlMode::TEMP;
                }
                lumState.temp = (uint16_t)msg["color_temp"];
            }
            updateLumenatorLevels();
            markForSave();
            sendState();
        }
    }
}

void publishAutoDiscoveryConfig()
{
    // Example working
    //  {
    //   "~": "mytest/kitchen4",
    //   "name": "Kitchen4",
    //   "unique_id": "kitchen_light4",
    //   "cmd_t": "~/set",
    //   "stat_t": "~/state",
    //   "schema": "json",
    //   "color_mode": true,
    //   "supported_color_modes": ["rgbww"]
    //  }
    String payload = "{";
    payload += appendPayloadString("~", mqttConfig.topic, true);
    payload += appendPayloadString("name", deviceConfig.name);
    payload += appendPayloadString("unique_id", mqttConfig.clientId);
    payload += appendPayloadString("cmd_t", "~/set");
    payload += appendPayloadString("stat_t", "~/state");
    payload += appendPayloadString("avty_t", "~/avail");
    payload += appendPayloadString("schema", "json");
    payload += appendPayloadBool("brightness", true);
    payload += appendPayloadBool("color_mode", true);
    payload += appendPayloadObjectString("supported_color_modes", "[\"rgb\",\"color_temp\"]");
    payload += "}";

    Serial.println();
    Serial.println("Payload: ");
    Serial.println(payload);
    Serial.println();

    mqttClient.beginPublish(mqttConfig.configTopic, payload.length(), false);
    mqttClient.print(payload);
    mqttClient.endPublish();
    Serial.println();
    Serial.println("* Auto discovery config sent");
}

void setupMqtt()
{
    mqttClient.setClient(espClient);
    IPAddress ipAddr = IPAddress(mqttConfig.ip.a, mqttConfig.ip.b,
                                 mqttConfig.ip.c,
                                 mqttConfig.ip.d);
    mqttClient.setServer(ipAddr, mqttConfig.port);
    mqttClient.setCallback(mqttCallback);
    setTopics();
    Serial.println("MQTT client configured");
    Serial.print("IP: ");
    Serial.println(ipAddr);
    Serial.print("Port: ");
    Serial.println(mqttConfig.port);
}

void subscribeAll()
{
    // Command Topic
    if (strlen(mqttConfig.commandTopic))
    {
        mqttClient.subscribe(mqttConfig.commandTopic);
        Serial.print("Subscribed to command topic: ");
        Serial.println(mqttConfig.commandTopic);
    }
}

void reconnectMqtt()
{
    while (!mqttClient.connected())
    {

        Serial.print("Attempting MQTT connection...");
        if (mqttClient.connect(mqttConfig.clientId, mqttConfig.user, mqttConfig.pass, mqttConfig.topic, 1, true, "offline"))
        {
            Serial.println("connected");
            if (mqttConfig.autoDiscovery == true && strlen(mqttConfig.configTopic))
            {
                publishAutoDiscoveryConfig();
            }
            Serial.println(printLine);
            mqttClient.publish(mqttConfig.availTopic, (const unsigned char *)MQTT_ONLINE, 6, true);
            subscribeAll();
            sendState();
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}