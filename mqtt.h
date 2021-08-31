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

void reconnectMqtt()
{
    while (!mqttClient.connected())
    {
        Serial.print("Attempting MQTT connection...");
        const int client_nameL = mqttConfig.client.length() + 1; // 1 extra char for the null terminator
        const int userL = mqttConfig.user.length() + 1;
        const int passwordL = mqttConfig.pass.length() + 1;
        const int topicL = mqttConfig.topic.length() + 1;
        char client_name[client_nameL]; // buffer to copy to
        char user[userL];
        char password[passwordL];
        char topic[topicL];
        mqttConfig.client.toCharArray(client_name, client_nameL); // perform the copy to the buffer
        mqttConfig.user.toCharArray(user, userL);
        mqttConfig.pass.toCharArray(password, passwordL);
        mqttConfig.topic.toCharArray(topic, topicL);
        if (mqttClient.connect(client_name, user, password))
        {
            Serial.println("connected");
            Serial.println("----------------------------");
            mqttClient.publish(topic, "online");
            mqttClient.subscribe(topic);
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