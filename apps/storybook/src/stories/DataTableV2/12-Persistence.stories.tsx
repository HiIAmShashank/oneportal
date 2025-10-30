/**
 * DataTable V2 - Persistence Stories
 *
 * Comprehensive demonstration of localStorage persistence:
 * - Column visibility, sizing, pinning, order
 * - Sorting and filters
 * - Density settings
 * - Include/exclude options
 * - Manual persistence control
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { RefreshCw } from "lucide-react";

// Sample data type
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  startDate: string;
  status: "Active" | "On Leave" | "Inactive";
}

// Sample data
const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    role: "Senior Developer",
    salary: 120000,
    startDate: "2020-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Marketing",
    role: "Marketing Manager",
    salary: 90000,
    startDate: "2019-03-20",
    status: "Active",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    department: "Engineering",
    role: "Tech Lead",
    salary: 140000,
    startDate: "2018-07-10",
    status: "Active",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    department: "Sales",
    role: "Sales Representative",
    salary: 75000,
    startDate: "2021-02-01",
    status: "On Leave",
  },
  {
    id: "5",
    name: "Eve Davis",
    email: "eve@example.com",
    department: "HR",
    role: "HR Manager",
    salary: 95000,
    startDate: "2020-11-12",
    status: "Active",
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank@example.com",
    department: "Engineering",
    role: "Junior Developer",
    salary: 70000,
    startDate: "2022-01-05",
    status: "Active",
  },
  {
    id: "7",
    name: "Grace Wilson",
    email: "grace@example.com",
    department: "Marketing",
    role: "Content Writer",
    salary: 60000,
    startDate: "2021-09-15",
    status: "Active",
  },
  {
    id: "8",
    name: "Henry Moore",
    email: "henry@example.com",
    department: "Sales",
    role: "Sales Manager",
    salary: 105000,
    startDate: "2019-05-20",
    status: "Inactive",
  },
];

// Column definitions
const columns: ColumnDef<Employee>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    size: 150,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    size: 200,
  },
  {
    id: "department",
    accessorKey: "department",
    header: "Department",
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    size: 180,
  },
  {
    id: "salary",
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => `$${row.original.salary.toLocaleString()}`,
  },
  {
    id: "startDate",
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const colors = {
        Active: "text-green-600 dark:text-green-400",
        "On Leave": "text-yellow-600 dark:text-yellow-400",
        Inactive: "text-red-600 dark:text-red-400",
      };
      return <span className={colors[status]}>{status}</span>;
    },
  },
];

const meta = {
  title: "DataTable V2/12-Persistence",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Full Persistence**
 *
 * All table state persists to localStorage automatically.
 * Try the following, then reload the page:
 * - Hide/show columns via View menu
 * - Resize columns by dragging column edges
 * - Reorder columns by dragging headers
 * - Pin columns left/right
 * - Sort columns
 * - Apply filters
 * - Change density (compact/default/comfortable)
 *
 * All changes will be preserved after page reload!
 */
export const FullPersistence: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-yellow-500/50 bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          <strong>Try this:</strong> Make changes to the table (hide columns,
          resize, sort, filter, change density), then reload the page. Your
          changes will be saved!
        </p>
      </div>
      <DataTable
        data={sampleEmployees}
        columns={columns}
        features={{
          sorting: true,
          filtering: true,
          pagination: true,
          columns: {
            visibility: true,
            resizing: true,
            reordering: true,
            pinning: true,
          },
        }}
        persistence={{
          key: "employees-table-full",
          enabled: true,
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Make changes to the table state and reload the page. All state is automatically persisted to localStorage using the key `oneportal:datatable:employees-table-full:*`.",
      },
    },
  },
};

/**
 * **Persist Only Column State**
 *
 * Only column-related state persists (visibility, sizing, pinning, order).
 * Sorting and filters are NOT persisted.
 */
export const ColumnStateOnly: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-500/50 bg-blue-50 p-4 dark:bg-blue-900/20">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Only column preferences are saved. Sorting and filters reset on
          reload.
        </p>
      </div>
      <DataTable
        data={sampleEmployees}
        columns={columns}
        features={{
          sorting: true,
          filtering: true,
          pagination: true,
          columns: {
            visibility: true,
            resizing: true,
            reordering: true,
            pinning: true,
          },
        }}
        persistence={{
          key: "employees-table-columns",
          enabled: true,
          include: ["visibility", "sizing", "pinning", "order"],
        }}
      />
    </div>
  ),
};

/**
 * **Persist Everything Except Filters**
 *
 * All state persists except filters.
 * Useful when you want fresh data on each page load but preserve UI preferences.
 */
export const ExcludeFilters: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-purple-500/50 bg-purple-50 p-4 dark:bg-purple-900/20">
        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
          All preferences saved except filters. Filters reset on reload.
        </p>
      </div>
      <DataTable
        data={sampleEmployees}
        columns={columns}
        features={{
          sorting: true,
          filtering: true,
          pagination: true,
          columns: {
            visibility: true,
            resizing: true,
            reordering: true,
            pinning: true,
          },
        }}
        persistence={{
          key: "employees-table-no-filters",
          enabled: true,
          exclude: ["filters"],
        }}
      />
    </div>
  ),
};

/**
 * **Persist Density Only**
 *
 * Only the density setting persists.
 * Useful for maintaining consistent UI density across sessions.
 */
export const DensityOnly: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-green-500/50 bg-green-50 p-4 dark:bg-green-900/20">
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          Change density via the View menu. Only density preference is saved.
        </p>
      </div>
      <DataTable
        data={sampleEmployees}
        columns={columns}
        features={{
          sorting: true,
          filtering: true,
          pagination: true,
          columns: {
            visibility: true,
            resizing: true,
            reordering: true,
            pinning: true,
          },
        }}
        persistence={{
          key: "employees-table-density",
          enabled: true,
          include: ["density"],
        }}
      />
    </div>
  ),
};

/**
 * **No Persistence**
 *
 * Persistence is disabled. All changes reset on page reload.
 */
export const NoPersistence: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="rounded-md border border-gray-500/50 bg-gray-50 p-4 dark:bg-gray-900/20">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          No state is saved. All changes reset on page reload.
        </p>
      </div>
      <DataTable
        data={sampleEmployees}
        columns={columns}
        features={{
          sorting: true,
          filtering: true,
          pagination: true,
          columns: {
            visibility: true,
            resizing: true,
            reordering: true,
            pinning: true,
          },
        }}
        persistence={{
          key: "employees-table-none",
          enabled: false,
        }}
      />
    </div>
  ),
};

/**
 * **Manual Persistence Control**
 *
 * Provides a "Reset Preferences" button to clear persisted state.
 * Useful for letting users reset their customizations.
 */
export const ManualControl: Story = {
  render: () => {
    const handleResetPreferences = () => {
      // Clear all persisted state for this table
      const keys = [
        "visibility",
        "sizing",
        "pinning",
        "order",
        "sorting",
        "filters",
        "density",
        "grouping",
      ];

      keys.forEach((key) => {
        localStorage.removeItem(
          `oneportal:datatable:employees-table-manual:${key}`,
        );
      });

      // Reload page to apply reset
      window.location.reload();
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-4">
          <div>
            <p className="text-sm font-medium">Manage your table preferences</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Make changes to the table, then click Reset to clear all saved
              preferences
            </p>
          </div>
          <button
            onClick={handleResetPreferences}
            className="flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Preferences
          </button>
        </div>

        <DataTable
          data={sampleEmployees}
          columns={columns}
          features={{
            sorting: true,
            filtering: true,
            pagination: true,
            columns: {
              visibility: true,
              resizing: true,
              reordering: true,
              pinning: true,
            },
          }}
          persistence={{
            key: "employees-table-manual",
            enabled: true,
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates manual control over persisted state. The Reset button clears all saved preferences and reloads the page.",
      },
    },
  },
};

/**
 * **Multiple Tables with Different Keys**
 *
 * Shows two tables with separate persistence keys.
 * Each table maintains its own state independently.
 */
export const MultipleTables: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Engineering Team</h3>
        <DataTable
          data={sampleEmployees.filter(
            (emp) => emp.department === "Engineering",
          )}
          columns={columns}
          features={{
            sorting: true,
            filtering: true,
            pagination: true,
            columns: {
              visibility: true,
              resizing: true,
              pinning: true,
            },
          }}
          persistence={{
            key: "employees-engineering",
            enabled: true,
          }}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sales Team</h3>
        <DataTable
          data={sampleEmployees.filter((emp) => emp.department === "Sales")}
          columns={columns}
          features={{
            sorting: true,
            filtering: true,
            pagination: true,
            columns: {
              visibility: true,
              resizing: true,
              pinning: true,
            },
          }}
          persistence={{
            key: "employees-sales",
            enabled: true,
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Two tables with different persistence keys. Each table saves its state independently. Try customizing each table differently and reloading.",
      },
    },
  },
};
