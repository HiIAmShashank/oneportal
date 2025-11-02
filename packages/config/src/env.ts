import { z } from "zod";

/**
 * Environment variable schema for the shell application
 * Validates all required environment variables at runtime
 *
 * Note: Auth variables (VITE_SHELL_AUTH_*) are validated by @one-portal/auth package
 * in loadAuthConfig.ts, so they are not included here to avoid duplication.
 */
export const shellEnvSchema = z.object({
  // Azure AD Authentication (app-specific, validated by auth package)
  VITE_SHELL_AUTH_CLIENT_ID: z.string().optional(),
  VITE_SHELL_AUTH_AUTHORITY: z.string().optional(),
  VITE_SHELL_AUTH_REDIRECT_URI: z.string().optional(),
  VITE_SHELL_AUTH_POST_LOGOUT_REDIRECT_URI: z.string().optional(),
  VITE_SHELL_AUTH_SCOPES: z.string().optional(),

  // API Configuration (app-specific)
  VITE_SHELL_API_BASE_URL: z
    .string()
    .url("Shell API Base URL must be a valid URL")
    .optional(),
  VITE_SHELL_FUNCTIONAPP_API_BASE_URL: z
    .string()
    .url("Admin Function App API Base URL must be a valid URL"),

  // Application Mode
  VITE_APP_MODE: z.enum(["embedded", "standalone", "auto"]).optional(),

  // Feature Flags
  VITE_ENABLE_ANALYTICS: z.enum(["true", "false"]).optional().default("false"),
  VITE_ENABLE_DEBUG: z.enum(["true", "false"]).optional().default("false"),
});

/**
 * Environment variable schema for remote applications
 *
 * Note: Auth variables (VITE_{APPNAME}_AUTH_*) are validated by @one-portal/auth package
 * in loadAuthConfig.ts with app-specific prefixes. Each remote app has its own prefix:
 * - VITE_DOMINO_AUTH_* for remote-domino
 * - etc.
 *
 * API Configuration (VITE_{APPNAME}_API_BASE_URL) is also app-specific but optional.
 * Each remote defines its own API URL in its vite-env.d.ts.
 *
 * This schema validates only shared, non-app-specific configuration.
 */
export const remoteEnvSchema = z.object({
  // Application Mode (shared across all apps)
  VITE_APP_MODE: z.enum(["embedded", "standalone", "auto"]).optional(),

  // Feature Flags (shared across all apps)
  VITE_ENABLE_ANALYTICS: z.enum(["true", "false"]).optional().default("false"),
  VITE_ENABLE_DEBUG: z.enum(["true", "false"]).optional().default("false"),
});

export type ShellEnv = z.infer<typeof shellEnvSchema>;
export type RemoteEnv = z.infer<typeof remoteEnvSchema>;

/**
 * Validates environment variables and throws if invalid
 * @param schema - Zod schema to validate against
 * @param env - Environment variables to validate (defaults to import.meta.env)
 */
export function validateEnv<T>(
  schema: z.ZodSchema<T>,
  env: Record<string, unknown> = import.meta.env,
): T {
  const result = schema.safeParse(env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );

    console.error("Environment validation failed:");
    errors.forEach((error) => console.error(`  - ${error}`));

    throw new Error(
      `Environment validation failed:\n${errors.join("\n")}\n\n` +
        "Please check your .env.local file and ensure all required variables are set.",
    );
  }

  return result.data;
}

/**
 * Validates shell environment variables
 * Call this in main.tsx before rendering the app
 */
export function validateShellEnv() {
  return validateEnv(shellEnvSchema);
}

/**
 * Validates remote environment variables
 * Call this in remote main.tsx before rendering the app
 */
export function validateRemoteEnv() {
  return validateEnv(remoteEnvSchema);
}
