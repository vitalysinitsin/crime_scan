import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CrimesProvider } from "./context/CrimesContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CrimesProvider>
        <App />
      </CrimesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
