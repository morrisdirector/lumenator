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
      dhcp: false,
      ip: { a: 192, b: 168, c: 1, d: 192 },
      gateway: { a: 192, b: 168, c: 1, d: 1 },
      subnet: { a: 255, b: 255, c: 0, d: 0 },
    },
    accessPoint: {
      pass: "ap_password",
    },
  };
};
