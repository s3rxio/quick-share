import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import App from "./app";
import "~/styles/base.scss";

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
