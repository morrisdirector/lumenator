import { DeviceType } from "../enums/DeviceType";

export enum Conf {
  // Device
  DEVICE_NAME = "a",
  DEVICE_TYPE = "b",
  // Network
  NETWORK_IP1 = "c",
  NETWORK_IP2 = "d",
  NETWORK_IP3 = "e",
  NETWORK_IP4 = "f",
  NETWORK_GATEWAY1 = "g",
  NETWORK_GATEWAY2 = "h",
  NETWORK_GATEWAY3 = "i",
  NETWORK_GATEWAY4 = "j",
  NETWORK_SUBNET1 = "k",
  NETWORK_SUBNET2 = "l",
  NETWORK_SUBNET3 = "m",
  NETWORK_SUBNET4 = "n",
  NETWORK_SSID = "o",
  NETWORK_PASS = "p",
  NETWORK_DHCP = "q",
  NETWORK_GATEWAY = "r",
  NETWORK_SUBNET = "s",
  // Access Point
  ACCESS_POINT_PASS = "t",
  // GPIO
  GPIO_W = "u",
  GPIO_WW = "v",
  GPIO_R = "w",
  GPIO_G = "x",
  GPIO_B = "y",
  // MQTT
  MQTT_ENABLED = "z",
  MQTT_CLIENT_NAME = "aa",
  MQTT_USER = "ab",
  MQTT_PASSWORD = "ac",
  MQTT_IP1 = "ad",
  MQTT_IP2 = "ae",
  MQTT_IP3 = "af",
  MQTT_IP4 = "ag",
  MQTT_PORT = "ah",
}
export interface IConfigMQTT {
  mqtt_enabled: true;
  mqtt_client_name: string;
  mqtt_user: string;
  mqtt_password: string;
  mqtt_ip: Array<number>;
  mqtt_port: number;
}
export interface IConfigJson {
  // DEVICE:
  [Conf.DEVICE_NAME]?: string;
  [Conf.DEVICE_TYPE]?: DeviceType;
  // GPIO:
  [Conf.GPIO_W]?: number;
  [Conf.GPIO_WW]?: number;
  [Conf.GPIO_R]?: number;
  [Conf.GPIO_G]?: number;
  [Conf.GPIO_B]?: number;
  // NETWORK:
  [Conf.NETWORK_SSID]?: string;
  [Conf.NETWORK_PASS]?: string;
  [Conf.NETWORK_DHCP]?: boolean;
  [Conf.NETWORK_IP1]?: number;
  [Conf.NETWORK_IP2]?: number;
  [Conf.NETWORK_IP3]?: number;
  [Conf.NETWORK_IP4]?: number;
  [Conf.NETWORK_GATEWAY1]?: number;
  [Conf.NETWORK_GATEWAY2]?: number;
  [Conf.NETWORK_GATEWAY3]?: number;
  [Conf.NETWORK_GATEWAY4]?: number;
  [Conf.NETWORK_SUBNET1]?: number;
  [Conf.NETWORK_SUBNET2]?: number;
  [Conf.NETWORK_SUBNET3]?: number;
  [Conf.NETWORK_SUBNET4]?: number;
  // ACCESS POINT:
  [Conf.ACCESS_POINT_PASS]?: string;
  // MQTT:
  [Conf.MQTT_ENABLED]?: boolean;
  [Conf.MQTT_CLIENT_NAME]?: string;
  [Conf.MQTT_USER]?: string;
  [Conf.MQTT_PASSWORD]?: string;
  [Conf.MQTT_IP1]?: number;
  [Conf.MQTT_IP2]?: number;
  [Conf.MQTT_IP3]?: number;
  [Conf.MQTT_IP4]?: number;
  [Conf.MQTT_PORT]?: number;
}
