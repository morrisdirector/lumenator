#include <ArduinoJson.h>

struct LumState
{
  CtrlMode ctrlMode = CtrlMode::WARM_WHITE;
  bool on = false;
  uint16_t brightness = 255;
  float brightnessMultiplier = 1;
  uint16_t temp = 500; // Mireds
  uint8_t r = 0;
  uint8_t g = 0;
  uint8_t b = 0;
  uint8_t w = 0;
  uint8_t ww = 255;
};

LumState lumState;

/// Transition Settings:
unsigned long lastTransitionFrame = 0;
const int transitionDuration = 1000;
const int framesPerSecond = 24;
///

const int milisPerFrame = 1000 / framesPerSecond;
const int totalFrames = transitionDuration / milisPerFrame;

uint8_t transition_from_r;
uint8_t transition_from_g;
uint8_t transition_from_b;
uint8_t transition_from_w;
uint8_t transition_from_ww;
uint8_t transition_to_r;
uint8_t transition_to_g;
uint8_t transition_to_b;
uint8_t transition_to_w;
uint8_t transition_to_ww;
float frame_increment_r;
float frame_increment_g;
float frame_increment_b;
float frame_increment_w;
float frame_increment_ww;

int frame = 1;
bool transitionQueued = false;

void renderTransitionFrame(uint8_t r, uint8_t g, uint8_t b, uint8_t w, uint8_t ww)
{
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
  {
    analogWrite(gpioConfig.ww, ww);
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::WW || deviceConfig.type == DeviceType::WW)
  {
    analogWrite(gpioConfig.w, w);
  }
  if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
      deviceConfig.type == DeviceType::RGB)
  {
    analogWrite(gpioConfig.r, r);
    analogWrite(gpioConfig.g, g);
    analogWrite(gpioConfig.b, b);
  }
}

void renderTransition(uint8_t from_r = 0, uint8_t from_g = 0, uint8_t from_b = 0, uint8_t from_w = 0, uint8_t from_ww = 0, uint8_t to_r = 0, uint8_t to_g = 0, uint8_t to_b = 0, uint8_t to_w = 0, uint8_t to_ww = 0);

void renderTransition(uint8_t from_r, uint8_t from_g, uint8_t from_b, uint8_t from_w, uint8_t from_ww, uint8_t to_r, uint8_t to_g, uint8_t to_b, uint8_t to_w, uint8_t to_ww)
{

  transition_from_r = from_r;
  transition_from_g = from_g;
  transition_from_b = from_b;
  transition_from_w = from_w;
  transition_from_ww = from_ww;
  transition_to_r = to_r;
  transition_to_g = to_g;
  transition_to_b = to_b;
  transition_to_w = to_w;
  transition_to_ww = to_ww;

  frame_increment_r = (to_r - from_r) / totalFrames;
  frame_increment_g = (to_g - from_g) / totalFrames;
  frame_increment_b = (to_b - from_b) / totalFrames;
  frame_increment_w = (to_w - from_w) / totalFrames;
  frame_increment_ww = (to_ww - from_ww) / totalFrames;

  Serial.println("RENDER TRANSITION: ");
  Serial.print("from_r -> to_r: ");
  Serial.print(from_r);
  Serial.print(" -> ");
  Serial.println(to_r);
  Serial.print("from_g -> to_g: ");
  Serial.print(from_g);
  Serial.print(" -> ");
  Serial.println(to_g);
  Serial.print("from_b -> to_b: ");
  Serial.print(from_b);
  Serial.print(" -> ");
  Serial.println(to_b);
  Serial.print("from_w -> to_w: ");
  Serial.print(from_w);
  Serial.print(" -> ");
  Serial.println(to_w);
  Serial.print("from_ww -> to_ww: ");
  Serial.print(from_ww);
  Serial.print(" -> ");
  Serial.println(to_ww);

  transitionQueued = true;
  lastTransitionFrame = millis();
  frame = 1;
}

void transitionRenderQueue()
{
  if (transitionQueued == true && (millis() - lastTransitionFrame) > milisPerFrame)
  {
    if (frame <= totalFrames)
    {
      lastTransitionFrame = millis();
      uint8_t frame_r = transition_from_r + (frame_increment_r * frame);
      uint8_t frame_g = transition_from_g + (frame_increment_g * frame);
      uint8_t frame_b = transition_from_b + (frame_increment_b * frame);
      uint8_t frame_w = transition_from_w + (frame_increment_w * frame);
      uint8_t frame_ww = transition_from_ww + (frame_increment_ww * frame);
      renderTransitionFrame(frame_r, frame_g, frame_b, frame_w, frame_ww);
      frame = frame + 1;
      Serial.print("*");
    }
    else
    {
      renderTransitionFrame(transition_to_r, transition_to_g, transition_to_b, transition_to_w, transition_to_ww);
      transitionQueued = false;
    }
  }
}

void printCurrentState()
{
  Serial.println(printLine);
  Serial.println("*** Current lumState ***");
  Serial.print("ctrlMode: ");
  Serial.println((int)lumState.ctrlMode);
  Serial.print("on: ");
  Serial.println(lumState.on);
  Serial.print("brightness: ");
  Serial.println(lumState.brightness);
  Serial.print("temp: ");
  Serial.println(lumState.temp);
  Serial.print("r: ");
  Serial.println(lumState.r);
  Serial.print("g: ");
  Serial.println(lumState.g);
  Serial.print("b: ");
  Serial.println(lumState.b);
  Serial.print("w: ");
  Serial.println(lumState.w);
  Serial.print("ww: ");
  Serial.println(lumState.ww);
  Serial.println(printLine);
}

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

void updateLumenatorLevels(bool brightness = lumState.on, int r = lumState.r, int g = lumState.g, int b = lumState.b, int w = lumState.w, int ww = lumState.ww, int temp = lumState.temp, int brigthness = lumState.brightness);

void updateLumenatorLevels(bool on, int r, int g, int b, int w, int ww, int temp, int brightness)
{
  uint8_t prev_r = lumState.r;
  uint8_t prev_g = lumState.g;
  uint8_t prev_b = lumState.b;
  uint8_t prev_w = lumState.w;
  uint8_t prev_ww = lumState.ww;

  if (lumState.on == false && on == true)
  {
    prev_r = 0;
    prev_g = 0;
    prev_b = 0;
    prev_w = 0;
    prev_ww = 0;
  }

  Serial.print("prev_r: ");
  Serial.println(prev_r);
  Serial.print("prev_r: ");
  Serial.println(prev_g);
  Serial.print("prev_r: ");
  Serial.println(prev_b);
  Serial.print("prev_r: ");
  Serial.println(prev_w);
  Serial.print("prev_r: ");
  Serial.println(prev_ww);

  uint8_t val_r;
  uint8_t val_g;
  uint8_t val_b;
  uint8_t val_w;
  uint8_t val_ww;

  lumState.on = on;
  lumState.brightness = brightness;
  lumState.temp = temp;
  lumState.w = w;
  lumState.ww = ww;
  lumState.r = r;
  lumState.g = g;
  lumState.b = b;

  setBrightnessMultiplier();

  if (deviceConfig.transition != true)
  {
    resetGpios();
  }

  if (lumState.on)
  {
    switch (lumState.ctrlMode)
    {
    case CtrlMode::RGB:

      lumState.w = 0;
      lumState.ww = 0;

      val_r = lumState.r * lumState.brightnessMultiplier;
      val_g = lumState.g * lumState.brightnessMultiplier;
      val_b = lumState.b * lumState.brightnessMultiplier;

      if (deviceConfig.transition == true)
      {
        renderTransition(prev_r, prev_g, prev_b, prev_w, prev_ww, val_r, val_g, val_b);
      }
      else if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW ||
               deviceConfig.type == DeviceType::RGB)
      {
        analogWrite(gpioConfig.r, val_r);
        analogWrite(gpioConfig.g, val_g);
        analogWrite(gpioConfig.b, val_b);
      }
      break;
    case CtrlMode::TEMP:
      mapFromColorTemperature();

      lumState.r = 0;
      lumState.g = 0;
      lumState.b = 0;

      val_w = lumState.w * lumState.brightnessMultiplier;
      val_ww = lumState.ww * lumState.brightnessMultiplier;

      if (deviceConfig.transition == true)
      {
        renderTransition(prev_r, prev_g, prev_b, prev_w, prev_ww, 0, 0, 0, val_w, val_ww);
      }
      else
      {
        if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::W || deviceConfig.type == DeviceType::WW)
          analogWrite(gpioConfig.w, val_w);
        if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
          analogWrite(gpioConfig.ww, val_ww);
      }
      break;
    case CtrlMode::WHITE:
      lumState.temp = 153;
      mapFromColorTemperature();

      lumState.r = 0;
      lumState.g = 0;
      lumState.b = 0;
      lumState.ww = 0;

      val_w = lumState.w * lumState.brightnessMultiplier;

      if (deviceConfig.transition == true)
      {
        renderTransition(prev_r, prev_g, prev_b, prev_w, prev_ww, 0, 0, 0, val_w);
      }
      else if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::RGBW || deviceConfig.type == DeviceType::W || deviceConfig.type == DeviceType::WW)
      {
        analogWrite(gpioConfig.w, val_w);
      }
      break;
    case CtrlMode::WARM_WHITE:
      lumState.temp = 500;
      mapFromColorTemperature();

      lumState.r = 0;
      lumState.g = 0;
      lumState.b = 0;
      lumState.w = 0;

      val_ww = lumState.ww * lumState.brightnessMultiplier;

      if (deviceConfig.transition == true)
      {
        renderTransition(prev_r, prev_g, prev_b, prev_w, prev_ww, 0, 0, 0, 0, val_ww);
      }
      else if (deviceConfig.type == DeviceType::RGBWW || deviceConfig.type == DeviceType::WW)
      {
        analogWrite(gpioConfig.ww, val_ww);
      }
      break;
    }
  }
}

void saveLevels()
{
  // Update Saved State
  savedState.ctrlMode = (CtrlMode)(int)lumState.ctrlMode;
  savedState.on = (bool)lumState.on;
  savedState.brightness = (uint16_t)lumState.brightness;
  savedState.temp = (uint16_t)lumState.temp;
  savedState.r = (uint8_t)lumState.r;
  savedState.g = (uint8_t)lumState.g;
  savedState.b = (uint8_t)lumState.b;
  savedState.w = (uint8_t)lumState.w;
  savedState.ww = (uint8_t)lumState.ww;

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

void setStateFromSaved()
{
  if ((int)savedState.ctrlMode > 0)
  {
    lumState.ctrlMode = savedState.ctrlMode;
    lumState.on = savedState.on;
    lumState.brightness = savedState.brightness;
    lumState.temp = savedState.temp;
    lumState.w = savedState.w;
    lumState.ww = savedState.ww;
    lumState.r = savedState.r;
    lumState.g = savedState.g;
    lumState.b = savedState.b;
  }
}