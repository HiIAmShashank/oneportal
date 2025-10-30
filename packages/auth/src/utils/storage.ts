const STORAGE_PREFIX = 'oneportal:auth:';

export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('[Storage] Failed to get item:', error);
    return null;
  }
}

export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  } catch (error) {
    console.error('[Storage] Failed to set item:', error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('[Storage] Failed to remove item:', error);
  }
}

export function clearAuthStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('[Storage] Failed to clear auth storage:', error);
  }
}

export function setReturnUrl(url: string): void {
  setStorageItem('returnUrl', url);
}

export function getAndClearReturnUrl(): string | null {
  const url = getStorageItem('returnUrl');
  if (url) {
    removeStorageItem('returnUrl');
  }
  return url;
}

export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
