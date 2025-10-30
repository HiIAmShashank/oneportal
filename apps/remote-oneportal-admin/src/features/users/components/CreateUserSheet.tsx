/**
 * Create User Sheet Component
 *
 * A sliding sheet from the right side containing a form to create new users.
 * Features email and display name validation with real-time feedback.
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
  Input,
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
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/createUserSchema";
import { useCreateUser } from "../hooks/useCreateUser";

interface CreateUserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserSheet({ open, onOpenChange }: CreateUserSheetProps) {
  const { mutate, isPending } = useCreateUser();

  const form = useAppForm<CreateUserFormData>({
    defaultValues: {
      email: "",
      displayName: "",
    },
    validators: {
      onChange: createUserSchema,
    },
    onSubmit: async ({ value }: { value: CreateUserFormData }) => {
      mutate(
        { data: value },
        {
          onSuccess: () => {
            // Reset form and close sheet on success
            form.reset();
            onOpenChange(false);
          },
        },
      );
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Create New User</SheetTitle>
          <SheetDescription>
            Add a new user to the system. They will receive an email
            notification.
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
            {/* Email Field */}
            <form.Field name="email">
              {(field) => (
                <Field>
                  <FieldLabel>Email Address *</FieldLabel>
                  <FieldControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      value={(field.state.value as string) || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isPending}
                    />
                  </FieldControl>
                  <FieldDescription>
                    The user's primary email address for login and
                    notifications.
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

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
                      disabled={isPending}
                    />
                  </FieldControl>
                  <FieldDescription>
                    The name that will be displayed throughout the application.
                  </FieldDescription>
                  <FieldError field={field} />
                </Field>
              )}
            </form.Field>

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
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isPending}>
                    {isPending || isSubmitting ? "Creating..." : "Create User"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </Form>
        </form>
      </SheetContent>
    </Sheet>
  );
}
