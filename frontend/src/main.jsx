import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import brandMark from "./assets/brand-mark.svg";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

const faviconLink =
  document.querySelector("link[rel='icon']") || document.createElement("link");

faviconLink.rel = "icon";
faviconLink.type = "image/svg+xml";
faviconLink.href = brandMark;
document.head.appendChild(faviconLink);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
