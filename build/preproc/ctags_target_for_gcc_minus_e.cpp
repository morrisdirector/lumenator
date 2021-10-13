# 1 "/Users/patrickmorris/git/lumenator/lumenator.ino"
/*
  "Lumenator" v1.0
  by Patrick Morris
*/
# 6 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 8 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2
# 9 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2
# 10 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2
# 11 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2




const char printLine[] = "----------------------------";

bool apMode = false; // True when in "setup" access point mode is on
IPAddress apIP(192, 168, 4, 1);
IPAddress apSubnet(255, 255, 255, 0);

// DNS server
const byte DNS_PORT = 53;
DNSServer dnsServer;

WiFiClient espClient;

# 28 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 30 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 32 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 34 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 36 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 38 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

# 40 "/Users/patrickmorris/git/lumenator/lumenator.ino" 2

void printWiFiStatus()
{

  Serial.println(" ");
  Serial.println(printLine);
  Serial.println("Connected to wifi");
  Serial.print("Status: ");
  Serial.println(WiFi.status());
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Subnet: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  Serial.print("Signal: ");
  Serial.println(WiFi.RSSI());
  Serial.print("Networks: ");
  Serial.println(WiFi.scanNetworks());
  Serial.println(printLine);
}

void startAccessPoint()
{

  Serial.println("Starting access point");

  apMode = true;
  WiFi.disconnect();
  delay(100);

  char nameBuff[50];
  int randomId = random(1000, 9999);
  sprintf(nameBuff, "Lumenator Setup - %d", randomId);
  WiFi.softAPConfig(apIP, apIP, apSubnet);
  WiFi.softAP(nameBuff);
  delay(500); // Without delay I've seen the IP address blank

  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  /* Setup the DNS server redirecting all the domains to the apIP */
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);
}

void startWiFi()
{

  Serial.println();
  Serial.println("Connecting to WiFi:");

  if (networkConfig.dhcp == false)
  {
    Serial.println("Static IP: ");
    Serial.print(networkConfig.ip.a);
    Serial.print(".");
    Serial.print(networkConfig.ip.b);
    Serial.print(".");
    Serial.print(networkConfig.ip.c);
    Serial.print(".");
    Serial.println(networkConfig.ip.d);

    IPAddress local_IP(networkConfig.ip.a, networkConfig.ip.b, networkConfig.ip.c, networkConfig.ip.d);
    IPAddress gateway(192, 168, 1, 1);
    IPAddress subnet(255, 255, 0, 0);
    WiFi.config(local_IP, gateway, subnet);
  }

  WiFi.begin(networkConfig.ssid, networkConfig.pass);

  int i = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);

    Serial.print(".");

    if (i >= 30)
      break;
    i = ++i;
  }
  if (WiFi.status() == WL_CONNECTED)
  {

    Serial.print("Status: ");
    Serial.println(WiFi.status());
    printWiFiStatus();
  }
  else
  {

    Serial.println("Failed");

    startAccessPoint();
  }
}

void setupHardwareConfiguration()
{
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
  {
    if (gpioConfig.ww > 0)
    {
      pinMode(gpioConfig.ww, 0x01);
      analogWrite(gpioConfig.ww, 0);
    }
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::WW || deviceConfig.type == DeviceType::WW)
  {
    if (gpioConfig.w > 0)
    {
      pinMode(gpioConfig.w, 0x01);
      analogWrite(gpioConfig.w, 0);
    }
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
      deviceConfig.type == DeviceType::RGB)
  {
    if (gpioConfig.r > 0)
    {
      pinMode(gpioConfig.r, 0x01);
      analogWrite(gpioConfig.r, 0);
    }
    if (gpioConfig.g > 0)
    {
      pinMode(gpioConfig.g, 0x01);
      analogWrite(gpioConfig.g, 0);
    }
    if (gpioConfig.b > 0)
    {
      pinMode(gpioConfig.b, 0x01);
      analogWrite(gpioConfig.b, 0);
    }
  }
}

void readConfigJson(String configuration)
{
  if (configuration.length())
  {
    DynamicJsonDocument json(2048);
    DeserializationError error = deserializeJson(json, configuration);
    if (error)
    {

      Serial.print(error.c_str());

      Serial.println();
      Serial.println("----- Cannot Parse Configuration -----");
      Serial.println();

      if (configuration[0] != 0)
        clearEEPROM();
      return;
    }
    deserializeAll(json);
  }
}

void setup()
{
  analogWriteRange(255);
  analogWriteFreq(880);

  // Serial port for debugging purposes
  Serial.begin(115200);
  Serial.println();
  Serial.println("Starting Lumenator...");
  Serial.println();
  Serial.println("Disconnecting previously connected WiFi");

  WiFi.disconnect();
  WiFi.softAPdisconnect(true);
  EEPROM.begin(1000); // Initialasing EEPROM
  delay(10);

  readConfigJson(readEEPROM());

  setupHardwareConfiguration();

  updateLumenatorLevels(); // Turn light on immediately on boot up

  if (strlen(networkConfig.ssid) && strlen(networkConfig.pass))
  {
    startWiFi();
  }
  else
  {
    startAccessPoint();
  }

  // Setup HTTP server routes
  initRoutes();

  // Start web server
  server.begin();

  // Start WebSocket server and assign callback
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

  if (mqttConfig.enabled == true)
  {
    setupMqtt();
  }

  if (e131.begin(E131_UNICAST)) // Listen via Unicast
    Serial.println(((reinterpret_cast<const __FlashStringHelper *>((__extension__({static const char __c[] __attribute__((__aligned__(4))) __attribute__((section( "\".irom0.pstr." "lumenator.ino" "." "250" "." "14" "\", \"aSM\", @progbits, 1 #"))) = ("Listening for e131 data..."); &__c[0];}))))));
  else
    Serial.println(((reinterpret_cast<const __FlashStringHelper *>((__extension__({static const char __c[] __attribute__((__aligned__(4))) __attribute__((section( "\".irom0.pstr." "lumenator.ino" "." "252" "." "15" "\", \"aSM\", @progbits, 1 #"))) = ("*** e131.begin failed ***"); &__c[0];}))))));
}

void loop()
{
  webSocket.loop();

  // E131:
  if (!e131.isEmpty())
  {
    e131Loop();
  }
  // MQTT:
  if (mqttConfig.enabled == true)
  {
    if (!mqttClient.connected())
    {
      reconnectMqtt();
    }
    mqttClient.loop();
  }

  // DNS
  dnsServer.processNextRequest();
}
