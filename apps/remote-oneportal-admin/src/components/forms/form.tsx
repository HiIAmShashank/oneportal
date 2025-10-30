/**
 * Form Components for TanStack Form integration
 *
 * Provides shadcn/ui-styled form components that work with TanStack Form.
 * Includes accessibility features and proper error handling.
 */

import * as React from "react";
import { Label } from "@one-portal/ui";
import { cn } from "@one-portal/ui";

/**
 * Form wrapper component
 * Note: Renders a div, not a form element, to avoid nesting when used inside actual forms
 */
export const Form = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-6", className)} {...props} />;
});
Form.displayName = "Form";

/**
 * Field container component
 */
export const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal";
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-2",
        orientation === "horizontal" && "flex items-center space-x-3 space-y-0",
        className,
      )}
      {...props}
    />
  );
});
Field.displayName = "Field";

/**
 * Field label component
 */
export const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
});
FieldLabel.displayName = "FieldLabel";

/**
 * Field control wrapper (for inputs)
 */
export const FieldControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("w-full", className)} {...props} />;
});
FieldControl.displayName = "FieldControl";

/**
 * Field description/help text
 */
export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

/**
 * Field error message component
 * Automatically shows errors from TanStack Form field state
 */
export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: any; // Simplified to avoid complex generic types
  }
>(({ className, field, children, ...props }, ref) => {
  // Get error from field state if field is provided
  const errorObject = field?.state.meta.errors?.[0];

  // Extract message from Zod error object or use as-is if it's already a string
  const errorMessage = errorObject?.message || errorObject;

  if (!errorMessage && !children) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {errorMessage || children}
    </p>
  );
});
FieldError.displayName = "FieldError";
