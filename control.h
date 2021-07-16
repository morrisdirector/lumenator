void resetGpios()
{
  if (deviceConfig.type == LRGBWW || deviceConfig.type == LWW)
  {
    analogWrite(gpioConfig.ww, 0);
  }
  if (deviceConfig.type == LRGBWW || deviceConfig.type == LRGBW || deviceConfig.type == LWW || deviceConfig.type == LW)
  {
    analogWrite(gpioConfig.w, 0);
  }
  if (deviceConfig.type == LRGBWW || deviceConfig.type == LRGBW ||
      deviceConfig.type == LRGB)
  {
    analogWrite(gpioConfig.r, 0);
    analogWrite(gpioConfig.g, 0);
    analogWrite(gpioConfig.b, 0);
  }
}