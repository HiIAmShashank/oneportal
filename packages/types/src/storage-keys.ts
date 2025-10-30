export const STORAGE_KEYS = {
  PREFERENCES: 'oneportal:preferences',
  SHELL_CONFIG: 'oneportal:config',
  ACTIVE_APP: 'oneportal:activeApp',
  LAST_ROUTE: 'oneportal:lastRoute',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
