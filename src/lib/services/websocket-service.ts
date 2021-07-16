import { DataService } from "./data-service";

export class WebsocketService extends DataService {
  protected websocket: WebSocket | undefined;
  constructor() {
    super();
    if (!this.DEVELOPMENT) {
      this.connect();
    }
  }

  public connect = () => {
    const url = "ws://" + document.location.host + ":1337";
    if (document.location.host.length) {
      let i = 0;
      const connectionInt = setInterval(() => {
        i++;
        this.websocket = new WebSocket(url);
        this.websocket.onopen = () => {
          clearInterval(connectionInt);
        };
        // websocket.onopen = function (evt) { onOpen(evt) };
        // websocket.onclose = function (evt) { onClose(evt) };
        // websocket.onmessage = function (evt) { onMessage(evt) };
        this.websocket.onerror = (evt) => {
          if (i === 5) {
            clearInterval(connectionInt);
            // send error!
            // this.onWsError(evt);
          }
        };
      }, 1000);
    }
  };

  public send = (msg: string) => {
    if (this.websocket && msg) {
      this.websocket.send(msg);
    }
  };
}
