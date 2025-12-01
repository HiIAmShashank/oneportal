import { useState } from "react";
import { Button } from "@one-portal/ui";
import { Input } from "@one-portal/ui";
import { Label } from "@one-portal/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import { Combobox } from "../../../components/ui/combobox";
import { DatePicker } from "../../../components/ui/date-picker";
import {
  type GetProjectsRequest,
  type OptionSetsResponse,
} from "../../../api/types";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "@one-portal/ui";

interface ProjectFiltersProps {
  onFilter: (filters: Partial<GetProjectsRequest>) => void;
  optionSets?: OptionSetsResponse;
}

export function ProjectFilters({ onFilter, optionSets }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Partial<GetProjectsRequest>>({});

  // Calculate active filters count
  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof GetProjectsRequest] !== undefined &&
      filters[key as keyof GetProjectsRequest] !== "",
  ).length;

  const handleInputChange = (key: keyof GetProjectsRequest, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (
    key: "StartDate" | "ActualEndDate",
    date: Date | undefined,
  ) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    handleInputChange(key, formattedDate);
  };

  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (year === undefined || month === undefined || day === undefined) {
      return undefined;
    }
    return new Date(year, month - 1, day);
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  // Use dynamic options
  const regionOptions =
    optionSets?.regionCode.map((code) => ({ label: code, value: code })) || [];
  const unitOptions =
    optionSets?.unitCode.map((code) => ({ label: code, value: code })) || [];
  const divisionOptions =
    optionSets?.divisionCode.map((code) => ({ label: code, value: code })) ||
    [];
  const openClosedOptions =
    optionSets?.projectOpenOrClosed.map((status) => ({
      label: status,
      value: status,
    })) || [];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="default"
                className="ml-1 h-5 min-w-5 rounded-full"
              >
                {activeFiltersCount}
              </Badge>
            )}
            <span className="sr-only">Toggle filters</span>
            {isOpen ? (
              <ChevronUp className="ml-auto h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            )}
          </Button>
        </CollapsibleTrigger>
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={handleReset} className="h-8">
            Reset
          </Button>
        )}
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="rounded-lg border text-card-foreground shadow-sm">
          <div className="p-4 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {/* Text Inputs */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Search by name..."
                value={filters.ProjectName || ""}
                onChange={(e) =>
                  handleInputChange("ProjectName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Search description..."
                value={filters.Description || ""}
                onChange={(e) =>
                  handleInputChange("Description", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectNumber">Project Number</Label>
              <Input
                id="projectNumber"
                placeholder="Enter number..."
                value={filters.ProjectNumber || ""}
                onChange={(e) =>
                  handleInputChange("ProjectNumber", e.target.value)
                }
              />
            </div>

            {/* Dropdowns */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Combobox
                options={openClosedOptions}
                value={filters.ProjectOpenOrClosed}
                onValueChange={(val) =>
                  handleInputChange("ProjectOpenOrClosed", val)
                }
                placeholder="Select status..."
              />
            </div>
            <div className="space-y-2">
              <Label>Division Code</Label>
              <Combobox
                options={divisionOptions}
                value={filters.DivisionCode}
                onValueChange={(val) => handleInputChange("DivisionCode", val)}
                placeholder="Select division..."
              />
            </div>
            <div className="space-y-2">
              <Label>Region Code</Label>
              <Combobox
                options={regionOptions}
                value={filters.RegionCode}
                onValueChange={(val) => handleInputChange("RegionCode", val)}
                placeholder="Select region..."
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Code</Label>
              <Combobox
                options={unitOptions}
                value={filters.UnitCode}
                onValueChange={(val) => handleInputChange("UnitCode", val)}
                placeholder="Select unit..."
              />
            </div>

            {/* Date Filters */}
            <DatePicker
              label="Start From"
              id="startDate"
              date={parseDate(filters.StartDate)}
              setDate={(date) => handleDateChange("StartDate", date)}
            />
            <DatePicker
              label="End By"
              id="actualEndDate"
              date={parseDate(filters.ActualEndDate)}
              setDate={(date) => handleDateChange("ActualEndDate", date)}
            />
          </div>
          <div className="flex items-center justify-end gap-2 p-4 pt-0">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
