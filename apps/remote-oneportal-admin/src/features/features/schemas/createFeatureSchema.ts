import { z } from "zod";

/**
 * Validation schema for creating a new feature
 *
 * All fields are required except featureDescription.
 */
export const createFeatureSchema = z.object({
  applicationIdentifier: z
    .string()
    .min(1, "Application is required")
    .uuid("Invalid application identifier"),
  featureName: z
    .string()
    .min(1, "Feature name is required")
    .max(255, "Feature name must be less than 255 characters"),
  featureDescription: z
    .string()
    .max(1000, "Feature description must be less than 1000 characters")
    .optional()
    .default(""),
  featureUrl: z
    .string()
    .min(1, "Feature URL is required")
    .max(500, "Feature URL must be less than 500 characters"),
  iconName: z
    .string()
    .min(1, "Icon name is required")
    .max(100, "Icon name must be less than 100 characters"),
  isActive: z.boolean().default(true),
});

export type CreateFeatureFormData = z.infer<typeof createFeatureSchema>;
