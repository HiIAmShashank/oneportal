import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UnifiedAuthProvider } from "@one-portal/auth";
import { msalInstance, getAuthConfig } from "./auth/msalInstance";
import { PUBLIC_ROUTES } from "./config/routes";
import { ThemedSonner } from "./components/ThemedSonner";
import App from "./App";
import "./app.css";
import "./style.css";
import "./styles/sidebar-overrides.css";

// Load debug utilities in development
if (import.meta.env.DEV) {
  import("./debug/authDebug");
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("[Domino] Root element not found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <UnifiedAuthProvider
      msalInstance={msalInstance}
      getAuthConfig={getAuthConfig}
      mode="remote"
      appName="domino"
      debug={import.meta.env.DEV}
      publicRoutes={PUBLIC_ROUTES}
    >
      <App />
    </UnifiedAuthProvider>
    <ThemedSonner />
  </StrictMode>,
);
