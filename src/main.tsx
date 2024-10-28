import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";
import { FiltersContextProvider } from "./contexts/FiltersContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <FiltersContextProvider>
        <App />
      </FiltersContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
