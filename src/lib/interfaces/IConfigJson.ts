import { DeviceType } from "../enums/DeviceType";
import { MixingStrategy } from "../enums/MixingStrategy";

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
  // E131
  E131_ENABLED,
  E131_MIXING_STRATEGY,
  E131_UNIVERSE,
  E131_START_CHAN,
  E131_MANUAL,
  E131_G_CHAN,
  E131_B_CHAN,
  E131_W_CHAN,
  E131_WW_CHAN,
  // INITIAL STATE
  INITIAL_W,
  INITIAL_WW,
  INITIAL_R,
  INITIAL_G,
  INITIAL_B,
}
export interface IConfigJson {
  // DEVICE:
  [Conf.DEVICE_NAME]?: string | null;
  [Conf.DEVICE_TYPE]?: DeviceType;
  // NETWORK:
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
  [Conf.NETWORK_SSID]?: string | null;
  [Conf.NETWORK_PASS]?: string | null;
  [Conf.NETWORK_DHCP]?: boolean;
  // ACCESS POINT:
  [Conf.ACCESS_POINT_PASS]?: string | null;
  // GPIO:
  [Conf.GPIO_W]?: number;
  [Conf.GPIO_WW]?: number;
  [Conf.GPIO_R]?: number;
  [Conf.GPIO_G]?: number;
  [Conf.GPIO_B]?: number;
  // MQTT:
  [Conf.MQTT_ENABLED]?: boolean;
  [Conf.MQTT_CLIENT_ID]?: string | null;
  [Conf.MQTT_USER]?: string | null;
  [Conf.MQTT_PASSWORD]?: string | null;
  [Conf.MQTT_IP1]?: number;
  [Conf.MQTT_IP2]?: number;
  [Conf.MQTT_IP3]?: number;
  [Conf.MQTT_IP4]?: number;
  [Conf.MQTT_PORT]?: number;
  [Conf.MQTT_DEVICE_TOPIC]?: string | null;
  [Conf.MQTT_AUTO_DISCOVERY]?: boolean;
  // E131:
  [Conf.E131_ENABLED]?: boolean;
  [Conf.E131_MIXING_STRATEGY]?: MixingStrategy;
  [Conf.E131_UNIVERSE]?: number;
  [Conf.E131_START_CHAN]?: number;
  [Conf.E131_MANUAL]?: boolean;
  [Conf.E131_G_CHAN]?: number;
  [Conf.E131_B_CHAN]?: number;
  [Conf.E131_W_CHAN]?: number;
  [Conf.E131_WW_CHAN]?: number;
  // INITIAL STATE
  [Conf.INITIAL_W]?: number;
  [Conf.INITIAL_WW]?: number;
  [Conf.INITIAL_R]?: number;
  [Conf.INITIAL_G]?: number;
  [Conf.INITIAL_B]?: number;
}

export type IConfigDto = [
  null, // First item is null to align the enums with the indexes
  // DEVICE:
  IConfigJson[Conf.DEVICE_NAME],
  IConfigJson[Conf.DEVICE_TYPE],
  // NETWORK:
  IConfigJson[Conf.NETWORK_IP1],
  IConfigJson[Conf.NETWORK_IP2],
  IConfigJson[Conf.NETWORK_IP3],
  IConfigJson[Conf.NETWORK_IP4],
  IConfigJson[Conf.NETWORK_GATEWAY1],
  IConfigJson[Conf.NETWORK_GATEWAY2],
  IConfigJson[Conf.NETWORK_GATEWAY3],
  IConfigJson[Conf.NETWORK_GATEWAY4],
  IConfigJson[Conf.NETWORK_SUBNET1],
  IConfigJson[Conf.NETWORK_SUBNET2],
  IConfigJson[Conf.NETWORK_SUBNET3],
  IConfigJson[Conf.NETWORK_SUBNET4],
  IConfigJson[Conf.NETWORK_SSID],
  IConfigJson[Conf.NETWORK_PASS],
  IConfigJson[Conf.NETWORK_DHCP],
  // ACCESS POINT:
  IConfigJson[Conf.ACCESS_POINT_PASS],
  // GPIO:
  IConfigJson[Conf.GPIO_W],
  IConfigJson[Conf.GPIO_WW],
  IConfigJson[Conf.GPIO_R],
  IConfigJson[Conf.GPIO_G],
  IConfigJson[Conf.GPIO_B],
  // MQTT:
  IConfigJson[Conf.MQTT_ENABLED],
  IConfigJson[Conf.MQTT_CLIENT_ID],
  IConfigJson[Conf.MQTT_USER],
  IConfigJson[Conf.MQTT_PASSWORD],
  IConfigJson[Conf.MQTT_IP1],
  IConfigJson[Conf.MQTT_IP2],
  IConfigJson[Conf.MQTT_IP3],
  IConfigJson[Conf.MQTT_IP4],
  IConfigJson[Conf.MQTT_PORT],
  IConfigJson[Conf.MQTT_DEVICE_TOPIC],
  IConfigJson[Conf.MQTT_AUTO_DISCOVERY],
  // E131:
  IConfigJson[Conf.E131_ENABLED],
  IConfigJson[Conf.E131_MIXING_STRATEGY],
  IConfigJson[Conf.E131_UNIVERSE],
  IConfigJson[Conf.E131_START_CHAN],
  IConfigJson[Conf.E131_MANUAL],
  IConfigJson[Conf.E131_G_CHAN],
  IConfigJson[Conf.E131_B_CHAN],
  IConfigJson[Conf.E131_W_CHAN],
  IConfigJson[Conf.E131_WW_CHAN],
  // INITIAL STATE
  IConfigJson[Conf.INITIAL_W],
  IConfigJson[Conf.INITIAL_WW],
  IConfigJson[Conf.INITIAL_R],
  IConfigJson[Conf.INITIAL_G],
  IConfigJson[Conf.INITIAL_B]
];
