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
              doc["device"]["name"] = deviceConfig.name;
              doc["device"]["type"] = deviceConfig.type;

              doc["gpio"]["r"] = gpioConfig.r;
              doc["gpio"]["g"] = gpioConfig.g;
              doc["gpio"]["b"] = gpioConfig.b;
              doc["gpio"]["w"] = gpioConfig.w;
              doc["gpio"]["ww"] = gpioConfig.ww;

              doc["network"]["ssid"] = networkConfig.ssid;
              doc["network"]["pass"] = networkConfig.pass;
              doc["network"]["dhcp"] = networkConfig.dhcp;
              doc["network"]["ip"]["a"] = networkConfig.ip.a;
              doc["network"]["ip"]["b"] = networkConfig.ip.b;
              doc["network"]["ip"]["c"] = networkConfig.ip.c;
              doc["network"]["ip"]["d"] = networkConfig.ip.d;
              doc["network"]["gateway"]["a"] = networkConfig.gateway.a;
              doc["network"]["gateway"]["b"] = networkConfig.gateway.b;
              doc["network"]["gateway"]["c"] = networkConfig.gateway.c;
              doc["network"]["gateway"]["d"] = networkConfig.gateway.d;
              doc["network"]["subnet"]["a"] = networkConfig.subnet.a;
              doc["network"]["subnet"]["b"] = networkConfig.subnet.b;
              doc["network"]["subnet"]["c"] = networkConfig.subnet.c;
              doc["network"]["subnet"]["d"] = networkConfig.subnet.d;

              doc["accessPoint"]["pass"] = accessPointConfig.pass;

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

  // server.on(
  //     "/restart", HTTP_POST,
  //     [](AsyncWebServerRequest *request)
  //     {
  //       request->send(200, "application/json", "{\"success\": true}");
  //       Serial.print("restarting!!!!");
  //       ESP.restart();
  //     },
  //     NULL,
  //     [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
  //     {
  //       Serial.print("restarting!");
  //       ESP.reset();
  //     });

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