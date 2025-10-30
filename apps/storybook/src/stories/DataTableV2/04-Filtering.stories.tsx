/**
 * DataTable V2 - Filtering Stories
 *
 * Tests smart filtering with auto-detection:
 * - Auto-detects filter types based on data (text, select, number-range, boolean, date)
 * - Global search across all columns
 * - Column-specific filters with appropriate UI (dropdowns, inputs, ranges)
 * - Toolbar with filter controls
 * - Multiple filters combined
 *
 * All filters work together - try combining global search with column filters!
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";

// Sample data type with diverse column types for filter auto-detection
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  experience: number;
  active: boolean;
  hireDate: string;
}

// Generate dataset with variety of data types
const generateEmployees = (count: number): Employee[] => {
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];
  const roles = ["Manager", "Senior", "Mid-Level", "Junior"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    department: faker.helpers.arrayElement(departments),
    role: faker.helpers.arrayElement(roles),
    salary: faker.number.int({ min: 40000, max: 150000 }),
    experience: faker.number.int({ min: 0, max: 20 }),
    active: faker.datatype.boolean(),
    hireDate: faker.date.past({ years: 10 }).toISOString().split("T")[0],
  }));
};

const employees = generateEmployees(50);

// Column definitions - DataTable will auto-detect best filter type
const columns: ColumnDef<Employee>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    size: 80,
    enableColumnFilter: false, // ID doesn't need filtering
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    // Auto-detects: text filter (many unique values)
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    // Auto-detects: text filter
  },
  {
    id: "department",
    accessorKey: "department",
    header: "Department",
    // Auto-detects: select dropdown (few unique values)
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    // Auto-detects: select dropdown (few unique values)
  },
  {
    id: "salary",
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => `$${row.original.salary.toLocaleString()}`,
    // Auto-detects: number-range filter
    filterFn: "numberRange",
  },
  {
    id: "experience",
    accessorKey: "experience",
    header: "Years Exp",
    cell: ({ row }) => `${row.original.experience} yrs`,
    // Auto-detects: select or number-range (depends on unique count)
  },
  {
    id: "active",
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={
          row.original.active
            ? "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        }
      >
        {row.original.active ? "Active" : "Inactive"}
      </span>
    ),
    // Auto-detects: boolean filter (true/false)
    filterFn: "boolean",
  },
  {
    id: "hireDate",
    accessorKey: "hireDate",
    header: "Hire Date",
    // Auto-detects: date-range filter
    filterFn: "dateRange",
  },
];

const meta = {
  title: "DataTable V2/04-Filtering",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default Filtering with Auto-Detection**
 *
 * All filters are automatically detected based on data type!
 *
 * Features visible:
 * - Global search bar at top (searches across all columns)
 * - Column-specific filters below search
 * - "Clear filters" button when filters are active
 *
 * Filter types auto-detected:
 * - **Text inputs**: Name, Email (many unique values)
 * - **Select dropdowns**: Department, Role (few unique values)
 * - **Number range**: Salary (min/max inputs)
 * - **Boolean dropdown**: Status (Active/Inactive)
 * - **Date range**: Hire Date (start/end date pickers)
 *
 * Try:
 * - Type in global search to filter across all columns
 * - Select a department from dropdown
 * - Enter salary range (e.g., min: 50000, max: 100000)
 * - Filter by Active/Inactive status
 * - Combine multiple filters - they all work together!
 */
export const DefaultFiltering: Story = {
  args: {
    data: employees,
    columns,
  },
};

/**
 * **Global Search Only**
 *
 * Show only the global search bar, hide column filters.
 *
 * Perfect for simple search use cases where you want users to search
 * across all columns without complex per-column filtering.
 */
export const GlobalSearchOnly: Story = {
  args: {
    data: employees,
    columns,
    ui: {
      showColumnFilters: false,
    },
  },
};

/**
 * **Column Filters Only**
 *
 * Hide global search, show only column-specific filters.
 *
 * Use this when you want users to filter by specific columns only.
 */
export const ColumnFiltersOnly: Story = {
  args: {
    data: employees,
    columns,
    ui: {
      showGlobalSearch: false,
    },
  },
};

/**
 * **Custom Global Search Placeholder**
 *
 * Customize the placeholder text for the global search input.
 */
export const CustomSearchPlaceholder: Story = {
  args: {
    data: employees,
    columns,
    ui: {
      globalSearchPlaceholder: "Search employees by name, email, department...",
    },
  },
};

/**
 * **Filtering Disabled**
 *
 * Completely disable filtering - no toolbar shown.
 */
export const FilteringDisabled: Story = {
  args: {
    data: employees,
    columns,
    features: {
      filtering: false,
    },
  },
};

/**
 * **Selective Column Filtering**
 *
 * Control which columns have filters using `enableColumnFilter` prop.
 *
 * In this example:
 * - ID column: no filter
 * - Name, Department, Salary: filters enabled
 * - Other columns: filters disabled
 */
export const SelectiveColumnFiltering: Story = {
  args: {
    data: employees,
    columns: columns.map((col) => ({
      ...col,
      enableColumnFilter:
        col.id === "name" ||
        col.id === "department" ||
        col.id === "salary" ||
        col.id === "active",
    })) as ColumnDef<Employee>[],
  },
};

/**
 * **With Sorting and Pagination**
 *
 * All features work together seamlessly!
 *
 * Try:
 * 1. Filter by department = "Engineering"
 * 2. Sort by salary (ascending)
 * 3. Change page size to 20
 * 4. Notice how all features work together
 */
export const WithSortingAndPagination: Story = {
  args: {
    data: employees,
    columns,
    features: {
      sorting: true,
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      filtering: true,
    },
  },
};

/**
 * **Manual Filter Configuration**
 *
 * Override auto-detection by specifying filter type in column meta.
 *
 * Example: Force "experience" to be a select dropdown instead of number-range.
 *
 * This demonstrates a custom filterFn that maps category strings to numeric ranges.
 */
export const ManualFilterConfiguration: Story = {
  args: {
    data: employees,
    columns: columns.map((col) =>
      col.id === "experience"
        ? {
            ...col,
            meta: {
              filterVariant: "select" as const,
              filterOptions: [
                { label: "0-5 years", value: "junior" },
                { label: "5-10 years", value: "mid" },
                { label: "10+ years", value: "senior" },
              ],
            },
            // Custom filter function that maps category values to numeric ranges
            filterFn: (row, columnId, filterValue) => {
              const experience = row.getValue(columnId) as number;
              if (filterValue === "junior")
                return experience >= 0 && experience < 5;
              if (filterValue === "mid")
                return experience >= 5 && experience < 10;
              if (filterValue === "senior") return experience >= 10;
              return true; // No filter selected
            },
          }
        : col,
    ) as ColumnDef<Employee>[],
  },
};

/**
 * **Inline Filter Mode**
 *
 * Show filters directly in column headers instead of toolbar.
 *
 * Features:
 * - Filters appear below each column header
 * - Global search still available in toolbar
 * - Saves vertical space by integrating filters into header row
 * - Perfect for dense data tables where toolbar space is limited
 *
 * Try:
 * - Notice filters appear directly under column names
 * - Global search bar still works at top
 * - All filter types render inline (text, select, number-range, etc.)
 */
export const InlineFilterMode: Story = {
  args: {
    data: employees,
    columns,
    ui: {
      filterMode: "inline", // Key prop - moves filters to column headers
      showToolbar: true, // Still shows toolbar for global search
    },
  },
};

/**
 * **Inline Filters with No Toolbar**
 *
 * Inline filters without any toolbar (no global search).
 *
 * Use this when you want filters integrated into headers and no global search.
 */
export const InlineFiltersNoToolbar: Story = {
  args: {
    data: employees,
    columns,
    ui: {
      filterMode: "inline",
      showToolbar: false, // Hide entire toolbar
    },
  },
};

/**
 * **Multi-Select Filter**
 *
 * Demonstrate multi-select filter with Command/Popover UI.
 *
 * Features:
 * - Select multiple values from dropdown
 * - Searchable options with Command component
 * - Shows "X selected" when items chosen
 * - Checkbox UI with visual feedback
 * - Click to toggle selection on/off
 *
 * In this example:
 * - Department filter allows selecting multiple departments
 * - Role filter also uses multi-select
 * - Try selecting multiple departments to see results filtered by ANY match
 */
export const MultiSelectFilter: Story = {
  args: {
    data: employees,
    columns: columns.map((col) => {
      if (col.id === "department" || col.id === "role") {
        return {
          ...col,
          meta: {
            filterVariant: "multi-select" as const,
            filterOptions:
              col.id === "department"
                ? [
                    { label: "Engineering", value: "Engineering" },
                    { label: "Marketing", value: "Marketing" },
                    { label: "Sales", value: "Sales" },
                    { label: "HR", value: "HR" },
                    { label: "Finance", value: "Finance" },
                  ]
                : [
                    { label: "Manager", value: "Manager" },
                    { label: "Senior", value: "Senior" },
                    { label: "Mid-Level", value: "Mid-Level" },
                    { label: "Junior", value: "Junior" },
                  ],
          },
          filterFn: "multiSelect",
        };
      }
      return col;
    }) as ColumnDef<Employee>[],
  },
};

/**
 * **Multi-Select with Custom Placeholder**
 *
 * Multi-select filter with custom placeholder text.
 */
export const MultiSelectWithPlaceholder: Story = {
  args: {
    data: employees,
    columns: columns.map((col) => {
      if (col.id === "department") {
        return {
          ...col,
          meta: {
            filterVariant: "multi-select" as const,
            filterOptions: [
              { label: "Engineering", value: "Engineering" },
              { label: "Marketing", value: "Marketing" },
              { label: "Sales", value: "Sales" },
              { label: "HR", value: "HR" },
              { label: "Finance", value: "Finance" },
            ],
            filterPlaceholder: "Choose departments to filter...",
          },
          filterFn: "multiSelect",
        };
      }
      return col;
    }) as ColumnDef<Employee>[],
  },
};

/**
 * **Empty Search Results**
 *
 * Test filtering with no matches.
 *
 * Try: Search for "xyz" or filter by impossible criteria to see empty state.
 */
export const EmptySearchResults: Story = {
  args: {
    data: employees,
    columns,
    ui: {
      emptyMessage: "No employees match your filters",
    },
  },
};
