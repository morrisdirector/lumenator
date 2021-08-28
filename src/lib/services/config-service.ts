import { DataService } from "./data-service";
import { IConfigJson } from "../interfaces/IConfigJson";
import { testData } from "../utils/MockData";

export class ConfigService extends DataService {
  constructor() {
    super();
  }

  public loadConfigJson = (): Promise<IConfigJson> => {
    return new Promise((resolve, reject) => {
      if (this.DEVELOPMENT) {
        resolve(testData());
        return;
      }
      this.jsonGET("config")
        .then(function (data) {
          resolve(data);
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
      this.jsonPOST("config", json)
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
