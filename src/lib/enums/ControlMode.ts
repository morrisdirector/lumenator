export enum ControlMode {
  STANDBY, // OFF
  RGB,
  WHITE, // SINGLE COLD WHITE
  WARM_WHITE, // SINGLE WARM WHITE
  TEMP, // WARM/COLD WHITE
  E131, // Active E131 streaming
  GPIO_R = 10,
  GPIO_G,
  GPIO_B,
  GPIO_W,
  GPIO_WW,
}
