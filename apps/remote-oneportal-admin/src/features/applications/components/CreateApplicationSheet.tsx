import { useEffect } from "react";
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
  createApplicationSchema,
  type CreateApplicationFormData,
} from "../schemas/createApplicationSchema";
import { useCreateApplication } from "../hooks/useCreateApplication";
import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchUsers } from "../../../api/client";
import type { ApiUser } from "../../../api/types";

interface CreateApplicationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateApplicationSheet({
  open,
  onOpenChange,
}: CreateApplicationSheetProps) {
  const { mutate, isPending } = useCreateApplication();

  // Fetch all users for owner dropdown
  const { data: allUsers, isLoading: isLoadingUsers } = useAuthenticatedQuery<
    ApiUser[]
  >(["users", "active"], fetchUsers, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter to only active users
  const activeUsers = allUsers?.filter((u) => u.isActive) ?? [];

  const form = useAppForm<CreateApplicationFormData>({
    defaultValues: {
      applicationName: "",
      applicationDescription: "",
      applicationUrl: "",
      landingPage: "",
      module: "",
      scope: "",
      iconName: "",
      ownerUserIdentifier: "",
    },
    validators: {
      onChange: createApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        { data: value },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        },
      );
    },
  });

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Create Application</SheetTitle>
          <SheetDescription>
            Create a new application in the system. All fields are required.
          </SheetDescription>
        </SheetHeader>

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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
                      />
                    </FieldControl>
                    <FieldDescription>Unique scope identifier</FieldDescription>
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
                        disabled={isPending}
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

              {/* Owner User */}
              <form.Field name="ownerUserIdentifier">
                {(field) => (
                  <Field>
                    <FieldLabel>Owner *</FieldLabel>
                    <FieldControl>
                      <Select
                        value={(field.state.value as string) || ""}
                        onValueChange={(value) => field.handleChange(value)}
                        disabled={isPending || isLoadingUsers}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {activeUsers.map((user) => (
                            <SelectItem
                              key={user.userIdentifier}
                              value={user.userIdentifier}
                            >
                              {user.displayName} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldControl>
                    <FieldDescription>
                      Application owner (active users only)
                    </FieldDescription>
                    <FieldError field={field} />
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Application"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
