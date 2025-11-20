/**
 * Menu item configuration for sidebar navigation
 */
export interface MenuItem {
  /** Display name of the menu item */
  name: string;

  /** Navigation path (must match TanStack Router route) */
  path: string;

  /** Optional icon name (from lucide-react) */
  icon?: string;

  /** Display order (lower numbers appear first) */
  order: number;

  /** Optional description for tooltips */
  description?: string;

  /** Child menu items for nested navigation */
  children?: MenuItem[];
}

/**
 * API response structure for menu configuration
 */
export interface MenuApiResponse {
  /** List of top-level menu items */
  items: MenuItem[];

  /** Timestamp of last update */
  lastUpdated?: string;

  /** Version of menu configuration */
  version?: string;
}
