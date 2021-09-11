enum class CtrlMode
{
  STANDBY,
  RGB,
  WHITE,
  GPIO_R,
  GPIO_G,
  GPIO_B,
  GPIO_W,
  GPIO_WW
};

struct LumState
{
  CtrlMode ctrlMode = CtrlMode::STANDBY;
  bool on = true;
  uint16_t brightness = 255;
  int default_r = 0;
  int default_g = 0;
  int default_b = 0;
  int default_w = 0;
  int default_ww = 0;
};

LumState lumState;