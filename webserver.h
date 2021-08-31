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

String dtoBuffer;

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
              StaticJsonDocument<configJsonTotalCapacity> doc;

              if (deviceConfig.name != "null")
                doc[id(Conf::DEVICE_NAME)] = deviceConfig.name;

              doc[id(Conf::DEVICE_TYPE)] = deviceConfig.type;

              if (networkConfig.ssid != "null")
                doc[id(Conf::NETWORK_SSID)] = networkConfig.ssid;

              if (networkConfig.pass != "null")
                doc[id(Conf::NETWORK_PASS)] = networkConfig.pass;

              doc[id(Conf::NETWORK_DHCP)] = networkConfig.dhcp;

              doc[id(Conf::NETWORK_IP1)] = networkConfig.ip.a;
              doc[id(Conf::NETWORK_IP2)] = networkConfig.ip.b;
              doc[id(Conf::NETWORK_IP3)] = networkConfig.ip.c;
              doc[id(Conf::NETWORK_IP4)] = networkConfig.ip.d;

              doc[id(Conf::NETWORK_GATEWAY1)] = networkConfig.gateway.a;
              doc[id(Conf::NETWORK_GATEWAY2)] = networkConfig.gateway.b;
              doc[id(Conf::NETWORK_GATEWAY3)] = networkConfig.gateway.c;
              doc[id(Conf::NETWORK_GATEWAY4)] = networkConfig.gateway.d;

              doc[id(Conf::NETWORK_SUBNET1)] = networkConfig.subnet.a;
              doc[id(Conf::NETWORK_SUBNET2)] = networkConfig.subnet.b;
              doc[id(Conf::NETWORK_SUBNET3)] = networkConfig.subnet.c;
              doc[id(Conf::NETWORK_SUBNET4)] = networkConfig.subnet.d;

              if (accessPointConfig.pass != "null")
                doc[id(Conf::ACCESS_POINT_PASS)] = accessPointConfig.pass;

              doc[id(Conf::GPIO_R)] = gpioConfig.r;
              doc[id(Conf::GPIO_G)] = gpioConfig.g;
              doc[id(Conf::GPIO_B)] = gpioConfig.b;
              doc[id(Conf::GPIO_W)] = gpioConfig.w;
              doc[id(Conf::GPIO_WW)] = gpioConfig.ww;

              doc[id(Conf::MQTT_ENABLED)] = mqttConfig.enabled;

              if (mqttConfig.client != "null")
                doc[id(Conf::MQTT_CLIENT_NAME)] = mqttConfig.client;

              if (mqttConfig.user != "null")
                doc[id(Conf::MQTT_USER)] = mqttConfig.user;

              if (mqttConfig.pass != "null")
                doc[id(Conf::MQTT_PASSWORD)] = mqttConfig.pass;

              doc[id(Conf::MQTT_IP1)] = mqttConfig.ip.a;
              doc[id(Conf::MQTT_IP2)] = mqttConfig.ip.b;
              doc[id(Conf::MQTT_IP3)] = mqttConfig.ip.c;
              doc[id(Conf::MQTT_IP4)] = mqttConfig.ip.d;

              doc[id(Conf::MQTT_PORT)] = mqttConfig.port;

              serializeJson(doc, response);
              request->send(200, "application/json", response);
            });

  server.on(
      "/config", HTTP_POST,
      [](AsyncWebServerRequest *request)
      {
        if (dtoBuffer == "" || !saveConfiguration(dtoBuffer))
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
        if (index == 0)
        {
          dtoBuffer = "";
        }
        char *text;
        text = (char *)data;

        for (size_t i = 0; i < len; i++)
        {
          dtoBuffer.concat(text[i]);
        }
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