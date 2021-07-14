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
    // mqtt: {
    //   mqtt_enabled: true,
    //   mqtt_client_name: "my_lumenator_1",
    //   mqtt_user: "mqtt_user",
    //   mqtt_password: "password",
    //   mqtt_ip: [192, 168, 1, 10],
    //   mqtt_port: 1883,
    // },
    network: {
      ssid: "MySSID",
      password: "password",
    },
  };
};
