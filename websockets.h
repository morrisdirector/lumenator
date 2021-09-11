#include <WebSocketsServer.h>

WebSocketsServer webSocket = WebSocketsServer(1337);
char msg_buf[10];

// void gpioCommand(char *command)
// {

// if (ctrlMode != CTRL_GPIO)
// {
//   ctrlMode = CTRL_GPIO;
//   // resetGpios();
// }
// if (strncmp((char *)command, "ctrl-ww:1", 9) == 0)
// {
//   // Warm White On
//   if (deviceConfig.type == DeviceType::RGBWW)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_ww, 255)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-ww:0", 9) == 0)
// {
//   // Warm White Off
//   if (deviceConfig.type == DeviceType::RGBWW)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_ww, 0)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-w:1", 8) == 0)
// {
//   // Cool White On
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_w, 255)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-w:0", 8) == 0)
// {
//   // Cool White Off
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_w, 0)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-r:1", 8) == 0)
// {
//   // Red On
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
//       deviceConfig.type == DeviceType::RGB)
//   {
//     analogWrite(gpioConfig.r, 255);
//   }
// }
// else if (strncmp((char *)command, "ctrl-r:0", 8) == 0)
// {
//   // Red Off
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
//       deviceConfig.type == DeviceType::RGB)
//   {
//     analogWrite(gpioConfig.r, 0);
//   }
// }
// else if (strncmp((char *)command, "ctrl-g:1", 8) == 0)
// {
//   // Green On
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
//       deviceConfig.type == DeviceType::RGB)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_g, 255)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-g:0", 8) == 0)
// {
//   // Green Off
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
//       deviceConfig.type == DeviceType::RGB)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_g, 0)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-b:1", 8) == 0)
// {
//   // Blue On
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
//       deviceConfig.type == DeviceType::RGB)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_b, 255)");
//   }
// }
// else if (strncmp((char *)command, "ctrl-b:0", 8) == 0)
// {
//   // Blue Off
//   if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
//       deviceConfig.type == DeviceType::RGB)
//   {
//     Serial.println("analogWrite(deviceConfig.gpio_b, 0)");
//   }
// }
// }

void whiteManualCommand(char *command)
{
  if (lumState.ctrlMode != CtrlMode::WHITE)
  {
    resetGpios();
    lumState.ctrlMode = CtrlMode::WHITE;
  }

  String white;
  white = command;
  String w = white.substring(12, 15);
  String ww = white.substring(19, 22);

  int wVal = w.toInt();
  int wwVal = ww.toInt();

  analogWrite(gpioConfig.w, wVal);
  analogWrite(gpioConfig.ww, wwVal);
}

void rgbManualCommand(char *command)
{
  if (lumState.ctrlMode != CtrlMode::RGB)
  {
    resetGpios();
    lumState.ctrlMode = CtrlMode::RGB;
  }

  String rgb;
  rgb = command;
  String r = rgb.substring(10, 13);
  String g = rgb.substring(16, 19);
  String b = rgb.substring(22);

  int rVal = r.toInt();
  int gVal = g.toInt();
  int bVal = b.toInt();

  analogWrite(gpioConfig.r, rVal);
  analogWrite(gpioConfig.g, gVal);
  analogWrite(gpioConfig.b, bVal);
}

uint8_t getGPIOAddress(CtrlMode ctrMd)
{
  if (ctrMd == CtrlMode::GPIO_R)
  {
    return gpioConfig.r;
  }
  else if (ctrMd == CtrlMode::GPIO_G)
  {
    return gpioConfig.g;
  }
  else if (ctrMd == CtrlMode::GPIO_B)
  {
    return gpioConfig.b;
  }
  else if (ctrMd == CtrlMode::GPIO_W)
  {
    return gpioConfig.w;
  }
  else if (ctrMd == CtrlMode::GPIO_WW)
  {
    return gpioConfig.ww;
  }
}

void GPIOTestCommand(char *text)
{
  char *gpioModeStr = subString(text, 5, 1);
  char *onOffStr = subString(text, 7, 1);
  CtrlMode newCtrlMode = (CtrlMode)atoi(gpioModeStr); // atoi converts string to number

  if (newCtrlMode != lumState.ctrlMode)
  {
    resetGpios();
    lumState.ctrlMode = (CtrlMode)newCtrlMode;
  }

  if (strncmp(onOffStr, "0", 1) == 0)
  {
    analogWrite(getGPIOAddress(lumState.ctrlMode), 0);
  }
  if (strncmp(onOffStr, "1", 1) == 0)
  {
    analogWrite(getGPIOAddress(lumState.ctrlMode), 255);
  }
}

// Callback: receiving any WebSocket message
void onWebSocketEvent(uint8_t client_num, WStype_t type, uint8_t *payload, size_t length)
{

  // Figure out the type of WebSocket event
  switch (type)
  {

  // Client has disconnected
  case WStype_DISCONNECTED:
    Serial.printf("[%u] Disconnected!", client_num);
    Serial.println();
    break;

  // New client has connected
  case WStype_CONNECTED:
  {
    IPAddress ip = webSocket.remoteIP(client_num);
    Serial.printf("[%u] Connection from ", client_num);
    Serial.println(ip.toString());
  }
  break;

  // Handle text messages from client
  case WStype_TEXT:

    char *text;
    text = (char *)payload;

    // Print out raw message
    Serial.printf("[%u] Command: %s", client_num, text);
    Serial.println();

    if (strncmp(text, "gpio", 4) == 0)
    {
      GPIOTestCommand(text);
    }
    else if (strncmp(text, "rgbctrl", 7) == 0)
    {
      rgbManualCommand(text);
    }
    else if (strncmp(text, "whitectrl", 9) == 0)
    {
      // white command:
      whiteManualCommand(text);
    }
    else if (strncmp(text, "standby", 7) == 0)
    {
      // Standby Mode
      resetGpios();
      lumState.ctrlMode = CtrlMode::STANDBY;
    }
    else if (strncmp(text, "erase", 5) == 0)
    {
      // Standby Mode
      resetGpios();
      lumState.ctrlMode = CtrlMode::STANDBY;
      clearEEPROM();
    }

    break;

  // For everything else: do nothing
  case WStype_BIN:
  case WStype_ERROR:
  case WStype_FRAGMENT_TEXT_START:
  case WStype_FRAGMENT_BIN_START:
  case WStype_FRAGMENT:
  case WStype_FRAGMENT_FIN:
  default:
    break;
  }
}