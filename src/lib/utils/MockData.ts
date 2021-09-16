import { Conf, IConfigJson } from "../interfaces/IConfigJson";

import { DeviceType } from "../enums/DeviceType";

export const testData = (): IConfigJson => {
  return {
    [Conf.DEVICE_NAME]: "My Smart Bulb",
    [Conf.DEVICE_TYPE]: DeviceType.RGBWW,
    [Conf.GPIO_R]: 12,
    [Conf.GPIO_G]: 14,
    [Conf.GPIO_B]: 16,
    [Conf.GPIO_W]: 15,
    [Conf.GPIO_WW]: 13,
    [Conf.NETWORK_SSID]: "My_SSID",
    [Conf.NETWORK_DHCP]: false,
    [Conf.NETWORK_IP1]: 192,
    [Conf.NETWORK_IP2]: 168,
    [Conf.NETWORK_IP3]: 1,
    [Conf.NETWORK_IP4]: 193,
    [Conf.NETWORK_GATEWAY1]: 192,
    [Conf.NETWORK_GATEWAY2]: 168,
    [Conf.NETWORK_GATEWAY3]: 1,
    [Conf.NETWORK_GATEWAY4]: 1,
    [Conf.NETWORK_SUBNET1]: 255,
    [Conf.NETWORK_SUBNET2]: 255,
    [Conf.NETWORK_SUBNET3]: 0,
    [Conf.NETWORK_SUBNET4]: 0,
  };
};
