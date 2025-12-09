import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";

console.log("main.tsx is loading");
const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

createRoot(rootElement!).render(
  <StrictMode>
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </StrictMode>
);
