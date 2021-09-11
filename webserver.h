#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

// Web Data Includes:
#include "data/build/index.html.h"
#include "data/build/lumenator.js.h"
#include "data/build/setup.html.h"
#include "data/build/style.css.h"

// Web Server port 80
AsyncWebServer server(80);

char dtoBuffer[CONFIG_DTO_SIZE];

void onRequest(AsyncWebServerRequest *request)
{
  if (!!WiFi.softAPIP())
  {
    const String host = request->host();
    if (host == "clients3.google.com" || host == "connectivitycheck.android.com" ||
        host == "connectivitycheck.gstatic.com" || host == "www.msftconnecttest.com" ||
        host == "www.msftncsi.com" || host == "captive.apple.com" || host == "www.apple.com")
    {

      Serial.println("Redirecting to captive portal");

      String RedirectUrl = "http://";
      RedirectUrl += WiFi.softAPIP().toString();
      RedirectUrl += "/";
      request->redirect(RedirectUrl);
    }
  }
}

void initRoutes()
{

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              unsigned char *gz = !WiFi.softAPIP() ? index_html_gz : setup_html_gz;
              unsigned int len = !WiFi.softAPIP() ? index_html_gz_len : setup_html_gz_len;
              AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html", gz, len);
              response->addHeader("Content-Encoding", "gzip");
              request->send(response);
            });

  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              AsyncWebServerResponse *response =
                  request->beginResponse_P(200, "text/css", style_css_gz, style_css_gz_len);
              response->addHeader("Content-Encoding", "gzip");
              request->send(response);
            });

  server.on("/lumenator.js", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              AsyncWebServerResponse *response = request->beginResponse_P(
                  200, "application/javascript", lumenator_js_gz, lumenator_js_gz_len);
              response->addHeader("Content-Encoding", "gzip");
              request->send(response);
            });

  server.onNotFound(onRequest);

  server.on("/network-scan", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              String json = "[";
              int n = WiFi.scanComplete();
              if (n == -2)
              {
                WiFi.scanNetworks(true);
              }
              else if (n)
              {
                for (int i = 0; i < n; ++i)
                {
                  if (i)
                    json += ",";
                  json += "{";
                  json += "\"rssi\":" + String(WiFi.RSSI(i));
                  json += ",\"ssid\":\"" + WiFi.SSID(i) + "\"";
                  json += ",\"bssid\":\"" + WiFi.BSSIDstr(i) + "\"";
                  json += ",\"channel\":" + String(WiFi.channel(i));
                  json += ",\"secure\":" + String(WiFi.encryptionType(i));
                  json += ",\"hidden\":" + String(WiFi.isHidden(i) ? "true" : "false");
                  json += "}";
                }
                WiFi.scanDelete();
                if (WiFi.scanComplete() == -2)
                {
                  WiFi.scanNetworks(true);
                }
              }
              json += "]";
              request->send(200, "application/json", json);
              json = String();
            });

  server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              String response;
              DynamicJsonDocument doc(2048);

              if (deviceConfig.name != "null")
                doc[id(Conf::DEVICE_NAME)] = deviceConfig.name;

              doc[id(Conf::DEVICE_TYPE)] = (uint8_t)deviceConfig.type;

              doc[id(Conf::GPIO_R)] = (uint8_t)gpioConfig.r;
              doc[id(Conf::GPIO_G)] = (uint8_t)gpioConfig.g;
              doc[id(Conf::GPIO_B)] = (uint8_t)gpioConfig.b;
              doc[id(Conf::GPIO_W)] = (uint8_t)gpioConfig.w;
              doc[id(Conf::GPIO_WW)] = (uint8_t)gpioConfig.ww;

              if (networkConfig.ssid != "null")
                doc[id(Conf::NETWORK_SSID)] = networkConfig.ssid;

              if (networkConfig.pass != "null")
                doc[id(Conf::NETWORK_PASS)] = networkConfig.pass;

              doc[id(Conf::NETWORK_DHCP)] = (bool)networkConfig.dhcp;

              doc[id(Conf::NETWORK_IP1)] = (uint8_t)networkConfig.ip.a;
              doc[id(Conf::NETWORK_IP2)] = (uint8_t)networkConfig.ip.b;
              doc[id(Conf::NETWORK_IP3)] = (uint8_t)networkConfig.ip.c;
              doc[id(Conf::NETWORK_IP4)] = (uint8_t)networkConfig.ip.d;

              doc[id(Conf::NETWORK_GATEWAY1)] = (uint8_t)networkConfig.gateway.a;
              doc[id(Conf::NETWORK_GATEWAY2)] = (uint8_t)networkConfig.gateway.b;
              doc[id(Conf::NETWORK_GATEWAY3)] = (uint8_t)networkConfig.gateway.c;
              doc[id(Conf::NETWORK_GATEWAY4)] = (uint8_t)networkConfig.gateway.d;

              doc[id(Conf::NETWORK_SUBNET1)] = (uint8_t)networkConfig.subnet.a;
              doc[id(Conf::NETWORK_SUBNET2)] = (uint8_t)networkConfig.subnet.b;
              doc[id(Conf::NETWORK_SUBNET3)] = (uint8_t)networkConfig.subnet.c;
              doc[id(Conf::NETWORK_SUBNET4)] = (uint8_t)networkConfig.subnet.d;

              if (accessPointConfig.pass != "null")
                doc[id(Conf::ACCESS_POINT_PASS)] = accessPointConfig.pass;

              doc[id(Conf::MQTT_ENABLED)] = mqttConfig.enabled;

              if (mqttConfig.clientId != "null")
                doc[id(Conf::MQTT_CLIENT_ID)] = mqttConfig.clientId;

              doc[id(Conf::MQTT_AUTO_DISCOVERY)] = mqttConfig.autoDiscovery;

              if (mqttConfig.user != "null")
                doc[id(Conf::MQTT_USER)] = mqttConfig.user;

              if (mqttConfig.pass != "null")
                doc[id(Conf::MQTT_PASSWORD)] = mqttConfig.pass;

              doc[id(Conf::MQTT_IP1)] = mqttConfig.ip.a;
              doc[id(Conf::MQTT_IP2)] = mqttConfig.ip.b;
              doc[id(Conf::MQTT_IP3)] = mqttConfig.ip.c;
              doc[id(Conf::MQTT_IP4)] = mqttConfig.ip.d;

              doc[id(Conf::MQTT_PORT)] = mqttConfig.port;

              doc[id(Conf::MQTT_DEVICE_TOPIC)] = mqttConfig.topic;

              serializeJson(doc, response);
              request->send(200, "application/json", response);
            });

  server.on(
      "/config", HTTP_POST,
      [](AsyncWebServerRequest *request)
      {
        if (
            dtoBuffer == "" || !saveConfiguration(dtoBuffer))
        {
          request->send(500, "application/json", "{\"success\": false}");
        }
        else
        {
          request->send(200, "application/json", "{\"success\": true}");
        }
      },
      NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
      {
        char *packetText;
        packetText = (char *)data;

        if (index == 0)
        {
          for (int i = 0; i <= CONFIG_DTO_SIZE; ++i)
          {
            dtoBuffer[i] = NULL;
          }
          dtoBuffer[0] = '\0';
          strncpy(dtoBuffer, packetText, len);
        }
        else
        {
          strncat(dtoBuffer, packetText, len);
        }
        // Serial.println("----------------------");
        // Serial.println("Current Buffer: ");
        // Serial.println(dtoBuffer);
        // Serial.println("----------------------");
      });

  server.on(
      "/restart", HTTP_POST,
      [](AsyncWebServerRequest *request)
      {
        request->send(200, "application/json", "{\"success\": true}");
        Serial.print("restarting!!!!");
        ESP.restart();
      },
      NULL,
      [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
      {
        Serial.print("restarting!");
        ESP.reset();
      });

  // server.on(
  //     "/update", HTTP_POST, [](AsyncWebServerRequest *request)
  //     {
  //       shouldReboot = !Update.hasError();
  //       AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", shouldReboot ? "OK" : "FAIL");
  //       response->addHeader("Connection", "close");
  //       request->send(response);
  //     },
  //     [](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
  //     {
  //       if (!index)
  //       {
  //         Serial.printf("Update Start: %s\n", filename.c_str());
  //         Update.runAsync(true);
  //         if (!Update.begin((ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000))
  //         {
  //           Update.printError(Serial);
  //         }
  //       }
  //       if (!Update.hasError())
  //       {
  //         if (Update.write(data, len) != len)
  //         {
  //           Update.printError(Serial);
  //         }
  //       }
  //       if (final)
  //       {
  //         if (Update.end(true))
  //         {
  //           Serial.printf("Update Success: %uB\n", index + len);
  //         }
  //         else
  //         {
  //           Update.printError(Serial);
  //         }
  //       }
  //     });

  // server.on("/devicePresets", HTTP_GET, [](AsyncWebServerRequest *request) {
  //   request->send(SPIFFS, "/device-presets.json", "application/json");
  // });
}