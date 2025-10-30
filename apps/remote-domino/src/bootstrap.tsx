import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { UnifiedAuthProvider } from "@one-portal/auth";
import { msalInstance, getAuthConfig } from "./auth/msalInstance";
import { PUBLIC_ROUTES } from "./config/routes";
import App from "./App";
import "./app.css";
import "./style.css";
import "./styles/sidebar-overrides.css";

// Load debug utilities in development
if (import.meta.env.DEV) {
  import("./debug/authDebug");
}

export async function mount(containerId: string): Promise<Root> {
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(
      `[Domino] Container element with ID "${containerId}" not found`,
    );
  }

  console.info(`[Domino] Mounting into container: ${containerId}`);

  const root = createRoot(container);

  root.render(
    <StrictMode>
      <UnifiedAuthProvider
        msalInstance={msalInstance}
        mode="remote"
        appName="domino"
        getAuthConfig={getAuthConfig}
        debug={import.meta.env.DEV}
        publicRoutes={PUBLIC_ROUTES}
      >
        <App />
      </UnifiedAuthProvider>
    </StrictMode>,
  );

  return root;
}

export function unmount(root: Root): void {
  console.info("[Domino] Unmounting application");
  root.unmount();
}

declare global {
  interface Window {
    __DOMINO_REMOTE_LOADED__?: boolean;
  }
}
