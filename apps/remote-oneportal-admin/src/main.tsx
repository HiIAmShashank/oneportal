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

/**
 * Standalone entry point for One Portal Admin
 *
 * This file is used when running the app independently during development.
 * In production, the app is loaded via Module Federation (bootstrap.tsx).
 */
const container = document.getElementById("root");

if (!container) {
  throw new Error("[One Portal Admin] Root element not found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <UnifiedAuthProvider
      msalInstance={msalInstance}
      mode="remote"
      appName="oneportal-admin"
      getAuthConfig={getAuthConfig}
      debug={import.meta.env.DEV}
      publicRoutes={PUBLIC_ROUTES}
    >
      <App />
    </UnifiedAuthProvider>
    <ThemedSonner />
  </StrictMode>,
);
