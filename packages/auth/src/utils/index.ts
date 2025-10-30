// packages/auth/src/utils/index.ts
// Utilities barrel export

export { isAuthError } from "./isAuthError";

export {
  accountToUserProfile,
  getLoginHint,
  hasRole,
  hasAnyRole,
} from "./msalHelpers";

export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearAuthStorage,
  setReturnUrl,
  getAndClearReturnUrl,
  isStorageAvailable,
} from "./storage";

export {
  isAuthenticated,
  createRouteGuard,
  isInteractionRequired,
  type MsalRouteGuardConfig,
} from "./routeGuard";

export {
  isEmbeddedMode,
  getAppMode,
  getEmbeddedModeConfig,
  type AppMode,
  type EmbeddedModeConfig,
} from "./environment";

export {
  isValidReturnUrl,
  safeRedirect,
  sanitizeReturnUrl,
} from "./urlValidation";
