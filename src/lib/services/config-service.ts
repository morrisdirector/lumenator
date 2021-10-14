import { Conf, IConfigDto, IConfigJson } from "../interfaces/IConfigJson";

import { DataService } from "./data-service";
import { testData } from "../utils/MockData";

export class ConfigService extends DataService {
  constructor() {
    super();
  }

  private getDto(json: IConfigJson): IConfigDto {
    const dto: IConfigDto = [
      null,
      // DEVICE:
      json[Conf.DEVICE_NAME],
      json[Conf.DEVICE_TYPE],
      // NETWORK:
      json[Conf.NETWORK_IP1],
      json[Conf.NETWORK_IP2],
      json[Conf.NETWORK_IP3],
      json[Conf.NETWORK_IP4],
      json[Conf.NETWORK_GATEWAY1],
      json[Conf.NETWORK_GATEWAY2],
      json[Conf.NETWORK_GATEWAY3],
      json[Conf.NETWORK_GATEWAY4],
      json[Conf.NETWORK_SUBNET1],
      json[Conf.NETWORK_SUBNET2],
      json[Conf.NETWORK_SUBNET3],
      json[Conf.NETWORK_SUBNET4],
      json[Conf.NETWORK_SSID],
      json[Conf.NETWORK_PASS],
      json[Conf.NETWORK_DHCP],
      // ACCESS POINT:
      json[Conf.ACCESS_POINT_PASS],
      // GPIO:
      json[Conf.GPIO_W],
      json[Conf.GPIO_WW],
      json[Conf.GPIO_R],
      json[Conf.GPIO_G],
      json[Conf.GPIO_B],
      // MQTT:
      json[Conf.MQTT_ENABLED],
      json[Conf.MQTT_CLIENT_ID],
      json[Conf.MQTT_USER],
      json[Conf.MQTT_PASSWORD],
      json[Conf.MQTT_IP1],
      json[Conf.MQTT_IP2],
      json[Conf.MQTT_IP3],
      json[Conf.MQTT_IP4],
      json[Conf.MQTT_PORT],
      json[Conf.MQTT_DEVICE_TOPIC],
      json[Conf.MQTT_AUTO_DISCOVERY],
      // E131:
      json[Conf.E131_ENABLED],
      json[Conf.E131_MIXING_STRATEGY],
      json[Conf.E131_UNIVERSE],
      json[Conf.E131_START_CHAN],
      json[Conf.E131_MANUAL],
      json[Conf.E131_G_CHAN],
      json[Conf.E131_B_CHAN],
      json[Conf.E131_W_CHAN],
      json[Conf.E131_WW_CHAN],
      // INITIAL STATE
      json[Conf.INITIAL_W],
      json[Conf.INITIAL_WW],
      json[Conf.INITIAL_R],
      json[Conf.INITIAL_G],
      json[Conf.INITIAL_B],
    ];
    return dto;
  }

  private getJsonFromDto(dto: IConfigDto): IConfigJson {
    const json: IConfigJson = {};
    dto.forEach((value, idx) => {
      //@ts-ignore
      json[idx] = value;
    });
    return json;
  }

  public loadConfigJson = (): Promise<IConfigJson> => {
    return new Promise((resolve, reject) => {
      if (this.DEVELOPMENT) {
        const json = this.getJsonFromDto(testData());
        resolve(json);
        return;
      }
      this.jsonGET("config")
        .then((data) => {
          const json = this.getJsonFromDto(data);
          resolve(json);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  };

  public saveConfigJson = (json: IConfigJson): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (this.DEVELOPMENT) {
        resolve(true);
        return;
      }
      const dto = this.getDto(json);
      this.jsonPOST("config", dto)
        .then(function (response) {
          if (response.success === true) {
            resolve(true);
          }
        })
        .catch(function (e) {
          reject(e);
        });
    });
  };

  public hasUnsavedChanges(
    originalConfig?: IConfigJson,
    config?: IConfigJson
  ): boolean {
    const original = originalConfig ? JSON.stringify(originalConfig) : "";
    const current = config ? JSON.stringify(config) : "";
    return original !== current;
  }
}
