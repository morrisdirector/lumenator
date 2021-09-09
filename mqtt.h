#include <Arduino.h>

PubSubClient mqttClient;

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
}

void publishAutoDiscoveryConfig()
{
    // String payload = "{\"~\":\"";
    // payload += mqttConfig.topic;
    // payload += "\",\"name\":\"";
    // payload += deviceConfig.name;
    // payload += "\",\"unique_id\":\"";
    // payload += mqttConfig.clientId;
    // payload += "\",\"bri_cmd_t\":\"~/brightness/set\",\"stat_t\":\"~/state\",\"brightness\":true}";

    // String configTopic = "homeassistant/light/";
    // configTopic += mqttConfig.clientId;
    // configTopic += "/config";
    // const int configTopicL = configTopic.length() + 1;
    // char config_topic[configTopicL];
    // configTopic.toCharArray(config_topic, configTopicL);

    // mqttClient.beginPublish(config_topic, payload.length(), false);
    // mqttClient.print(payload);
    // mqttClient.endPublish();
    // Serial.println("Auto discovery config sent");
}

void setupMqtt()
{
    mqttClient.setClient(espClient);
    IPAddress ipAddr = IPAddress(mqttConfig.ip.a, mqttConfig.ip.b,
                                 mqttConfig.ip.c,
                                 mqttConfig.ip.d);
    mqttClient.setServer(ipAddr, mqttConfig.port);
    mqttClient.setCallback(mqttCallback);
    Serial.println("MQTT client configured");
    Serial.print("IP: ");
    Serial.println(ipAddr);
    Serial.print("Port: ");
    Serial.println(mqttConfig.port);
}

void subscribeAll()
{
    // State Topic
    // String stateTopic = mqttConfig.topic;
    // stateTopic += "/state";
    // const int stateTopicL = stateTopic.length() + 1;
    // char state_topic[stateTopicL];
    // stateTopic.toCharArray(state_topic, stateTopicL);
    // mqttClient.subscribe(state_topic);
    // Serial.println("State topic: ");
    // Serial.println(state_topic);

    // Command Topic
    // String commandTopic = mqttConfig.topic;
    // commandTopic += "/brightness/set";
    // const int commandTopicL = commandTopic.length() + 1;
    // char command_topic[commandTopicL];
    // commandTopic.toCharArray(command_topic, commandTopicL);
    // mqttClient.subscribe(command_topic);
    // Serial.println("Brightness Command topic: ");
    // Serial.println(command_topic);
}

void reconnectMqtt()
{
    while (!mqttClient.connected())
    {

        Serial.print("Attempting MQTT connection...");
        if (mqttClient.connect(mqttConfig.clientId, mqttConfig.user, mqttConfig.pass, mqttConfig.topic, 1, true, "offline"))
        {
            Serial.println("connected");
            Serial.println(printLine);
            if (mqttConfig.autoDiscovery == true)
            {
                publishAutoDiscoveryConfig();
            }
            mqttClient.publish(mqttConfig.topic, "online");
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