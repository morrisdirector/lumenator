import { h, render } from "preact";

import LumenatorApp from "./App/LumenatorApp/LumenatorApp";
import LumenatorSetup from "./App/Setup/LumenatorSetup";

const PAGE = document.body.id === "lumenator-setup" ? "setup" : "app";

// render(<div>Hello World</div>, document.body);
if (PAGE === "setup") {
  //@ts-ignore
  render(<LumenatorSetup />, document.body);
} else {
  //@ts-ignore
  render(<LumenatorApp />, document.body);
}