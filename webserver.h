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
              // const int capacity = JSON_OBJECT_SIZE(3);
              StaticJsonDocument<configJsonTotalCapacity> doc;
              doc["value"] = 42;
              doc["lat"] = 48.748010;
              doc["lon"] = 2.293491;

              serializeJson(doc, response);
              request->send(200, "application/json", response);
            });

  // server.on("/devicePresets", HTTP_GET, [](AsyncWebServerRequest *request) {
  //   request->send(SPIFFS, "/device-presets.json", "application/json");
  // });

  // server.on(
  //     "/config", HTTP_POST,
  //     [](AsyncWebServerRequest *request) {
  //       if (dtoBuffer == "" || !saveConfiguration(dtoBuffer)) {
  //         request->send(500, "application/json", "{\"success\": false}");
  //       } else {
  //         request->send(200, "application/json", "{\"success\": true}");
  //       }
  //     },
  //     NULL,
  //     [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
  //       if (index == 0) {
  //         dtoBuffer = "";
  //       }
  //       char *text;
  //       text = (char *)data;

  //       for (size_t i = 0; i < len; i++) {
  //         dtoBuffer.concat(text[i]);
  //       }
  //     });
}