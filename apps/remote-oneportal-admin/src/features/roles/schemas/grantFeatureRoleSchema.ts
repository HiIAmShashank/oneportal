import { z } from "zod";

/**
 * Schema for granting a feature-level role to a user
 */
export const grantFeatureRoleSchema = z.object({
  userIdentifier: z.string().uuid("Please select a valid user"),
  applicationIdentifier: z.string().uuid("Please select a valid application"),
  featureIdentifier: z.string().uuid("Please select a valid feature"),
  roleIdentifier: z.string().uuid("Please select a valid role"),
});

export type GrantFeatureRoleFormData = z.infer<typeof grantFeatureRoleSchema>;
