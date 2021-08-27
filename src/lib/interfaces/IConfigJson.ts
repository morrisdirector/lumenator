import { DeviceType } from "../enums/DeviceType";

export interface IConfigIP {
  a: number;
  b: number;
  c: number;
  d: number;
}
export interface IConfigDevice {
  name: string;
  type: DeviceType;
}

export interface IConfigGPIO {
  w: number;
  ww: number;
  r: number;
  g: number;
  b: number;
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
  pass: string;
  dhcp: boolean;
  ip: IConfigIP | null;
  gateway: IConfigIP | null;
  subnet: IConfigIP | null;
}

export interface IConfigAccessPoint {
  pass: string;
}

export interface IConfigJson {
  device: IConfigDevice;
  gpio: IConfigGPIO;
  // mqtt: IConfigMQTT;
  network: IConfigNetwork;
  accessPoint: IConfigAccessPoint;
}
