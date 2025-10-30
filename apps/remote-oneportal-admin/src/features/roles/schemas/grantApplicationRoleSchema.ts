import { z } from "zod";

/**
 * Schema for granting an application-level role to a user
 */
export const grantApplicationRoleSchema = z.object({
  userIdentifier: z.string().uuid("Please select a valid user"),
  applicationIdentifier: z.string().uuid("Please select a valid application"),
  roleIdentifier: z.string().uuid("Please select a valid role"),
});

export type GrantApplicationRoleFormData = z.infer<
  typeof grantApplicationRoleSchema
>;
