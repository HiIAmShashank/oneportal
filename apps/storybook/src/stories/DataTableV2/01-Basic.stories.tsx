/**
 * DataTable V2 - Basic Stories
 *
 * Tests core functionality: rendering, empty state, loading state
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";

// Sample data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

// Sample data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Viewer",
    status: "Active",
  },
];

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={
            status === "Active"
              ? "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }
        >
          {status}
        </span>
      );
    },
  },
];

const meta = {
  title: "DataTable V2/01-Basic",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default Table**
 *
 * Minimal configuration - just data and columns.
 * All features enabled by default with smart defaults.
 */
export const Default: Story = {
  args: {
    data: sampleUsers,
    columns,
  },
};

/**
 * **Empty State**
 *
 * Shows custom empty state when no data provided.
 */
export const EmptyState: Story = {
  args: {
    data: [],
    columns,
    ui: {
      emptyMessage: "No users found",
    },
  },
};

/**
 * **Loading State**
 *
 * Shows loading spinner with server-side mode.
 */
export const LoadingState: Story = {
  args: {
    data: [],
    columns,
    features: {
      serverSide: {
        enabled: true,
        totalCount: 0,
        loading: true,
      },
    },
    ui: {
      loadingMessage: "Loading users...",
    },
  },
};

/**
 * **Error State**
 *
 * Shows error message with server-side mode.
 */
export const ErrorState: Story = {
  args: {
    data: [],
    columns,
    features: {
      serverSide: {
        enabled: true,
        totalCount: 0,
        loading: false,
        error: new Error("Failed to load users"),
      },
    },
    ui: {
      errorMessage: "Unable to load users",
    },
  },
};

/**
 * **Custom Empty State**
 *
 * Shows custom React component as empty state.
 */
export const CustomEmptyState: Story = {
  args: {
    data: [],
    columns,
    ui: {
      emptyState: (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              className="h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">No users yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first user
            </p>
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Add User
          </button>
        </div>
      ),
    },
  },
};

/**
 * **With Row Click Handler**
 *
 * Clickable rows that log to console.
 */
export const WithRowClick: Story = {
  args: {
    data: sampleUsers,
    columns,
    onRowClick: (row) => {
      // eslint-disable-next-line no-console
      console.log("Row clicked:", row);
      alert(`Clicked on ${row.name}`);
    },
  },
};

/**
 * **With Cell Click Handler**
 *
 * Clickable cells that log to console.
 */
export const WithCellClick: Story = {
  args: {
    data: sampleUsers,
    columns,
    onCellClick: ({ row, columnId, value }) => {
      // eslint-disable-next-line no-console
      console.log("Cell clicked:", { row, columnId, value });
      alert(`Clicked ${columnId}: ${value}`);
    },
  },
};

/**
 * **Compact Density**
 *
 * Smaller padding and font size.
 */
export const CompactDensity: Story = {
  args: {
    data: sampleUsers,
    columns,
    ui: {
      density: "compact",
    },
  },
};

/**
 * **Comfortable Density**
 *
 * Larger padding and font size.
 */
export const ComfortableDensity: Story = {
  args: {
    data: sampleUsers,
    columns,
    ui: {
      density: "comfortable",
    },
  },
};

/**
 * **Bordered Variant**
 *
 * Table with borders around cells.
 */
export const BorderedVariant: Story = {
  args: {
    data: sampleUsers,
    columns,
    ui: {
      variant: "bordered",
    },
  },
};

/**
 * **Striped Variant**
 *
 * Alternating row colors.
 */
export const StripedVariant: Story = {
  args: {
    data: sampleUsers,
    columns,
    ui: {
      variant: "striped",
    },
  },
};

/**
 * **Sticky Header**
 *
 * Header stays fixed while scrolling.
 */
export const StickyHeader: Story = {
  args: {
    data: [
      ...sampleUsers,
      ...sampleUsers,
      ...sampleUsers,
      ...sampleUsers,
      ...sampleUsers,
      ...sampleUsers,
      ...sampleUsers,
    ], // 20 rows
    columns,
    ui: {
      stickyHeader: true,
    },
  },
};

/**
 * **Dark Mode Test**
 *
 * Test table appearance in dark mode.
 * Toggle the theme switcher in Storybook toolbar.
 */
export const DarkMode: Story = {
  args: {
    data: sampleUsers,
    columns,
    ui: {
      variant: "bordered",
    },
  },
  globals: {
    backgrounds: {
      value: "dark",
    },
  },
};
