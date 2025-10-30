import { z } from "zod";

export const editApplicationSchema = z.object({
  applicationName: z
    .string()
    .min(2, "Application name must be at least 2 characters")
    .max(100, "Application name must not exceed 100 characters"),
  applicationDescription: z
    .string()
    .min(1, "Application description is required"),
  applicationUrl: z.string().min(1, "Application URL is required"),
  landingPage: z.string().min(1, "Landing page is required"),
  module: z.string().min(1, "Module is required"),
  scope: z.string().min(1, "Scope is required"),
  iconName: z.string().min(1, "Icon name is required"),
  ownerUserIdentifier: z.string().uuid("Please select a valid owner"),
});

export type EditApplicationFormData = z.infer<typeof editApplicationSchema>;
