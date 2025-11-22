import { Calendar as CalendarIcon } from "lucide-react";
import {
  cn,
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  format,
  type DateRange,
} from "@one-portal/ui";

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange: (date?: DateRange) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder = "Pick a date range",
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            className="w-[400px]"
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
