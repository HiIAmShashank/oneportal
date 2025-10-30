import { useEffect, useRef, useState } from "react";
import type { RemoteApp } from "@one-portal/types";
import type { Root } from "react-dom/client";
import { RemoteErrorBoundary } from "@one-portal/auth";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorFallback } from "./ErrorFallback";
import { useAppStore } from "../stores/appStore";
import { loadAndMountRemote, unmountRemote } from "../services/remoteLoader";

interface RemoteMountProps {
  app: RemoteApp;
  className?: string;
}

export function RemoteMount({ app, className = "" }: RemoteMountProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Root | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { setLoading, setError: setStoreError } = useAppStore();
  const containerId = `remote-app-container-${app.id}`;

  useEffect(() => {
    let isMounted = true;

    const loadAndMount = async () => {
      try {
        setIsLoading(true);
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 0));

        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(
            `Container element with ID "${containerId}" not found`,
          );
        }

        const instance = await loadAndMountRemote(
          app.remoteEntryUrl,
          app.scope,
          containerId,
        );

        if (isMounted) {
          instanceRef.current = instance;
          setIsLoading(false);
          setLoading(false);
        }
      } catch (err) {
        console.error(`[RemoteMount] Load failed for ${app.name}:`, err);
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setStoreError(error);
          setIsLoading(false);
          setLoading(false);
        }
      }
    };

    loadAndMount();

    return () => {
      isMounted = false;

      if (instanceRef.current) {
        unmountRemote(app.scope);
        instanceRef.current = null;
      }
    };
  }, [
    app.id,
    app.name,
    app.remoteEntryUrl,
    app.scope,
    containerId,
    setLoading,
    setStoreError,
    retryCount,
  ]);

  return (
    <RemoteErrorBoundary
      remoteName={app.name}
      onError={(error, errorInfo) => {
        console.error(`[${app.name}] Rendering error:`, error, errorInfo);
        setStoreError(error);
      }}
      onReset={() => {
        setError(null);
        setStoreError(null);
        window.location.reload();
      }}
      showHomeButton={true}
    >
      <div className="relative min-h-[calc(100vh-70px)]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
            <LoadingIndicator />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <ErrorFallback
              error={error}
              onRetry={() => {
                setError(null);
                setStoreError(null);
                setRetryCount((count) => count + 1);
              }}
            />
          </div>
        )}

        <div
          id={containerId}
          ref={containerRef}
          className={`min-h-[calc(100vh-70px)] ${className}`}
          aria-label={`${app.name} application`}
        />
      </div>
    </RemoteErrorBoundary>
  );
}
