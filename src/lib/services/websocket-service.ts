import { DataService } from "./data-service";

export class WebsocketService extends DataService {
  protected websocket?: WebSocket;
  // private pollConnectionInt?: NodeJS.Timeout;
  constructor() {
    super();
    if (!this.DEVELOPMENT) {
      this.connect();
    }
  }

  public connect = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const url = "ws://" + document.location.host + ":1337";
      console.log("Connecting to websocket...");
      if (document.location.host.length) {
        this.websocket = new WebSocket(url);
        this.websocket.onopen = () => {
          // clearInterval(connectionInt);
          console.log("Websocket connection open!");
          resolve(true);
        };
        this.websocket.onclose = () => {
          console.log("Websocket connection closed!");
        };
        this.websocket.onerror = (evt) => {
          // if (i === 30) {
          //   clearInterval(connectionInt);
          console.log("Resolving Error: ", evt);
          resolve(false);
          // send error!
          // this.onWsError(evt);
          // }
        };
        // let i = 0;
        // const connectionInt = setInterval(() => {
        //   i++;

        // }, 1000);
      }
    });
  };

  public reconnect = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (this.websocket) {
        this.websocket.close();
        this.connect().then((connected) => resolve(connected));
      }
    });
  };

  public send = (msg: string) => {
    if (this.websocket) {
      if (this.websocket.readyState === WebSocket.CLOSED) {
        console.log("oops this is closed already");
        this.connect();
      } else if (msg) {
        this.websocket.send(msg);
      }
    }
  };
}
