import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { useCreateFeature } from "../hooks/useCreateFeature";
import { useApplications } from "../../applications/hooks/useApplications";
import {
  createFeatureSchema,
  type CreateFeatureFormData,
} from "../schemas/createFeatureSchema";

interface CreateFeatureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Sheet component for creating a new feature
 *
 * Features:
 * - Form with validation (Zod schema)
 * - Application dropdown (shows only active applications)
 * - Icon name with reference to lucide.dev
 * - Handles success/error states
 * - Closes on successful creation
 *
 * @example
 * ```tsx
 * function FeaturesPage() {
 *   const [createOpen, setCreateOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setCreateOpen(true)}>Create Feature</Button>
 *       <CreateFeatureSheet open={createOpen} onOpenChange={setCreateOpen} />
 *     </>
 *   );
 * }
 * ```
 */
export function CreateFeatureSheet({
  open,
  onOpenChange,
}: CreateFeatureSheetProps) {
  const createMutation = useCreateFeature();
  const { data: applications = [], isLoading: applicationsLoading } =
    useApplications();

  // Show all applications (not just active ones) since users may need to add features to inactive apps
  // Applications will be clearly labeled with their status in the dropdown

  const form = useAppForm<CreateFeatureFormData>({
    defaultValues: {
      applicationIdentifier: "",
      featureName: "",
      featureDescription: "",
      featureUrl: "",
      iconName: "",
      isActive: true,
    },
    validators: {
      onChange: createFeatureSchema,
    },
    onSubmit: async ({ value }: { value: CreateFeatureFormData }) => {
      createMutation.mutate(value, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create Feature</SheetTitle>
          <SheetDescription>
            Add a new feature to an application. All fields are required except
            description.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Form className="py-6">
            <form.Field name="applicationIdentifier">
              {(field) => (
                <Field>
                  <FieldLabel>Application</FieldLabel>
                  <FieldControl>
                    <Select
                      value={(field.state.value as string) || ""}
                      onValueChange={(value) => field.handleChange(value)}
                      disabled={applicationsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            applicationsLoading
                              ? "Loading applications..."
                              : applications.length === 0
                                ? "No applications available"
                                : "Select an application"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.length === 0 && !applicationsLoading ? (
                          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No applications found. Create an application first.
                          </div>
                        ) : (
                          applications.map((app) => (
                            <SelectItem
                              key={app.applicationIdentifier}
                              value={app.applicationIdentifier}
                            >
                              {app.applicationName}
                              {!app.isActive && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (Inactive)
                                </span>
                              )}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FieldControl>
                  <FieldDescription>
                    The parent application this feature belongs to. You can add
                    features to inactive applications.
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

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
          </Form>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? "Creating..." : "Create Feature"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
