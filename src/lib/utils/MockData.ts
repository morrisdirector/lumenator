import { DeviceType } from "../enums/DeviceType";
import { IConfigJson } from "../interfaces/IConfigJson";

export const testData = (): IConfigJson => {
  return {
    device: {
      name: "My Smart Bulb",
      device_type: DeviceType.RGBWW,
      gpio_w: 15,
      gpio_ww: 13,
      gpio_r: 12,
      gpio_g: 14,
      gpio_b: 16,
    },
    mqtt: {
      mqtt_enabled: true,
      mqtt_client_name: "my_lumenator_1",
      mqtt_user: "mqtt_user",
      mqtt_password: "password",
      mqtt_ip: [192, 168, 1, 10],
      mqtt_port: 1883,
    },
    network: {
      ssid: "MySSID",
      password: "password",
    },
  };
};
