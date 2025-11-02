import { Sonner } from "@one-portal/ui";
import { useTheme } from "./ThemeProvider";

export function ThemedSonner() {
  try {
    const { theme } = useTheme();

    // Convert 'system' to actual system preference
    const resolvedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    return <Sonner theme={resolvedTheme} />;
  } catch {
    // If ThemeProvider is not available (embedded mode), use default
    return <Sonner />;
  }
}
