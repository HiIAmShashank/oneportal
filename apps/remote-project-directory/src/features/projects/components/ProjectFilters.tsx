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
import { DateRangePicker } from "../../../components/ui/date-range-picker";
import { type GetProjectsRequest } from "../../../api/types";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { format, type DateRange } from "@one-portal/ui";

interface ProjectFiltersProps {
  onFilter: (filters: Partial<GetProjectsRequest>) => void;
}

export function ProjectFilters({ onFilter }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Partial<GetProjectsRequest>>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Calculate active filters count
  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof GetProjectsRequest] !== undefined &&
      filters[key as keyof GetProjectsRequest] !== "",
  ).length;

  const handleInputChange = (key: keyof GetProjectsRequest, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setFilters((prev) => ({
      ...prev,
      ProjectStartDate: range?.from
        ? format(range.from, "yyyy-MM-dd")
        : undefined,
      ProjectEndDate: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    }));
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    setDateRange(undefined);
    onFilter({});
  };

  // Placeholder data for dropdowns
  const regionOptions = [
    { value: "NA", label: "North America" },
    { value: "EU", label: "Europe" },
    { value: "APAC", label: "Asia Pacific" },
  ];

  const unitOptions = [
    { value: "IT", label: "Information Technology" },
    { value: "HR", label: "Human Resources" },
    { value: "FIN", label: "Finance" },
  ];

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
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Search by title..."
                value={filters.Title || ""}
                onChange={(e) => handleInputChange("Title", e.target.value)}
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
              <Label htmlFor="projectCode">Project Code</Label>
              <Input
                id="projectCode"
                placeholder="Enter code..."
                value={filters.ProjectCode?.toString() || ""}
                onChange={(e) =>
                  handleInputChange("ProjectCode", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectManager">Project Manager</Label>
              <Input
                id="projectManager"
                placeholder="Search manager..."
                value={filters.ProjectManager || ""}
                onChange={(e) =>
                  handleInputChange("ProjectManager", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectStatus">Status</Label>
              <Input
                id="projectStatus"
                placeholder="Enter status..."
                value={filters.ProjectStatus || ""}
                onChange={(e) =>
                  handleInputChange("ProjectStatus", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Input
                id="division"
                placeholder="Enter division..."
                value={filters.Division || ""}
                onChange={(e) => handleInputChange("Division", e.target.value)}
              />
            </div>

            {/* Comboboxes */}
            <div className="space-y-2">
              <Label>Region</Label>
              <Combobox
                options={regionOptions}
                value={filters.Region}
                onValueChange={(val) => handleInputChange("Region", val)}
                placeholder="Select region..."
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Combobox
                options={unitOptions}
                value={filters.Unit}
                onValueChange={(val) => handleInputChange("Unit", val)}
                placeholder="Select unit..."
              />
            </div>

            {/* Date Range - Spans 2 cols on large screens if needed, or just 1 */}
            <div className="space-y-2 lg:col-span-2">
              <Label>Project Duration</Label>
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateChange}
              />
            </div>
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
