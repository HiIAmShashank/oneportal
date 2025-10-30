// packages/auth/src/types/index.ts
// Auth types barrel export

export type {
  AuthConfig,
  UserProfile,
  AuthState,
  AuthError,
  UseAuthReturn,
  TokenRequest,
  RouteGuardConfig,
  AuthTelemetryEvent,
  MsalInteractionType,
  AuthProviderProps,
} from './auth';

export { isMsalError, isInteractionRequiredError } from './auth';
