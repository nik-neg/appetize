import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import GlobalStyle from "./global.styles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
