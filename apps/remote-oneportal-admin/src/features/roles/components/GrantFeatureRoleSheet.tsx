/**
 * Grant Feature Role Sheet Component
 *
 * Sheet dialog for granting feature-level roles to users.
 * Validates that user has application-level role before granting feature role.
 * Uses Combobox components for searchable dropdowns.
 */

import { useMemo, useState, useEffect } from "react";
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
  FieldDescription,
} from "../../../components/forms/form";
import { ComboboxField } from "../../../components/forms/ComboboxField";
import { useAppForm } from "../../../hooks/useAppForm";
import {
  grantFeatureRoleSchema,
  type GrantFeatureRoleFormData,
} from "../schemas/grantFeatureRoleSchema";
import { useGrantFeatureRole } from "../hooks/useGrantFeatureRole";
import { useUsers } from "../../users/hooks/useUsers";
import { useApplications } from "../../applications/hooks/useApplications";
import { useFeatures } from "../../features/hooks/useFeatures";
import { useRoles } from "../hooks/useRoles";
import { useUserApplicationRoles } from "../hooks/useUserApplicationRoles";
import { useUserFeatureRoles } from "../hooks/useUserFeatureRoles";

interface GrantFeatureRoleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserId?: string;
}

export function GrantFeatureRoleSheet({
  open,
  onOpenChange,
  selectedUserId,
}: GrantFeatureRoleSheetProps) {
  const { mutate: grantRole, isPending } = useGrantFeatureRole();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: applications = [], isLoading: isLoadingApplications } =
    useApplications();
  const { data: allFeatures = [], isLoading: isLoadingFeatures } =
    useFeatures();
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  // State for reactive form values (initialize before form)
  const [currentUserId, setCurrentUserId] = useState(selectedUserId || "");
  const [currentAppId, setCurrentAppId] = useState("");
  const [currentFeatureId, setCurrentFeatureId] = useState("");

  const form = useAppForm<GrantFeatureRoleFormData>({
    defaultValues: {
      userIdentifier: selectedUserId || "",
      applicationIdentifier: "",
      featureIdentifier: "",
      roleIdentifier: "",
    },
    validators: {
      onChange: grantFeatureRoleSchema,
    },
    onSubmit: async ({ value }) => {
      // Remove applicationIdentifier before sending (not needed by API)
      const { applicationIdentifier: _, ...apiData } = value;

      grantRole(
        { data: apiData },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
    },
  });

  // Fetch user's current roles
  const { data: userAppRoles = [] } = useUserApplicationRoles(currentUserId);
  const { data: userFeatureRoles = [] } = useUserFeatureRoles(currentUserId);

  // Sync currentUserId when selectedUserId changes or sheet opens
  useEffect(() => {
    if (open && selectedUserId) {
      setCurrentUserId(selectedUserId);
    }
  }, [open, selectedUserId]);

  // Check if user has application-level role for selected application
  const hasAppAccess = useMemo(
    () =>
      userAppRoles.some((role) => role.applicationIdentifier === currentAppId),
    [userAppRoles, currentAppId],
  );

  // Filter features by selected application
  const filteredFeatures = useMemo(
    () =>
      allFeatures.filter(
        (feature) => feature.applicationIdentifier === currentAppId,
      ),
    [allFeatures, currentAppId],
  );

  // Find if user already has a role for the selected feature
  const existingRole = userFeatureRoles.find(
    (role) => role.featureIdentifier === currentFeatureId,
  );

  // Show warning if user doesn't have app access
  const showPrerequisiteWarning = currentAppId && !hasAppAccess;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Grant Feature Role</SheetTitle>
          <SheetDescription>
            Assign a role to a user for a specific feature. User must have an
            application-level role first.
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
                        // Reset application and feature when user changes
                        form.setFieldValue("applicationIdentifier", "");
                        form.setFieldValue("featureIdentifier", "");
                        setCurrentAppId("");
                        setCurrentFeatureId("");
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
                        // Reset feature when application changes
                        form.setFieldValue("featureIdentifier", "");
                        setCurrentFeatureId("");
                      }}
                      options={applications.map((app) => ({
                        value: app.applicationIdentifier,
                        label: app.applicationName,
                      }))}
                      placeholder="Select application..."
                      searchPlaceholder="Search applications..."
                      emptyMessage="No applications found."
                      disabled={isLoadingApplications || !currentUserId}
                    />
                  </FieldControl>
                  {showPrerequisiteWarning && (
                    <FieldDescription className="text-destructive">
                      User does not have an application-level role for this
                      application. Grant an application role first.
                    </FieldDescription>
                  )}
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            {/* Feature Selection */}
            <form.Field name="featureIdentifier">
              {(field) => (
                <Field>
                  <FieldLabel>Feature</FieldLabel>
                  <FieldControl>
                    <ComboboxField
                      value={(field.state.value as string) || ""}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setCurrentFeatureId(value);
                      }}
                      options={filteredFeatures.map((feature) => ({
                        value: feature.featureIdentifier,
                        label: feature.featureName,
                      }))}
                      placeholder="Select feature..."
                      searchPlaceholder="Search features..."
                      emptyMessage={
                        currentAppId
                          ? "No features found for this application."
                          : "Select an application first."
                      }
                      disabled={isLoadingFeatures || !currentAppId}
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
              <Button
                type="submit"
                disabled={isPending || !!showPrerequisiteWarning}
              >
                {isPending ? "Granting..." : "Grant Role"}
              </Button>
            </div>
          </Form>
        </form>
      </SheetContent>
    </Sheet>
  );
}
