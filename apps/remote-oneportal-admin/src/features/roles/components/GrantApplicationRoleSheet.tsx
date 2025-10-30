/**
 * Grant Application Role Sheet Component
 *
 * Sheet dialog for granting application-level roles to users.
 * Uses Combobox components for searchable dropdowns.
 */

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
} from "@one-portal/ui";
import {
  Form,
  Field,
  FieldLabel,
  FieldControl,
  FieldError,
} from "../../../components/forms/form";
import { ComboboxField } from "../../../components/forms/ComboboxField";
import { useAppForm } from "../../../hooks/useAppForm";
import {
  grantApplicationRoleSchema,
  type GrantApplicationRoleFormData,
} from "../schemas/grantApplicationRoleSchema";
import { useGrantApplicationRole } from "../hooks/useGrantApplicationRole";
import { useUsers } from "../../users/hooks/useUsers";
import { useApplications } from "../../applications/hooks/useApplications";
import { useRoles } from "../hooks/useRoles";
import { useUserApplicationRoles } from "../hooks/useUserApplicationRoles";

interface GrantApplicationRoleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserId?: string;
}

export function GrantApplicationRoleSheet({
  open,
  onOpenChange,
  selectedUserId,
}: GrantApplicationRoleSheetProps) {
  const { mutate: grantRole, isPending } = useGrantApplicationRole();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: applications = [], isLoading: isLoadingApplications } =
    useApplications();
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  const form = useAppForm<GrantApplicationRoleFormData>({
    defaultValues: {
      userIdentifier: selectedUserId || "",
      applicationIdentifier: "",
      roleIdentifier: "",
    },
    validators: {
      onChange: grantApplicationRoleSchema,
    },
    onSubmit: async ({ value }) => {
      grantRole(
        { data: value },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
    },
  });

  // We'll get form values directly from field state in the form render
  // For fetching roles, we'll use a state variable updated via form field onChange
  const [currentUserId, setCurrentUserId] = useState(selectedUserId || "");
  const [currentAppId, setCurrentAppId] = useState("");

  // Fetch user's current application roles to show existing role
  const { data: userAppRoles = [] } = useUserApplicationRoles(currentUserId);

  // Find if user already has a role for the selected application
  const existingRole = userAppRoles.find(
    (role) => role.applicationIdentifier === currentAppId,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Grant Application Role</SheetTitle>
          <SheetDescription>
            Assign a role to a user for an application. This grants access to
            the entire application.
            {existingRole && (
              <span className="block mt-2 text-yellow-600">
                Current role: {existingRole.role.roleName} (will be replaced)
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Form>
            {/* User Selection */}
            <form.Field name="userIdentifier">
              {(field) => (
                <Field>
                  <FieldLabel>User</FieldLabel>
                  <FieldControl>
                    <ComboboxField
                      value={(field.state.value as string) || ""}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setCurrentUserId(value);
                      }}
                      options={users.map((user) => ({
                        value: user.userIdentifier,
                        label: `${user.displayName} (${user.email})`,
                      }))}
                      placeholder="Select user..."
                      searchPlaceholder="Search users..."
                      emptyMessage="No users found."
                      disabled={isLoadingUsers || !!selectedUserId}
                    />
                  </FieldControl>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            {/* Application Selection */}
            <form.Field name="applicationIdentifier">
              {(field) => (
                <Field>
                  <FieldLabel>Application</FieldLabel>
                  <FieldControl>
                    <ComboboxField
                      value={(field.state.value as string) || ""}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setCurrentAppId(value);
                      }}
                      options={applications.map((app) => ({
                        value: app.applicationIdentifier,
                        label: app.applicationName,
                      }))}
                      placeholder="Select application..."
                      searchPlaceholder="Search applications..."
                      emptyMessage="No applications found."
                      disabled={isLoadingApplications}
                    />
                  </FieldControl>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            {/* Role Selection */}
            <form.Field name="roleIdentifier">
              {(field) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <FieldControl>
                    <ComboboxField
                      value={(field.state.value as string) || ""}
                      onValueChange={field.handleChange}
                      options={roles.map((role) => ({
                        value: role.roleIdentifier,
                        label: `${role.roleName} (Level ${role.roleLevel})`,
                      }))}
                      placeholder="Select role..."
                      searchPlaceholder="Search roles..."
                      emptyMessage="No roles found."
                      disabled={isLoadingRoles}
                    />
                  </FieldControl>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Granting..." : "Grant Role"}
              </Button>
            </div>
          </Form>
        </form>
      </SheetContent>
    </Sheet>
  );
}
