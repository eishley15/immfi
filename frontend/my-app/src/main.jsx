import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Import slick-carousel CSS files to avoid PostCSS @charset issues
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
