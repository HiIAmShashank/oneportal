/**
 * Centralized error messages for consistent UX across the shell.
 */

export const ERROR_MESSAGES = {
  REMOTE_APP: {
    LOAD_FAILED: (appName: string) =>
      `Unable to load ${appName}. Please try again or contact support if the problem persists.`,

    MOUNT_FAILED: (appName: string) =>
      `${appName} could not be displayed. Please refresh the page or contact support.`,

    GENERIC_ERROR: 'An unexpected error occurred while loading the application. Please try again.',
  },

  CONFIG_API: {
    FETCH_FAILED:
      'Configuration unavailable. Using offline mode with limited apps. Please check your connection.',

    INVALID_RESPONSE:
      'Configuration data is invalid. Please contact support if this issue continues.',

    TIMEOUT:
      'Connection timeout while loading configuration. Please check your network and retry.',

    SERVER_ERROR:
      'Server error while loading configuration. Our team has been notified. Please try again later.',
  },

  NAVIGATION: {
    INVALID_APP_ID: (appId: string) =>
      `Application "${appId}" not found. Please select a valid app from the navigation menu.`,

    NAVIGATION_FAILED:
      'Navigation failed. Please try again or use the menu to select an application.',
  },

  PREFERENCES: {
    SAVE_FAILED:
      'Unable to save your preferences. Changes may not persist after refresh.',

    LOAD_FAILED:
      'Unable to load saved preferences. Using default settings.',

    THEME_ERROR:
      'Theme could not be applied. Please try refreshing the page.',
  },

  COMPATIBILITY: {
    UNSUPPORTED_BROWSER:
      'Your browser is not supported. Please use Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+.',

    NO_LOCAL_STORAGE:
      'Browser storage is disabled. Some features may not work correctly.',
  },

  GENERIC: {
    UNEXPECTED:
      'An unexpected error occurred. Please refresh the page or contact support.',

    NOT_IMPLEMENTED:
      'This feature is not yet available. Please check back later.',
  },
} as const;

export enum ErrorCode {
  REMOTE_LOAD_FAILED = 'ERR_1001',
  REMOTE_MOUNT_FAILED = 'ERR_1002',
  REMOTE_GENERIC = 'ERR_1000',

  CONFIG_FETCH_FAILED = 'ERR_2001',
  CONFIG_INVALID = 'ERR_2002',
  CONFIG_TIMEOUT = 'ERR_2003',
  CONFIG_SERVER_ERROR = 'ERR_2004',

  NAV_INVALID_APP = 'ERR_3001',
  NAV_FAILED = 'ERR_3002',

  PREF_SAVE_FAILED = 'ERR_4001',
  PREF_LOAD_FAILED = 'ERR_4002',
  PREF_THEME_ERROR = 'ERR_4003',

  COMPAT_UNSUPPORTED = 'ERR_5001',
  COMPAT_NO_STORAGE = 'ERR_5002',

  GENERIC_UNEXPECTED = 'ERR_9000',
  GENERIC_NOT_IMPLEMENTED = 'ERR_9999',
}

export class ShellError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public override cause?: unknown
  ) {
    super(message);
    this.name = 'ShellError';
  }
}
