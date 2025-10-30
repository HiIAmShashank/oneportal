/**
 * ⚠️ IMPORTANT: Wildcard import is intentional
 *
 * This component supports dynamic icon lookup from database-driven
 * application configurations. Tree-shaking would break this functionality
 * as icon names are determined at runtime from API responses.
 *
 * Bundle impact: ~158 kB gzipped, shared across all micro-frontends
 * via Module Federation (no duplication).
 *
 * Alternative approaches considered:
 * - Named imports: Would require maintaining an icon registry and breaks
 *   database-driven icon selection
 * - Dynamic imports: Poor performance with ~1,500 potential HTTP requests
 * - SVG sprites: High implementation complexity, incompatible with Module Federation
 *
 * Current approach provides best balance of:
 * ✅ Flexibility (any icon name works)
 * ✅ Performance (single shared bundle)
 * ✅ Developer experience (no manual icon registration)
 */
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DynamicIconProps {
  name?: string;
  className?: string;
  fallback?: LucideIcon;
}

/**
 * Icon name mapping from API format to lucide-react format
 * Maps kebab-case or special names to PascalCase lucide icon names
 */
const ICON_NAME_MAP: Record<string, string> = {
  // Common mappings
  users: "Users",
  user: "User",
  "user-add": "UserPlus",
  "user-group": "Users",
  "user-circle": "UserCircle",
  phone: "Phone",
  megaphone: "Megaphone",
  "trending-up": "TrendingUp",
  "chart-line": "LineChart",
  "chart-bar": "BarChart",
  "chart-pie": "PieChart",
  "chart-bar-square": "BarChart3",
  "document-text": "FileText",
  "document-report": "FileText",
  folder: "Folder",
  "folder-open": "FolderOpen",
  "folder-git": "FolderGit",
  "credit-card": "CreditCard",
  "receipt-refund": "Receipt",
  calculator: "Calculator",
  "book-open": "BookOpen",
  "shield-check": "ShieldCheck",
  "academic-cap": "GraduationCap",
  "currency-dollar": "DollarSign",
  "computer-desktop": "Monitor",
  server: "Server",
  cog: "Settings",
  "exclamation-circle": "AlertCircle",
  "light-bulb": "Lightbulb",
  ticket: "Ticket",
  "view-grid": "Grid3x3",
  "clipboard-list": "ClipboardList",
  clock: "Clock",
  "check-circle": "CheckCircle",
  search: "Search",
  download: "Download",
  beaker: "Beaker",
  "presentation-chart-bar": "Presentation",
  calendar: "Calendar",
  star: "Star",
  people: "Users",
  database: "Database",
};

/**
 * Converts kebab-case to PascalCase
 * Example: "chart-pie" → "ChartPie"
 */
function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Resolves icon name from API format to lucide-react format
 */
function resolveIconName(name: string): string {
  // Check direct mapping first
  if (ICON_NAME_MAP[name]) {
    return ICON_NAME_MAP[name];
  }

  // Try lowercase mapping
  const lowerName = name.toLowerCase();
  if (ICON_NAME_MAP[lowerName]) {
    return ICON_NAME_MAP[lowerName];
  }

  // If already in PascalCase, return as-is
  const firstChar = name.charAt(0);
  if (firstChar === firstChar.toUpperCase() && !name.includes("-")) {
    return name;
  }

  // Convert kebab-case to PascalCase
  return kebabToPascal(name);
}

/**
 * Dynamically renders a Lucide icon by name
 *
 * Features:
 * - Handles kebab-case icon names from API
 * - Automatic name transformation to PascalCase
 * - Falls back to Circle icon if not found
 * - Fully reactive to prop changes
 * - Type-safe with TypeScript
 *
 * @example
 * ```tsx
 * <DynamicIcon name="database" className="h-5 w-5" />
 * <DynamicIcon name="user-add" className="h-4 w-4" />
 * <DynamicIcon name="LayoutDashboard" className="h-4 w-4" />
 * ```
 */
export function DynamicIcon({
  name,
  className = "h-4 w-4",
  fallback,
}: DynamicIconProps) {
  if (!name) {
    const FallbackIcon = fallback || Icons.Circle;
    return <FallbackIcon className={className} />;
  }

  // Resolve icon name to lucide-react format
  const resolvedName = resolveIconName(name);

  // Dynamically get icon from lucide-react
  const Icon = Icons[resolvedName as keyof typeof Icons] as
    | LucideIcon
    | undefined;

  if (!Icon) {
    if (import.meta.env.DEV) {
      console.warn(
        `[DynamicIcon] Icon "${name}" (resolved as "${resolvedName}") not found in lucide-react`,
      );
    }
    const FallbackIcon = fallback || Icons.Circle;
    return <FallbackIcon className={className} />;
  }

  return <Icon className={className} />;
}
