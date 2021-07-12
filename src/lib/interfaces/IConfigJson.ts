import { DeviceType } from "../enums/DeviceType";

export interface IConfigDevice {
  name: string;
  device_type: DeviceType;
  gpio_w: number;
  gpio_ww: number;
  gpio_r: number;
  gpio_g: number;
  gpio_b: number;
}

export interface IConfigMQTT {
  mqtt_enabled: true;
  mqtt_client_name: string;
  mqtt_user: string;
  mqtt_password: string;
  mqtt_ip: Array<number>;
  mqtt_port: number;
}

export interface IConfigNetwork {
  ssid: string;
  password: string;
}

export interface IConfigJson {
  device: IConfigDevice;
  mqtt: IConfigMQTT;
  network: IConfigNetwork;
}
