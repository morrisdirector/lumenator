import { DeviceType } from "../enums/DeviceType";
import { IConfigJson } from "../interfaces/IConfigJson";

export const testData = (): IConfigJson => {
  return {
    device: {
      name: "My Smart Bulb",
      type: DeviceType.RGBWW,
    },
    gpio: {
      w: 15,
      ww: 13,
      r: 12,
      g: 14,
      b: 16,
    },
    network: {
      ssid: "MySSID",
      pass: "password",
    },
  };
};
