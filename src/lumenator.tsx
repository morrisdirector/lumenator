import { h, render } from "preact";

import LumenatorApp from "./App/LumenatorApp/LumenatorApp";

// import './components/index';

// import { LumenatorSetup } from './lumenator-setup';

// Development Mode
const DEVELOPMENT = process.env.NODE_ENV === "development";

const PAGE = document.body.id === "lumenator-setup" ? "setup" : "app";

// const init = () => {
//   let controller;
//   if (PAGE === "app") {
//     controller = LumenatorApp;
//   } else {
//     // controller = new LumenatorSetup(DEVELOPMENT);
//   }
// Inject our app into the DOM
render(<LumenatorApp />, document.body);
// };

// init();
