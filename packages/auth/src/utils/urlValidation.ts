/**
 * URL Validation Utilities
 * Prevents open redirect vulnerabilities by validating URLs before redirection
 */

/**
 * Validates that a URL is safe for redirection
 * Only allows same-origin URLs starting with /
 *
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidReturnUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Parse URL relative to current origin
    const parsed = new URL(url, window.location.origin);

    // Must be same origin
    if (parsed.origin !== window.location.origin) {
      console.warn('[URL Validation] Rejected cross-origin URL:', url);
      return false;
    }

    // Must be absolute path starting with /
    if (!parsed.pathname.startsWith('/')) {
      console.warn('[URL Validation] Rejected non-absolute path:', url);
      return false;
    }

    // Prevent path traversal attacks
    if (
      parsed.pathname.includes('../') ||
      parsed.pathname.includes('..\\') ||
      parsed.pathname.includes('..%2F') ||
      parsed.pathname.includes('..%5C')
    ) {
      console.warn('[URL Validation] Rejected path traversal attempt:', url);
      return false;
    }

    // Prevent protocol confusion
    if (
      parsed.protocol !== 'http:' &&
      parsed.protocol !== 'https:' &&
      parsed.protocol !== window.location.protocol
    ) {
      console.warn('[URL Validation] Rejected non-HTTP protocol:', url);
      return false;
    }

    return true;
  } catch (error) {
    // Invalid URL format
    console.warn('[URL Validation] Invalid URL format:', url, error);
    return false;
  }
}

/**
 * Safely redirects to a URL after validation
 * Falls back to a safe default if validation fails
 *
 * @param url - The URL to redirect to
 * @param fallback - Fallback URL if validation fails (default: '/')
 */
export function safeRedirect(url: string, fallback: string = '/'): void {
  const targetUrl = isValidReturnUrl(url) ? url : fallback;

  if (targetUrl !== url) {
    console.warn('[URL Validation] Redirecting to fallback instead of:', url);
  }

  window.location.href = targetUrl;
}

/**
 * Sanitizes a return URL parameter
 * Returns the URL if valid, otherwise returns the fallback
 *
 * @param url - The URL to sanitize
 * @param fallback - Fallback URL if validation fails (default: '/')
 * @returns Validated URL or fallback
 */
export function sanitizeReturnUrl(url: string | null | undefined, fallback: string = '/'): string {
  if (!url) {
    return fallback;
  }

  return isValidReturnUrl(url) ? url : fallback;
}
