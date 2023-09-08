import { DataService } from "./data-service";
import { WebsocketService } from "./websocket-service";

export class HardwareService extends WebsocketService {
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

  public eraseAll = (): void => {
    this.send("erase");
  };
}
