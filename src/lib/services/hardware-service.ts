import { DataService } from "./data-service";

export class HardwareService extends DataService {
  constructor() {
    super();
  }

  public restart = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (this.DEVELOPMENT) {
        resolve(true);
        return;
      }
      this.emptyPOST("restart")
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
}
