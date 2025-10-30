/**
 * Combobox Field Component for TanStack Form
 *
 * Provides a searchable dropdown component that integrates with TanStack Form.
 * Built with shadcn/ui Command + Popover components.
 */

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@one-portal/ui";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Combobox Field Component
 *
 * A searchable dropdown that integrates with TanStack Form via field.handleChange
 *
 * @example
 * ```tsx
 * <form.Field name="userId">
 *   {(field) => (
 *     <Field>
 *       <FieldLabel>User</FieldLabel>
 *       <FieldControl>
 *         <ComboboxField
 *           value={field.state.value}
 *           onValueChange={field.handleChange}
 *           options={users.map(u => ({ value: u.id, label: u.name }))}
 *           placeholder="Select user..."
 *           searchPlaceholder="Search users..."
 *         />
 *       </FieldControl>
 *       <FieldError field={field} />
 *     </Field>
 *   )}
 * </form.Field>
 * ```
 */
export function ComboboxField({
  value,
  onValueChange,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  className,
}: ComboboxFieldProps) {
  const [open, setOpen] = React.useState(false);

  // Find the selected option's label
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className,
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
