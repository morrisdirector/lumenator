#include <ESP8266WebServer.h>

// Web Data Includes:
#include "../build/index.html.h"
#include "../build/lumenator.js.h"
#include "../build/setup.html.h"
#include "../build/lumenator.css.h"

// Web Server port 80
ESP8266WebServer server(80);

const char *captiveHosts[] = {
    "clients3.google.com",
    "connectivitycheck.android.com",
    "connectivitycheck.gstatic.com",
    "www.msftconnecttest.com",
    "www.msftncsi.com",
    "captive.apple.com",
    "www.apple.com"};

void handleNotFound()
{
  if (WiFi.softAPIP() != IPAddress(0, 0, 0, 0))
  { // Check if in AP mode
    for (const char *host : captiveHosts)
    {
      if (server.hostHeader() == host)
      {
        Serial.println("Redirecting to captive portal");
        char RedirectUrl[128];
        snprintf(RedirectUrl, sizeof(RedirectUrl), "http://%s/", WiFi.softAPIP().toString().c_str());
        server.sendHeader("Location", RedirectUrl, true);
        server.send(302, "text/plain", ""); // Send a HTTP 302 redirect
        return;
      }
    }
  }

  server.send(404, "text/plain", "Not Found"); // Default 404 response if no captive portal redirect occurred
}

void handleRoot()
{
  unsigned char *gz;
  unsigned int len;
  if (WiFi.softAPIP())
  {
    gz = setup_html_gz;
    len = setup_html_gz_len;
  }
  else
  {
    gz = index_html_gz;
    len = index_html_gz_len;
  }

  server.sendHeader("Content-Encoding", "gzip");
  server.send_P(200, "text/html", (const char *)gz, len);
}

void handleJSFile()
{
  server.sendHeader("Content-Encoding", "gzip");
  server.send_P(200, "application/javascript", (const char *)lumenator_js_gz, lumenator_js_gz_len);
}

void handleCSSFile()
{
  server.sendHeader("Content-Encoding", "gzip");
  server.send_P(200, "text/css", (const char *)lumenator_css_gz, lumenator_css_gz_len);
}

void initRoutes()
{

  server.on("/", handleRoot);
  server.on("/lumenator.js", handleJSFile);
  server.on("/lumenator.css", handleCSSFile);
  server.onNotFound(handleNotFound);

  // server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
  //           {
  //             Serial.print("--> Navigating to /config");
  //             serializeAll();
  //             request->send(200, "application/json", dtoBuffer); });

  // server.on(
  //     "/config", HTTP_POST,
  //     [](AsyncWebServerRequest *request)
  //     {
  //       if (
  //           strcmp(dtoBuffer, "") == 0 || !saveConfiguration(dtoBuffer))
  //       {
  //         request->send(500, "application/json", "{\"success\": false}");
  //       }
  //       else
  //       {
  //         request->send(200, "application/json", "{\"success\": true}");
  //       }
  //     },
  //     NULL,
  //     [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
  //     {
  //       Serial.print("posting a config");
  //       char *packetText;
  //       packetText = (char *)data;

  //       if (index == 0)
  //       {
  //         for (int i = 0; i <= CONFIG_DTO_SIZE; ++i)
  //         {
  //           dtoBuffer[i] = NULL;
  //         }
  //         dtoBuffer[0] = '\0';
  //         strncpy(dtoBuffer, packetText, len);
  //       }
  //       else
  //       {
  //         strncat(dtoBuffer, packetText, len);
  //       }
  //     });

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
  //     "/update", HTTP_POST, [&](AsyncWebServerRequest *request)
  //     {
  //       // the request handler is triggered after the upload has finished...
  //       // create the response, add header, and send response
  //       AsyncWebServerResponse *response = request->beginResponse((Update.hasError()) ? 500 : 200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
  //       response->addHeader("Connection", "close");
  //       response->addHeader("Access-Control-Allow-Origin", "*");
  //       request->send(response);
  //       ESP.restart(); },
  //     [&](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
  //     {
  //       Serial.print("Updating");
  //       // Upload handler chunks in data
  //       if (!index)
  //       {
  //         if (!request->hasParam("MD5", true))
  //         {
  //           return request->send(400, "text/plain", "MD5 parameter missing");
  //         }

  //         if (!Update.setMD5(request->getParam("MD5", true)->value().c_str()))
  //         {
  //           return request->send(400, "text/plain", "MD5 parameter invalid");
  //         }

  //         int cmd = U_FLASH;
  //         Update.runAsync(true);
  //         uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;
  //         Serial.print("maxSketchSpace = ");
  //         Serial.println(maxSketchSpace);
  //         if (!Update.begin(maxSketchSpace, cmd))
  //         { // Start with max available size
  //           Update.printError(Serial);
  //           return request->send(400, "text/plain", "OTA could not begin");
  //         }
  //       }

  //       // Write chunked data to the free sketch space
  //       if (len)
  //       {
  //         if (Update.write(data, len) != len)
  //         {
  //           return request->send(400, "text/plain", "OTA could not begin");
  //         }
  //       }

  //       if (final)
  //       { // if the final flag is set then this is the last frame of data
  //         Serial.println("made it to the end");
  //         if (!Update.end(true))
  //         { // true to set the size to the current progress
  //           Update.printError(Serial);
  //           Serial.println("But the end didn't work");
  //           return request->send(400, "text/plain", "Could not end OTA");
  //         }
  //       }
  //       else
  //       {
  //         return;
  //       }
  //     });
}

void initAPIs()
{

  server.on(
      "/config", []()
      { serializeAll();
        server.send(200, "application/json", dtoBuffer); });

  // server.on("/config", HTTP_GET, [](AsyncWebServerRequest *request)
  //           {
  //             Serial.print("--> Navigating to /config");
  //             serializeAll();
  //             request->send(200, "application/json", dtoBuffer); });

  // server.on(
  //     "/config", HTTP_POST,
  //     [](AsyncWebServerRequest *request)
  //     {
  //       if (
  //           strcmp(dtoBuffer, "") == 0 || !saveConfiguration(dtoBuffer))
  //       {
  //         request->send(500, "application/json", "{\"success\": false}");
  //       }
  //       else
  //       {
  //         request->send(200, "application/json", "{\"success\": true}");
  //       }
  //     },
  //     NULL,
  //     [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
  //     {
  //       Serial.print("posting a config");
  //       char *packetText;
  //       packetText = (char *)data;

  //       if (index == 0)
  //       {
  //         for (int i = 0; i <= CONFIG_DTO_SIZE; ++i)
  //         {
  //           dtoBuffer[i] = NULL;
  //         }
  //         dtoBuffer[0] = '\0';
  //         strncpy(dtoBuffer, packetText, len);
  //       }
  //       else
  //       {
  //         strncat(dtoBuffer, packetText, len);
  //       }
  //     });

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
  //     "/update", HTTP_POST, [&](AsyncWebServerRequest *request)
  //     {
  //       // the request handler is triggered after the upload has finished...
  //       // create the response, add header, and send response
  //       AsyncWebServerResponse *response = request->beginResponse((Update.hasError()) ? 500 : 200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
  //       response->addHeader("Connection", "close");
  //       response->addHeader("Access-Control-Allow-Origin", "*");
  //       request->send(response);
  //       ESP.restart(); },
  //     [&](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
  //     {
  //       Serial.print("Updating");
  //       // Upload handler chunks in data
  //       if (!index)
  //       {
  //         if (!request->hasParam("MD5", true))
  //         {
  //           return request->send(400, "text/plain", "MD5 parameter missing");
  //         }

  //         if (!Update.setMD5(request->getParam("MD5", true)->value().c_str()))
  //         {
  //           return request->send(400, "text/plain", "MD5 parameter invalid");
  //         }

  //         int cmd = U_FLASH;
  //         Update.runAsync(true);
  //         uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;
  //         Serial.print("maxSketchSpace = ");
  //         Serial.println(maxSketchSpace);
  //         if (!Update.begin(maxSketchSpace, cmd))
  //         { // Start with max available size
  //           Update.printError(Serial);
  //           return request->send(400, "text/plain", "OTA could not begin");
  //         }
  //       }

  //       // Write chunked data to the free sketch space
  //       if (len)
  //       {
  //         if (Update.write(data, len) != len)
  //         {
  //           return request->send(400, "text/plain", "OTA could not begin");
  //         }
  //       }

  //       if (final)
  //       { // if the final flag is set then this is the last frame of data
  //         Serial.println("made it to the end");
  //         if (!Update.end(true))
  //         { // true to set the size to the current progress
  //           Update.printError(Serial);
  //           Serial.println("But the end didn't work");
  //           return request->send(400, "text/plain", "Could not end OTA");
  //         }
  //       }
  //       else
  //       {
  //         return;
  //       }
  //     });
}