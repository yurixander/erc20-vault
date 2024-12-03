import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import App from "@/containers/App";
import { AppRoute } from "./config/constants";
import DevPreview from "@/containers/DevPreview";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.App} element={<App />} />

        <Route path={AppRoute.Dev} element={<DevPreview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
