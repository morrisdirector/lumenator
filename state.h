#include <ArduinoJson.h>

struct LumState
{
  CtrlMode ctrlMode = CtrlMode::WARM_WHITE;
  bool on = true;
  uint16_t brightness = 255;
  float brightnessMultiplier = 1;
  uint8_t temp = 153; // Mireds
  uint8_t r = 0;
  uint8_t g = 0;
  uint8_t b = 0;
  uint8_t w = 0;
  uint8_t ww = 255;
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
      if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
          deviceConfig.type == DeviceType::RGB)
      {
        analogWrite(gpioConfig.r, lumState.r * lumState.brightnessMultiplier);
        analogWrite(gpioConfig.g, lumState.g * lumState.brightnessMultiplier);
        analogWrite(gpioConfig.b, lumState.b * lumState.brightnessMultiplier);
      }
      break;
    case CtrlMode::TEMP:
      mapFromColorTemperature();
      if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::W || deviceConfig.type == DeviceType::WW)
        analogWrite(gpioConfig.w, lumState.w * lumState.brightnessMultiplier);
      if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
        analogWrite(gpioConfig.ww, lumState.ww * lumState.brightnessMultiplier);
      break;
    case CtrlMode::WHITE:
      lumState.temp = 153;
      mapFromColorTemperature();
      if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::W || deviceConfig.type == DeviceType::WW)
        analogWrite(gpioConfig.w, lumState.w * lumState.brightnessMultiplier);
      break;
    case CtrlMode::WARM_WHITE:
      lumState.temp = 500;
      mapFromColorTemperature();
      if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
        analogWrite(gpioConfig.ww, lumState.ww * lumState.brightnessMultiplier);
      break;
    }
  }
}

void saveLevels()
{
  Serial.println(printLine);
  Serial.println("Saving levels...");

  // Update Saved State
  savedState.ctrlMode = lumState.ctrlMode;
  savedState.on = lumState.on;
  savedState.brightness = lumState.brightness;
  savedState.temp = lumState.temp;
  savedState.r = lumState.r;
  savedState.g = lumState.g;
  savedState.b = lumState.b;
  savedState.w = lumState.w;
  savedState.ww = lumState.ww;

  serializeAll();
  commitConfiguration(dtoBuffer);
  Serial.println("Data Saved:");
  Serial.println(dtoBuffer);
  Serial.println(printLine);
}

unsigned long lastSaveAttemptTime = 0;
unsigned long saveDelay = 3000;
bool markedForSave = false;

void markForSave()
{
  lastSaveAttemptTime = millis();
  markedForSave = true;
}

void saveLevelsQueue()
{
  if (markedForSave == true && (millis() - lastSaveAttemptTime) > saveDelay)
  {
    lastSaveAttemptTime = millis();
    markedForSave = false;
    saveLevels();
  }
}