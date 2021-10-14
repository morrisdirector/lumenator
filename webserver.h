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
              serializeAll();
              request->send(200, "application/json", dtoBuffer);
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

  server.on(
      "/update", HTTP_POST, [&](AsyncWebServerRequest *request)
      {
        // the request handler is triggered after the upload has finished...
        // create the response, add header, and send response
        AsyncWebServerResponse *response = request->beginResponse((Update.hasError()) ? 500 : 200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
        response->addHeader("Connection", "close");
        response->addHeader("Access-Control-Allow-Origin", "*");
        request->send(response);
        ESP.restart();
      },
      [&](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
      {
        //Upload handler chunks in data
        if (!index)
        {
          if (!request->hasParam("MD5", true))
          {
            return request->send(400, "text/plain", "MD5 parameter missing");
          }

          if (!Update.setMD5(request->getParam("MD5", true)->value().c_str()))
          {
            return request->send(400, "text/plain", "MD5 parameter invalid");
          }

          int cmd = U_FLASH;
          Update.runAsync(true);
          uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;
          Serial.print("maxSketchSpace = ");
          Serial.println(maxSketchSpace);
          if (!Update.begin(maxSketchSpace, cmd))
          { // Start with max available size
            Update.printError(Serial);
            return request->send(400, "text/plain", "OTA could not begin");
          }
        }

        // Write chunked data to the free sketch space
        if (len)
        {
          if (Update.write(data, len) != len)
          {
            return request->send(400, "text/plain", "OTA could not begin");
          }
        }

        if (final)
        { // if the final flag is set then this is the last frame of data
          Serial.println("made it to the end");
          if (!Update.end(true))
          { //true to set the size to the current progress
            Update.printError(Serial);
            Serial.println("But the end didn't work");
            return request->send(400, "text/plain", "Could not end OTA");
          }
        }
        else
        {
          return;
        }
      });
}