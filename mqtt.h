#include <Arduino.h>

// void mqttCallback(char *topic, byte *payload, unsigned int length) {
//   Serial.print("Message arrived [");
//   Serial.print(topic);
//   Serial.print("] ");
//   for (int i = 0; i < length; i++) {
//     Serial.print((char)payload[i]);
//   }
//   Serial.println();
// }

// void setupMqtt() {
//   IPAddress ipAddr = IPAddress(mqttConfig.mqtt_ip[0], mqttConfig.mqtt_ip[1],
//   mqttConfig.mqtt_ip[2],
//                                mqttConfig.mqtt_ip[3]);
//   mqttClient.setServer(ipAddr, mqttConfig.mqtt_port);
//   mqttClient.setCallback(mqttCallback);
// }

// void reconnectMqtt() {
//   while (!mqttClient.connected()) {
//     Serial.print("Attempting MQTT connection...");
//     const int client_nameL = mqttConfig.mqtt_client_name.length() + 1;
//     const int userL = mqttConfig.mqtt_user.length() + 1;
//     const int passwordL = mqttConfig.mqtt_password.length() + 1;
//     char client_name[client_nameL];
//     char user[userL];
//     char password[passwordL];
//     mqttConfig.mqtt_client_name.toCharArray(client_name, client_nameL);
//     mqttConfig.mqtt_user.toCharArray(user, userL);
//     mqttConfig.mqtt_password.toCharArray(password, passwordL);
//     if (mqttClient.connect(client_name, user, password)) {
//       Serial.println("connected");
//       Serial.println("----------------------------");
//       // Once connected, publish an announcement...
//       mqttClient.publish("lumenator", "TVON");
//       // ... and resubscribe
//       mqttClient.subscribe("inTopic");
//     } else {
//       Serial.print("failed, rc=");
//       Serial.print(mqttClient.state());
//       Serial.println(" try again in 5 seconds");
//       delay(5000);
//     }
//   }
// }