import type { Root } from "react-dom/client";

/**
 * Module Federation container interface
 * Represents a federated module loaded at runtime
 */
export interface FederationModule {
  /**
   * Get an exposed module from the federation container
   * @param module - Module name (e.g., './App', './bootstrap')
   * @returns Promise resolving to a factory function that returns the module
   */
  get(module: string): Promise<() => unknown>;

  /**
   * Initialize the federation container with a share scope
   * @param shareScope - Share scope object containing shared dependencies
   */
  init?(shareScope: unknown): Promise<void>;
}

/**
 * Metadata for a loaded remote application
 * Tracks the module, mount/unmount functions, and current state
 */
export interface RemoteMetadata {
  /** Unique scope name for the remote application */
  scope: string;

  /** Federation module container */
  module: FederationModule;

  /** Function to mount the remote application into a container */
  mountFn?: (containerId: string) => Root | Promise<Root>;

  /** Function to unmount the remote application */
  unmountFn?: (instance: Root) => void;

  /** Current React root instance (if mounted) */
  instance?: Root;

  /** ID of the container element where the remote is mounted */
  containerId?: string;

  /** Timestamp when the remote was loaded */
  loadedAt?: number;
}

const remoteRegistry = new Map<string, RemoteMetadata>();

export async function loadRemote(
  remoteEntryUrl: string,
  scope: string,
): Promise<RemoteMetadata> {
  if (remoteRegistry.has(scope)) {
    return remoteRegistry.get(scope)!;
  }

  try {
    const module = await import(/* @vite-ignore */ remoteEntryUrl);

    const metadata: RemoteMetadata = {
      scope,
      module,
      loadedAt: Date.now(),
    };

    try {
      const bootstrap = await module.get("./bootstrap");
      const bootstrapModule = bootstrap();

      metadata.mountFn = bootstrapModule.mount;
      metadata.unmountFn = bootstrapModule.unmount;
    } catch (error) {
      console.error(
        `[RemoteLoader] Bootstrap load failed for ${scope}:`,
        error,
      );

      const app = await module.get("./App");
      metadata.module = app;
    }

    remoteRegistry.set(scope, metadata);

    return metadata;
  } catch (error) {
    console.error(`[RemoteLoader] Failed to load remote: ${scope}`, error);
    throw new Error(
      `Failed to load remote application "${scope}" from ${remoteEntryUrl}: ${error}`,
    );
  }
}

export async function mountRemote(
  scope: string,
  containerId: string,
): Promise<Root> {
  const metadata = remoteRegistry.get(scope);

  if (!metadata) {
    throw new Error(`Remote "${scope}" not loaded. Call loadRemote() first.`);
  }

  if (!metadata.mountFn) {
    throw new Error(`Remote "${scope}" does not expose a mount function.`);
  }

  try {
    const instance = await metadata.mountFn(containerId);

    metadata.instance = instance;
    metadata.containerId = containerId;

    return instance;
  } catch (error) {
    console.error(`[RemoteLoader] Mount failed for ${scope}:`, error);
    throw new Error(`Failed to mount remote "${scope}": ${error}`);
  }
}

export function unmountRemote(scope: string): void {
  const metadata = remoteRegistry.get(scope);

  if (!metadata || !metadata.instance) {
    return;
  }

  try {
    if (metadata.unmountFn) {
      metadata.unmountFn(metadata.instance);
    }

    delete metadata.instance;
    delete metadata.containerId;
  } catch (error) {
    console.error(`[RemoteLoader] Unmount failed for ${scope}:`, error);
    delete metadata.instance;
    delete metadata.containerId;
  }
}

export async function loadAndMountRemote(
  remoteEntryUrl: string,
  scope: string,
  containerId: string,
): Promise<Root> {
  await loadRemote(remoteEntryUrl, scope);
  return mountRemote(scope, containerId);
}
