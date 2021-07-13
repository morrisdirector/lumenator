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
      }

      this.jsonGET("config")
        .then(function (data) {
          debugger;
          resolve(data);
        })
        .catch(function (e) {
          debugger;
          reject(e);
        });

      // fetch("config")
      //   .then(function (response) {
      //     return response.json();
      //   })
      //   .then(function (data) {
      //     if (data) {
      //       loadData(data);
      //     }
      //   })
      //   .catch(function (e) {
      //     console.warn("Something went wrong loading the config json file.", e);
      //     window.scrollTo(0, 0);
      //     this.element("#error-messages").setState({
      //       text: "Error loading configuration",
      //     });
      //   });
    });
  };
}
