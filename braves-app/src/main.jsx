import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/barlow-condensed/latin-700-italic.css";
import "@fontsource/barlow-condensed/latin-800-italic.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "./index.css";
import { applyBrand } from "./theme.js";
import App from "./App.jsx";

applyBrand();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
