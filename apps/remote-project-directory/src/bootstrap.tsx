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

/**
 * Mount Project Directory app into a specified container
 *
 * This is the Module Federation entry point called by the Shell app.
 *
 * @param containerId - The ID of the DOM element to mount into
 * @returns Root instance for cleanup
 */
export async function mount(containerId: string): Promise<Root> {
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(
      `[Project Directory] Container element with ID "${containerId}" not found`,
    );
  }

  console.info(`[Project Directory] Mounting into container: ${containerId}`);

  const root = createRoot(container);

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
        <App />
      </UnifiedAuthProvider>
    </StrictMode>,
  );

  return root;
}

/**
 * Unmount Project Directory app and cleanup resources
 *
 * @param root - The Root instance returned from mount()
 */
export function unmount(root: Root): void {
  console.info("[Project Directory] Unmounting application");
  root.unmount();
}

// Type augmentation for global flag
declare global {
  interface Window {
    __PROJECT_DIRECTORY_REMOTE_LOADED__?: boolean;
  }
}
