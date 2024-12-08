// Global styles.
import "./styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "@/containers/App";
import DevPreview from "@/containers/DevPreview";
import { AppRoute } from "./config/constants";
import Providers from "./containers/Providers";

const root = document.getElementById("root");

if (root === null) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />

          <Route path={AppRoute.Dev} element={<DevPreview />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>
);
