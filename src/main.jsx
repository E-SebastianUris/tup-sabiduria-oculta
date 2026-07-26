import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./i18n";
import App from "./App";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/react";
import { registerSW } from 'virtual:pwa-register'
ReactGA.initialize("G-03YHGYYXEL");

Sentry.init({
  dsn: "https://664075e5a2cf584cd7c109287a91921a@o4511718208569344.ingest.us.sentry.io/4511718222069760",
  dataCollection: {
  }
});

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nueva versión disponible, refrescar la página')
  },
  onOfflineReady() {
    console.log('La app está lista para usarse offline')
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
