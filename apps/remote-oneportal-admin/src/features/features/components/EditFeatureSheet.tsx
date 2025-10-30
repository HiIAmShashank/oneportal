import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
  Input,
  Switch,
} from "@one-portal/ui";
import { useAppForm } from "../../../hooks/useAppForm";
import {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "../../../components/forms/form";
import { useUpdateFeature } from "../hooks/useUpdateFeature";
import { editFeatureSchema } from "../schemas/editFeatureSchema";
import type { ApiFeature } from "../../../api/types";

interface EditFeatureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: ApiFeature | null;
}

/**
 * Sheet component for editing an existing feature
 *
 * Features:
 * - Form with validation (Zod schema)
 * - Pre-populated with feature data
 * - Application name shown as read-only (cannot be changed)
 * - Icon name with reference to lucide.dev
 * - Handles success/error states
 * - Closes on successful update
 *
 * @example
 * ```tsx
 * function FeaturesTable() {
 *   const [editOpen, setEditOpen] = useState(false);
 *   const [selectedFeature, setSelectedFeature] = useState<ApiFeature | null>(null);
 *
 *   const handleEdit = (feature: ApiFeature) => {
 *     setSelectedFeature(feature);
 *     setEditOpen(true);
 *   };
 *
 *   return (
 *     <>
 *       <DataTable data={features} onEdit={handleEdit} />
 *       <EditFeatureSheet
 *         open={editOpen}
 *         onOpenChange={setEditOpen}
 *         feature={selectedFeature}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function EditFeatureSheet({
  open,
  onOpenChange,
  feature,
}: EditFeatureSheetProps) {
  const updateMutation = useUpdateFeature();

  const form = useAppForm({
    defaultValues: {
      featureName: feature?.featureName || "",
      featureDescription: feature?.featureDescription || "",
      featureUrl: feature?.featureUrl || "",
      iconName: feature?.iconName || "",
      isActive: feature?.isActive ?? true,
    },
    validators: {
      onChange: editFeatureSchema,
    },
    onSubmit: async ({ value }) => {
      if (!feature) return;

      updateMutation.mutate(
        {
          featureIdentifier: feature.featureIdentifier,
          data: value,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    },
  });

  if (!feature) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Feature</SheetTitle>
          <SheetDescription>
            Update the feature details. Application cannot be changed.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Form className="space-y-6 py-6">
            <div className="space-y-2">
              <FieldLabel>Application</FieldLabel>
              <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                {feature.applicationName}
              </div>
              <p className="text-sm text-muted-foreground">
                The parent application cannot be changed
              </p>
            </div>

            <form.Field name="featureName">
              {(field) => (
                <Field>
                  <FieldLabel>Feature Name</FieldLabel>
                  <FieldControl>
                    <Input
                      placeholder="Analytics Dashboard"
                      value={(field.state.value as string) || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </FieldControl>
                  <FieldDescription>
                    Unique name for the feature within the application
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            <form.Field name="featureDescription">
              {(field) => (
                <Field>
                  <FieldLabel>Description (Optional)</FieldLabel>
                  <FieldControl>
                    <Input
                      placeholder="View and analyze application metrics..."
                      value={(field.state.value as string) || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </FieldControl>
                  <FieldDescription>
                    Brief description of what this feature does
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            <form.Field name="featureUrl">
              {(field) => (
                <Field>
                  <FieldLabel>Feature URL</FieldLabel>
                  <FieldControl>
                    <Input
                      placeholder="/analytics"
                      value={(field.state.value as string) || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </FieldControl>
                  <FieldDescription>
                    Relative path or full URL for the feature
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            <form.Field name="iconName">
              {(field) => (
                <Field>
                  <FieldLabel>Icon Name</FieldLabel>
                  <FieldControl>
                    <Input
                      placeholder="BarChart"
                      value={(field.state.value as string) || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </FieldControl>
                  <FieldDescription>
                    Icon identifier from{" "}
                    <a
                      href="https://lucide.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      lucide.dev
                    </a>
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            <form.Field name="isActive">
              {(field) => (
                <Field>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FieldLabel>Active Status</FieldLabel>
                      <FieldDescription>
                        Set whether this feature is active and visible to users
                      </FieldDescription>
                    </div>
                    <FieldControl>
                      <Switch
                        checked={field.state.value as boolean}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                      />
                    </FieldControl>
                  </div>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </form>
      </SheetContent>
    </Sheet>
  );
}
