/**
 * Edit User Validation Schema
 *
 * Zod schema for validating user edit form data.
 * Only displayName is editable; email is shown as read-only.
 */

import { z } from "zod";

/**
 * Schema for editing an existing user
 */
export const editUserSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name must be less than 100 characters"),
});

/**
 * TypeScript type inferred from schema
 */
export type EditUserFormData = z.infer<typeof editUserSchema>;
