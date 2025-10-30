import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
  Input,
  Switch,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@one-portal/ui";
import {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "../../../components/forms/form";
import { useAppForm } from "../../../hooks/useAppForm";
import {
  editApplicationSchema,
  type EditApplicationFormData,
} from "../schemas/editApplicationSchema";
import { useUpdateApplication } from "../hooks/useUpdateApplication";
import { useToggleApplicationActive } from "../hooks/useToggleApplicationActive";
import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchApplication } from "../../../api/client";
import type { ApiApplication } from "../../../api/types";
import { useUsers } from "../../users/hooks/useUsers";

interface EditApplicationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApiApplication | null;
}

export function EditApplicationSheet({
  open,
  onOpenChange,
  application,
}: EditApplicationSheetProps) {
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateApplication();
  const { mutate: toggleActiveMutate, isPending: isTogglingActive } =
    useToggleApplicationActive();
  const { data: users = [] } = useUsers();

  // Fetch fresh application data when sheet opens
  const { data: freshApplication, isLoading: isLoadingApplication } =
    useAuthenticatedQuery<ApiApplication>(
      ["application", application?.applicationIdentifier],
      (token) => fetchApplication(token, application!.applicationIdentifier),
      {
        enabled: open && !!application?.applicationIdentifier,
        staleTime: 0, // Always fetch fresh data
      },
    );

  const form = useAppForm<EditApplicationFormData>({
    defaultValues: {
      applicationName: application?.applicationName || "",
      applicationDescription: application?.applicationDescription || "",
      applicationUrl: application?.applicationUrl || "",
      landingPage: application?.landingPage || "",
      module: application?.module || "",
      scope: application?.scope || "",
      iconName: application?.iconName || "",
      ownerUserIdentifier: application?.owner?.userIdentifier || "",
    },
    validators: {
      onChange: editApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!application) return;

      updateMutate(
        {
          applicationIdentifier: application.applicationIdentifier,
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

  // Update form when fresh data arrives
  useEffect(() => {
    if (freshApplication) {
      form.setFieldValue("applicationName", freshApplication.applicationName);
      form.setFieldValue(
        "applicationDescription",
        freshApplication.applicationDescription,
      );
      form.setFieldValue("applicationUrl", freshApplication.applicationUrl);
      form.setFieldValue("landingPage", freshApplication.landingPage);
      form.setFieldValue("module", freshApplication.module);
      form.setFieldValue("scope", freshApplication.scope);
      form.setFieldValue("iconName", freshApplication.iconName);
      form.setFieldValue(
        "ownerUserIdentifier",
        freshApplication.owner?.userIdentifier || "",
      );
    }
  }, [freshApplication, form]);

  const handleToggleActive = () => {
    if (!application) return;

    toggleActiveMutate({
      applicationIdentifier: application.applicationIdentifier,
      activate: !freshApplication?.isActive,
    });
  };

  const currentApplication = freshApplication || application;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Edit Application</SheetTitle>
          <SheetDescription>
            Update application information. All fields are required.
          </SheetDescription>
        </SheetHeader>

        {isLoadingApplication ? (
          <div className="mt-6 text-center text-muted-foreground">
            Loading application data...
          </div>
        ) : (
          <Form className="mt-6 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="space-y-4">
                {/* Application Name */}
                <form.Field name="applicationName">
                  {(field) => (
                    <Field>
                      <FieldLabel>Application Name *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="e.g., Portal Dashboard"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Application Description */}
                <form.Field name="applicationDescription">
                  {(field) => (
                    <Field>
                      <FieldLabel>Description *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="e.g., Main dashboard application"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Application URL */}
                <form.Field name="applicationUrl">
                  {(field) => (
                    <Field>
                      <FieldLabel>Application URL *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="https://example.com"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Landing Page */}
                <form.Field name="landingPage">
                  {(field) => (
                    <Field>
                      <FieldLabel>Landing Page *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="/dashboard"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Module */}
                <form.Field name="module">
                  {(field) => (
                    <Field>
                      <FieldLabel>Module *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="dashboard"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldDescription>
                        Unique module identifier
                      </FieldDescription>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Scope */}
                <form.Field name="scope">
                  {(field) => (
                    <Field>
                      <FieldLabel>Scope *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="portal.dashboard"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldDescription>
                        Unique scope identifier
                      </FieldDescription>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Icon Name */}
                <form.Field name="iconName">
                  {(field) => (
                    <Field>
                      <FieldLabel>Icon Name *</FieldLabel>
                      <FieldControl>
                        <Input
                          value={(field.state.value as string) || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          placeholder="layout-dashboard"
                          disabled={isUpdating}
                        />
                      </FieldControl>
                      <FieldDescription>
                        Enter a Lucide icon name. Browse icons at{" "}
                        <a
                          href="https://lucide.dev/icons/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:no-underline"
                        >
                          lucide.dev
                        </a>
                      </FieldDescription>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Owner */}
                <form.Field name="ownerUserIdentifier">
                  {(field) => (
                    <Field>
                      <FieldLabel>Owner *</FieldLabel>
                      <FieldControl>
                        <Select
                          value={(field.state.value as string) || ""}
                          onValueChange={(value) => field.handleChange(value)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem
                                key={user.userIdentifier}
                                value={user.userIdentifier}
                              >
                                {user.email}
                                {!user.isActive && " (Inactive)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldControl>
                      <FieldDescription>
                        Assign an owner to this application
                      </FieldDescription>
                      <FieldError field={field} />
                    </Field>
                  )}
                </form.Field>

                {/* Active Status */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="active-toggle">Active Status</Label>
                    <div className="text-sm text-muted-foreground">
                      {currentApplication?.isActive
                        ? "Application is active"
                        : "Application is inactive"}
                    </div>
                  </div>
                  <Switch
                    id="active-toggle"
                    checked={currentApplication?.isActive}
                    onCheckedChange={handleToggleActive}
                    disabled={isTogglingActive || isUpdating}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
