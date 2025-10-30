import { z } from 'zod';

export const themeSchema = z.enum(['light', 'dark', 'system']);

export const languageSchema = z.enum(['en', 'es', 'fr', 'de']);

export const userPreferencesSchema = z.object({
  theme: themeSchema.default('system'),
  language: languageSchema.default('en'),
  updatedAt: z.date().optional(),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;

export function validatePreferences(data: unknown): UserPreferencesInput {
  return userPreferencesSchema.parse(data);
}

export function safeValidatePreferences(data: unknown) {
  return userPreferencesSchema.safeParse(data);
}

export const partialPreferencesSchema = userPreferencesSchema.partial();

export function validatePartialPreferences(data: unknown) {
  return partialPreferencesSchema.parse(data);
}
