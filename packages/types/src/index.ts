// Configuration types
export type {
  RemoteApp,
  RemoteAppMenuItem,
  ShellConfiguration,
  RemoteMetadata,
} from "./config";

// Remote app lifecycle types
export type { MountFunction, UnmountFunction } from "./remote-app";

// Preference types
export type { Theme, Language, UserPreferences } from "./preferences";
export { LANGUAGE_LABELS, THEME_LABELS } from "./preferences";

// Storage keys
export { STORAGE_KEYS, type StorageKey } from "./storage-keys";

// Error messages
export { ERROR_MESSAGES, ErrorCode, ShellError } from "./error-messages";

// Validators
export {
  shellConfigSchema,
  remoteAppSchema,
  validateShellConfig,
  safeValidateShellConfig,
  type RemoteAppInput,
  type ShellConfigurationInput,
} from "./validators/shell-config.validator";

export {
  userPreferencesSchema,
  themeSchema,
  languageSchema,
  validatePreferences,
  safeValidatePreferences,
  validatePartialPreferences,
  type UserPreferencesInput,
} from "./validators/preferences.validator";
