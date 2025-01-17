import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CrimesProvider } from "./context/CrimesContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CrimesProvider>
      <App />
    </CrimesProvider>
  </React.StrictMode>
);
