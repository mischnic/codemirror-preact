// @ts-ignore
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  require("preact/debug");
}

import { render, h } from "preact";

import { App1 } from "./App1";
import { App2 } from "./App2";

render(<App1 />, document.getElementById("app"));
