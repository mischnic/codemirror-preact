if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

import { render, h, Fragment } from "preact";

import {App1} from "./App1.js";
import {App2} from "./App2.js";

render(<App2 />, document.getElementById("app"));
