import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UnifiedAuthProvider } from "@one-portal/auth";
import { Sonner } from "@one-portal/ui";
import { msalInstance, getAuthConfig } from "./auth/msalInstance";
import { PUBLIC_ROUTES } from "./config/routes";
import { isEmbeddedMode } from "@one-portal/auth/utils";
import App from "./App";
import "./app.css";
import "./style.css";
import "./styles/sidebar-overrides.css";

// Load debug utilities in development
if (import.meta.env.DEV) {
  import("./debug/authDebug");
}

/**
 * Standalone entry point for Project Directory
 *
 * This file is used when running the app independently during development.
 * In production, the app is loaded via Module Federation (bootstrap.tsx).
 */
const container = document.getElementById("root");

if (!container) {
  throw new Error("[Project Directory] Root element not found");
}

const root = createRoot(container);

const isStandalone = !isEmbeddedMode({
  mode: import.meta.env.VITE_APP_MODE as "auto" | "standalone" | "embedded",
});

// Note: Project Directory currently uses Sonner directly instead of ThemedSonner
// and does not have ThemeProvider integrated yet.
// This will be standardized in a future update.

root.render(
  <StrictMode>
    <UnifiedAuthProvider
      msalInstance={msalInstance}
      mode="remote"
      appName="project-directory"
      getAuthConfig={getAuthConfig}
      debug={import.meta.env.DEV}
      publicRoutes={PUBLIC_ROUTES}
    >
      {isStandalone ? (
        <>
          <App />
          <Sonner />
        </>
      ) : (
        <App />
      )}
    </UnifiedAuthProvider>
  </StrictMode>,
);
