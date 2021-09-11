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
    DynamicJsonDocument json(JSON_OBJECT_SIZE(3));
    json["state"] = (lumState.on == true ? MQTT_ON : MQTT_OFF);
    json["brightness"] = lumState.brightness;
    char msg[50];
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
        DynamicJsonDocument msg(JSON_OBJECT_SIZE(4));
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
            sendState();
        }
    }
}

void publishAutoDiscoveryConfig()
{
    String payload = "{";
    payload += appendPayloadString("~", mqttConfig.topic, true);
    payload += appendPayloadString("name", deviceConfig.name);
    payload += appendPayloadString("unique_id", mqttConfig.clientId);
    payload += appendPayloadString("cmd_t", "~/set");
    payload += appendPayloadString("stat_t", "~/state");
    payload += appendPayloadString("avty_t", "~/avail");
    payload += appendPayloadString("pl_on", MQTT_ON);
    payload += appendPayloadString("pl_off", MQTT_OFF);
    payload += appendPayloadString("stat_val_tpl", "{{ value_json.state }}");
    payload += appendPayloadString("schema", "default");
    payload += appendPayloadBool("brightness", true);
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
    // State Topic
    // if (strlen(mqttConfig.stateTopic))
    // {
    //     mqttClient.subscribe(mqttConfig.stateTopic);
    //     Serial.print("Subscribed to state topic: ");
    //     Serial.println(mqttConfig.stateTopic);
    // }

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
            mqttClient.publish(mqttConfig.availTopic, MQTT_ONLINE);
            subscribeAll();
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