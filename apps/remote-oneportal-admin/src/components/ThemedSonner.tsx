import { Sonner } from "@one-portal/ui";
import { useTheme } from "./ThemeProvider";

export function ThemedSonner() {
  const { theme } = useTheme();

  // Convert 'system' to actual system preference
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return <Sonner theme={resolvedTheme} />;
}
