/**
 * Remote application menu item for navigation dropdown
 */
export interface RemoteAppMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  description: string;
  isFavorite?: boolean;
}

/**
 * Remote application configuration
 */
export interface RemoteApp {
  id: string;
  name: string;
  applicationDescription: string;
  remoteEntryUrl: string;
  moduleName: string;
  scope: string;
  icon?: string;
  landingPage?: string;
  order?: number;
  enabled?: boolean;
  isFavorite?: boolean;
  menuItems?: RemoteAppMenuItem[];
}

export interface ShellConfiguration {
  apps: RemoteApp[];
  branding: {
    title: string;
    logoUrl?: string;
  };
  defaults?: {
    theme?: "light" | "dark" | "system";
    language?: "en" | "es" | "fr" | "de";
  };
}

/**
 * Internal metadata for tracking loaded remote applications
 */
export interface RemoteMetadata {
  app: RemoteApp;
  isLoaded: boolean;
  mount?: (containerId: string) => void | Promise<void>;
  unmount?: (containerId: string) => void | Promise<void>;
  loadedAt?: Date;
  error?: {
    message: string;
    timestamp: Date;
  };
}
