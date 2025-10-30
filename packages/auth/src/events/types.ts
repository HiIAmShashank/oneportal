export type AuthEventType =
  | "auth:signed-in"
  | "auth:signed-out"
  | "auth:token-acquired"
  | "auth:account-changed"
  | "auth:error";

/**
 * Error structure for auth events (serialized over BroadcastChannel)
 * Uses number timestamp for JSON serialization compatibility
 */
export interface AuthEventError {
  code: string;
  message: string;
  subError?: string;
  timestamp: number;
  appName: string;
}

/**
 * Strictly typed event payload data for each event type
 * All required fields are non-optional to ensure type safety
 */
export type AuthEventData = {
  "auth:signed-in": {
    loginHint: string;
    accountId: string;
    appName: string;
    clientId: string;
  };
  "auth:signed-out": {
    appName: string;
    clientId: string;
  };
  "auth:token-acquired": {
    scopes: string[];
    appName: string;
  };
  "auth:account-changed": {
    accountId: string;
    appName: string;
  };
  "auth:error": {
    error: AuthEventError;
  };
};

/**
 * Auth event published via BroadcastChannel to notify other apps
 * Uses discriminated union for type-safe event payloads
 */
export type AuthEvent<T extends AuthEventType = AuthEventType> = {
  type: T;
  timestamp: number;
  payload: AuthEventData[T];
};

export function isAuthEvent(event: unknown): event is AuthEvent {
  if (typeof event !== "object" || event === null) return false;

  const e = event as Partial<AuthEvent>;
  return (
    typeof e.type === "string" &&
    typeof e.timestamp === "number" &&
    typeof e.payload === "object" &&
    e.payload !== null &&
    [
      "auth:signed-in",
      "auth:signed-out",
      "auth:token-acquired",
      "auth:account-changed",
      "auth:error",
    ].includes(e.type)
  );
}

export type AuthEventHandler = (event: AuthEvent) => void | Promise<void>;

export type UnsubscribeFn = () => void;
