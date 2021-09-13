import { DeviceType } from "../enums/DeviceType";

export enum Conf {
  // Device
  DEVICE_NAME = 1,
  DEVICE_TYPE,
  // Network
  NETWORK_IP1,
  NETWORK_IP2,
  NETWORK_IP3,
  NETWORK_IP4,
  NETWORK_GATEWAY1,
  NETWORK_GATEWAY2,
  NETWORK_GATEWAY3,
  NETWORK_GATEWAY4,
  NETWORK_SUBNET1,
  NETWORK_SUBNET2,
  NETWORK_SUBNET3,
  NETWORK_SUBNET4,
  NETWORK_SSID,
  NETWORK_PASS,
  NETWORK_DHCP,
  NETWORK_GATEWAY,
  NETWORK_SUBNET,
  // Access Point
  ACCESS_POINT_PASS,
  // GPIO
  GPIO_W,
  GPIO_WW,
  GPIO_R,
  GPIO_G,
  GPIO_B,
  // MQTT
  MQTT_ENABLED,
  MQTT_CLIENT_ID,
  MQTT_USER,
  MQTT_PASSWORD,
  MQTT_IP1,
  MQTT_IP2,
  MQTT_IP3,
  MQTT_IP4,
  MQTT_PORT,
  MQTT_DEVICE_TOPIC,
  MQTT_AUTO_DISCOVERY,
  // INITIAL STATE
  INITIAL_W,
  INITIAL_WW,
  INITIAL_R,
  INITIAL_G,
  INITIAL_B,
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
  [Conf.MQTT_CLIENT_ID]?: string;
  [Conf.MQTT_USER]?: string;
  [Conf.MQTT_PASSWORD]?: string;
  [Conf.MQTT_IP1]?: number;
  [Conf.MQTT_IP2]?: number;
  [Conf.MQTT_IP3]?: number;
  [Conf.MQTT_IP4]?: number;
  [Conf.MQTT_PORT]?: number;
  [Conf.MQTT_DEVICE_TOPIC]?: string;
  [Conf.MQTT_AUTO_DISCOVERY]?: boolean;
  // INITIAL STATE
  [Conf.INITIAL_W]?: number;
  [Conf.INITIAL_WW]?: number;
  [Conf.INITIAL_R]?: number;
  [Conf.INITIAL_G]?: number;
  [Conf.INITIAL_B]?: number;
}
