#include <ArduinoJson.h>

enum class CtrlMode
{
  STANDBY, // OFF
  RGB,
  WHITE,      // SINGLE COLD WHITE
  WARM_WHITE, // SINGLE WARM WHITE
  TEMP,       // WARM/COLD WHITE
  GPIO_R,
  GPIO_G,
  GPIO_B,
  GPIO_W,
  GPIO_WW
};

struct LumState
{
  CtrlMode ctrlMode = CtrlMode::WHITE;
  bool on = true;
  uint16_t brightness = 255;
  float brightnessMultiplier = 1;
  int temp = 153; // Mireds
  int r = 0;
  int g = 0;
  int b = 0;
  int w = 255;
  int ww = 0;
};

LumState lumState;

void resetGpios()
{
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
  {
    analogWrite(gpioConfig.ww, 0);
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::WW || deviceConfig.type == DeviceType::WW)
  {
    analogWrite(gpioConfig.w, 0);
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
      deviceConfig.type == DeviceType::RGB)
  {
    analogWrite(gpioConfig.r, 0);
    analogWrite(gpioConfig.g, 0);
    analogWrite(gpioConfig.b, 0);
  }
}

void mapFromColorTemperature()
{
  lumState.w = map(lumState.temp, 153, 500, 255, 0);
  lumState.ww = map(lumState.temp, 153, 500, 0, 255);
}

void setBrightnessMultiplier()
{
  float brt = (float)map(lumState.brightness, 0, 255, 0, 100);
  lumState.brightnessMultiplier = brt / 100;
}

void updateLumenatorLevels(bool on = lumState.on, int r = lumState.r, int g = lumState.g, int b = lumState.b, int w = lumState.w, int ww = lumState.ww, int temp = lumState.temp, int brigthness = lumState.brightness);

void updateLumenatorLevels(bool on, int r, int g, int b, int w, int ww, int temp, int brightness)
{
  lumState.on = on;
  lumState.brightness = brightness;
  lumState.temp = temp;
  lumState.w = w;
  lumState.ww = ww;
  lumState.r = r;
  lumState.g = g;
  lumState.b = b;

  setBrightnessMultiplier();
  resetGpios();
  if (lumState.on)
  {
    switch (lumState.ctrlMode)
    {
    case CtrlMode::RGB:
      analogWrite(gpioConfig.r, lumState.r * lumState.brightnessMultiplier);
      analogWrite(gpioConfig.g, lumState.g * lumState.brightnessMultiplier);
      analogWrite(gpioConfig.b, lumState.b * lumState.brightnessMultiplier);
      break;
    case CtrlMode::TEMP:
      mapFromColorTemperature();
      analogWrite(gpioConfig.w, lumState.w * lumState.brightnessMultiplier);
      analogWrite(gpioConfig.ww, lumState.ww * lumState.brightnessMultiplier);
      break;
    case CtrlMode::WHITE:
      lumState.temp = 153;
      mapFromColorTemperature();
      analogWrite(gpioConfig.w, lumState.w * lumState.brightnessMultiplier);
      break;
    case CtrlMode::WARM_WHITE:
      lumState.temp = 500;
      mapFromColorTemperature();
      analogWrite(gpioConfig.ww, lumState.ww * lumState.brightnessMultiplier);
      break;
    }
  }
}