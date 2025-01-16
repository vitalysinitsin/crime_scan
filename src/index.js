import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { CrimesProvider } from "./context/CrimesContext";

ReactDOM.render(
  <React.StrictMode>
    <CrimesProvider>
      <App />
    </CrimesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
