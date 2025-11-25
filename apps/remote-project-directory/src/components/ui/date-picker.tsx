import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  format,
} from "@one-portal/ui";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function DatePicker({
  date,
  setDate,
  label,
  placeholder = "Select date",
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={cn(
              "w-full justify-between font-normal text-left",
              !date && "text-muted-foreground",
            )}
          >
            {date ? format(date, "P") : placeholder}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            className="w-[250px]"
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={2100}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
