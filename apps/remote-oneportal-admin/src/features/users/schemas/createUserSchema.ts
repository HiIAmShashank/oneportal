/**
 * Create User Validation Schema
 *
 * Zod schema for validating user creation form data.
 * Ensures email is valid format and display name meets length requirements.
 */

import { z } from "zod";

/**
 * Schema for creating a new user
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name must be less than 100 characters"),
});

/**
 * TypeScript type inferred from schema
 */
export type CreateUserFormData = z.infer<typeof createUserSchema>;
