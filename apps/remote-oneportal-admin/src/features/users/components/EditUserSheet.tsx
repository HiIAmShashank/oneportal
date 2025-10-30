/**
 * Edit User Sheet Component
 *
 * A sliding sheet from the right side containing a form to edit existing users.
 * Features display name editing and active status toggle with real-time feedback.
 */

import { useEffect, useState } from "react";
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
import {
  editUserSchema,
  type EditUserFormData,
} from "../schemas/editUserSchema";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useToggleUserActive } from "../hooks/useToggleUserActive";
import type { ApiUser } from "../../../api/types";
import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchUser } from "../../../api/client";

interface EditUserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUser | null;
}

export function EditUserSheet({
  open,
  onOpenChange,
  user,
}: EditUserSheetProps) {
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateUser();
  const { mutate: toggleActiveMutate, isPending: isTogglingActive } =
    useToggleUserActive();

  const [isActive, setIsActive] = useState(user?.isActive ?? false);

  // Fetch fresh user data when sheet opens
  const { data: freshUser, isLoading: isFetchingUser } = useAuthenticatedQuery(
    ["user", user?.userIdentifier],
    (token) => fetchUser(token, user!.userIdentifier),
    {
      enabled: open && !!user?.userIdentifier,
      staleTime: 0, // Always fetch fresh data
    },
  );

  // Update isActive state when fresh user data arrives
  useEffect(() => {
    if (freshUser) {
      setIsActive(freshUser.isActive);
    }
  }, [freshUser]);

  const form = useAppForm<EditUserFormData>({
    defaultValues: {
      displayName: freshUser?.displayName || user?.displayName || "",
    },
    validators: {
      onChange: editUserSchema,
    },
    onSubmit: async ({ value }: { value: EditUserFormData }) => {
      if (!user) return;

      updateMutate(
        { userIdentifier: user.userIdentifier, data: value },
        {
          onSuccess: () => {
            // Close sheet on success
            onOpenChange(false);
          },
        },
      );
    },
  });

  // Reset form when fresh user data arrives
  useEffect(() => {
    if (freshUser) {
      form.reset({
        displayName: freshUser.displayName,
      });
    }
  }, [freshUser, form]);

  // Handle active status toggle
  const handleToggleActive = (checked: boolean) => {
    if (!user) return;

    setIsActive(checked); // Optimistic update
    toggleActiveMutate(
      { userIdentifier: user.userIdentifier, activate: checked },
      {
        onError: () => {
          // Revert on error
          setIsActive(!checked);
        },
      },
    );
  };

  const isPending = isUpdating || isTogglingActive;
  const displayUser = freshUser || user;

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update user information and manage account status.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-6"
        >
          <Form>
            {/* Email Field (Read-only) */}
            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <FieldControl>
                <Input
                  type="email"
                  value={displayUser?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </FieldControl>
              <FieldDescription>
                Email cannot be changed after account creation.
              </FieldDescription>
            </Field>

            {/* Display Name Field */}
            <form.Field name="displayName">
              {(field) => (
                <Field>
                  <FieldLabel>Display Name *</FieldLabel>
                  <FieldControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={(field.state.value as string) || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isPending || isFetchingUser}
                    />
                  </FieldControl>
                  <FieldDescription>
                    The name that will be displayed throughout the application.
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

            {/* Active Status Toggle */}
            <Field orientation="horizontal">
              <div className="space-y-0.5">
                <Label htmlFor="active-status">Active Status</Label>
                <FieldDescription>
                  {isActive
                    ? "User can access the system"
                    : "User is locked out of the system"}
                </FieldDescription>
              </div>
              <Switch
                id="active-status"
                checked={isActive}
                onCheckedChange={handleToggleActive}
                disabled={isPending || isFetchingUser}
              />
            </Field>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {(state) => {
                  const [canSubmit, isSubmitting] = state as [boolean, boolean];
                  return (
                    <Button
                      type="submit"
                      disabled={!canSubmit || isPending || isFetchingUser}
                    >
                      {isPending || isSubmitting
                        ? "Updating..."
                        : "Update User"}
                    </Button>
                  );
                }}
              </form.Subscribe>
            </div>
          </Form>
        </form>
      </SheetContent>
    </Sheet>
  );
}
