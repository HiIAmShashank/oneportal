/**
 * Custom hook for TanStack Form integration
 *
 * Wraps @tanstack/react-form with type-safe utilities for use with shadcn/ui components.
 * Supports Zod validation schemas for runtime type checking.
 *
 * @example
 * ```tsx
 * const form = useAppForm({
 *   defaultValues: { email: "", name: "" },
 *   validators: { onChange: userSchema },
 *   onSubmit: async ({ value }) => { ... }
 * });
 * ```
 */

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import type { ZodSchema } from "zod";

/**
 * Options for useAppForm hook - simplified to avoid complex FormOptions generics
 */
export interface UseAppFormOptions<TData> {
  /**
   * Default values for form fields
   */
  defaultValues: TData;

  /**
   * Zod schema for validation
   * Can be applied onChange, onBlur, or onSubmit
   */
  validators?: {
    onChange?: ZodSchema;
    onBlur?: ZodSchema;
    onSubmit?: ZodSchema;
  };

  /**
   * Form submission handler
   */
  onSubmit?: (props: { value: TData }) => void | Promise<void>;
}

/**
 * Create a TanStack Form instance with Zod validation
 *
 * @param options - Form configuration with Zod validators
 * @returns Form instance with type-safe field management
 */
export function useAppForm<TData>(options: UseAppFormOptions<TData>) {
  const { validators, defaultValues, onSubmit } = options;

  // Convert Zod schemas to TanStack validators
  const tanstackValidators = validators
    ? {
        onChange: validators.onChange,
        onBlur: validators.onBlur,
        onSubmit: validators.onSubmit,
      }
    : undefined;

  /**
   * IMPORTANT: Uses type assertions to work around TanStack Form's
   * complex generic parameter requirements (12 generics).
   *
   * Runtime behavior is correct and validated by Zod schemas.
   * Type checking is limited - verify schema behavior in tests.
   *
   * The 'as any' assertions are necessary because:
   * 1. TanStack Form has 12 generic parameters (TFormData, TFormValidator, etc.)
   * 2. Our simplified interface uses ZodSchema which doesn't map 1:1 to TanStack's validator types
   * 3. The Zod validator adapter handles runtime validation correctly
   * 4. TypeScript would require explicit types for all 12 generics otherwise
   *
   * Trade-off: We lose compile-time type checking but gain developer ergonomics.
   * All validation happens at runtime via Zod schemas, which is the source of truth.
   *
   * @see https://tanstack.com/form/latest/docs/framework/react/guides/validation
   * @see https://tanstack.com/form/latest/docs/framework/react/reference/formApi
   */
  return useForm({
    defaultValues,
    validatorAdapter: zodValidator(),
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    validators: tanstackValidators as any,
    onSubmit,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}
