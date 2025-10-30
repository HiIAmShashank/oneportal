/**
 * DataTable V2 - Selection & Actions Stories
 *
 * Tests row selection and action features:
 * - Single row selection (radio mode)
 * - Multiple row selection (checkbox mode)
 * - Conditional selection (getCanSelect)
 * - Row actions (per-row dropdown menu)
 * - Bulk actions (operations on selected rows)
 * - Min/max selection constraints
 * - Controlled selection state
 *
 * All features work with sorting, filtering, and pagination!
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DataTable,
  type ColumnDef,
  type RowAction,
  type BulkAction,
} from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";
import { Edit, Trash2, Copy, Eye, Download, Mail } from "lucide-react";
import { useState } from "react";

// Sample data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  department: string;
  canDelete: boolean; // For conditional selection demo
}

// Generate users dataset
const generateUsers = (count: number): User[] => {
  const roles = ["Admin", "Manager", "Developer", "Designer", "Analyst"];
  const statuses: ("active" | "inactive" | "pending")[] = [
    "active",
    "inactive",
    "pending",
  ];
  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(roles),
    status: faker.helpers.arrayElement(statuses),
    department: faker.helpers.arrayElement(departments),
    canDelete: faker.datatype.boolean(0.7), // 70% can be deleted
  }));
};

const users = generateUsers(50);

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
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
      const colorMap = {
        active:
          "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        inactive:
          "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        pending:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorMap[status]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "department",
    accessorKey: "department",
    header: "Department",
  },
];

const meta = {
  title: "DataTable V2/05-Selection-And-Actions",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Multiple Row Selection (Checkbox)**
 *
 * Default selection mode with checkboxes.
 *
 * Features:
 * - Checkbox column on the left
 * - Select all checkbox in header
 * - Select individual rows
 * - Indeterminate state when some rows selected
 * - Selection persists across pagination
 *
 * Try:
 * - Click header checkbox to select all on current page
 * - Select individual rows
 * - Navigate to next page - selection is maintained
 * - Sort or filter - selection is maintained
 */
export const MultipleRowSelection: Story = {
  args: {
    data: users,
    columns,
    features: {
      selection: {
        mode: "multiple",
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Single Row Selection (Radio)**
 *
 * Radio button mode - only one row can be selected at a time.
 *
 * Features:
 * - Checkbox column but no header checkbox
 * - Selecting a row deselects others
 * - Perfect for "pick one" scenarios
 *
 * Try:
 * - Click a row's checkbox
 * - Click another row - first one gets deselected
 * - Selection is exclusive across all pages
 */
export const SingleRowSelection: Story = {
  args: {
    data: users,
    columns,
    features: {
      selection: {
        mode: "single",
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Conditional Selection (getCanSelect)**
 *
 * Some rows cannot be selected based on data conditions.
 *
 * In this example:
 * - Only users with `canDelete: true` can be selected
 * - Disabled checkboxes are grayed out
 * - "Select all" only selects selectable rows
 *
 * Use case: Prevent selection of protected records (admins, system users, etc.)
 *
 * Try:
 * - Notice some checkboxes are disabled
 * - Click "Select all" - only enabled rows get selected
 * - Disabled rows cannot be selected
 */
export const ConditionalSelection: Story = {
  args: {
    data: users,
    columns: [
      ...columns,
      {
        id: "canDelete",
        accessorKey: "canDelete",
        header: "Can Delete",
        cell: ({ row }) => (
          <span
            className={
              row.original.canDelete ? "text-green-600" : "text-red-600"
            }
          >
            {row.original.canDelete ? "Yes" : "No"}
          </span>
        ),
      },
    ] as ColumnDef<User>[],
    features: {
      selection: {
        mode: "multiple",
        getCanSelect: (row) => row.canDelete, // Only selectable if canDelete is true
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Selection with onChange Callback**
 *
 * Get notified when selection changes and access selected rows.
 *
 * This story logs selected rows to console.
 *
 * Features:
 * - onChange callback receives array of selected row data
 * - Fires when selection changes
 * - Access full row objects, not just IDs
 *
 * Try:
 * - Select rows and check browser console
 * - See selected user objects logged
 */
export const SelectionWithCallback: Story = {
  args: {
    data: users,
    columns,
    features: {
      selection: {
        mode: "multiple",
        onChange: (selectedRows) => {
          console.info("Selected rows:", selectedRows);
          console.info(`${selectedRows.length} row(s) selected`);
        },
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Row Actions (Dropdown Menu)**
 *
 * Add a dropdown menu to each row with contextual actions.
 *
 * Features:
 * - "Actions" column with three-dot menu
 * - Edit, View, Copy, Delete actions
 * - Delete action is disabled for active users
 * - Delete action is destructive (red text, separated)
 * - Icons for visual clarity
 *
 * Try:
 * - Click the three-dot menu on any row
 * - Notice Edit and View actions
 * - Delete is disabled for active users
 * - Delete appears separated with red text
 */
export const RowActions: Story = {
  args: {
    data: users,
    columns,
    actions: {
      row: [
        {
          id: "edit",
          label: "Edit",
          icon: <Edit className="h-4 w-4" />,
          onClick: (row) => {
            console.info("Edit user:", row);
            alert(`Editing ${row.name}`);
          },
        },
        {
          id: "view",
          label: "View Details",
          icon: <Eye className="h-4 w-4" />,
          onClick: (row) => {
            console.info("View user:", row);
            alert(`Viewing ${row.name}`);
          },
        },
        {
          id: "copy",
          label: "Copy Email",
          icon: <Copy className="h-4 w-4" />,
          onClick: (row) => {
            navigator.clipboard.writeText(row.email);
            alert(`Copied: ${row.email}`);
          },
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          disabled: (row) => row.status === "active", // Can't delete active users
          onClick: (row) => {
            console.info("Delete user:", row);
            if (confirm(`Delete ${row.name}?`)) {
              alert(`User ${row.name} deleted`);
            }
          },
        },
      ] as RowAction<User>[],
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Bulk Actions (Operations on Selected Rows)**
 *
 * Perform actions on multiple selected rows at once.
 *
 * Features:
 * - Bulk action bar appears when rows selected
 * - Shows count of selected rows
 * - Export, Email, Activate, Delete actions
 * - Delete requires at least 1 selection
 * - Email limited to max 10 selections
 *
 * Try:
 * - Select multiple rows
 * - Notice bulk action bar appears above table
 * - Click "Export Selected" to download data
 * - Try "Send Email" - disabled if more than 10 selected
 * - Delete action confirms before proceeding
 */
export const BulkActions: Story = {
  args: {
    data: users,
    columns,
    features: {
      selection: {
        mode: "multiple",
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
    actions: {
      bulk: [
        {
          id: "export",
          label: "Export Selected",
          icon: <Download className="h-4 w-4" />,
          onClick: (rows) => {
            console.info("Exporting rows:", rows);
            const data = JSON.stringify(rows, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `users-export-${Date.now()}.json`;
            a.click();
            alert(`Exported ${rows.length} users`);
          },
        },
        {
          id: "email",
          label: "Send Email",
          icon: <Mail className="h-4 w-4" />,
          maxSelection: 10, // Limit to 10 recipients
          onClick: (rows) => {
            console.info("Emailing rows:", rows);
            const emails = rows.map((r) => r.email).join(", ");
            alert(`Sending email to: ${emails}`);
          },
        },
        {
          id: "activate",
          label: "Activate Selected",
          onClick: (rows) => {
            console.info("Activating rows:", rows);
            alert(`Activated ${rows.length} users`);
          },
        },
        {
          id: "delete",
          label: "Delete Selected",
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          minSelection: 1,
          onClick: (rows) => {
            console.info("Deleting rows:", rows);
            if (confirm(`Delete ${rows.length} users?`)) {
              alert(`Deleted ${rows.length} users`);
            }
          },
        },
      ] as BulkAction<User>[],
    },
  },
};

/**
 * **Selection with Row Actions and Bulk Actions**
 *
 * Combine all action types in one table.
 *
 * Features:
 * - Row selection with checkboxes
 * - Per-row actions dropdown
 * - Bulk actions bar when rows selected
 * - All features work together seamlessly
 *
 * Try:
 * - Select rows and use bulk actions
 * - Use per-row actions from dropdown
 * - Notice both action types are available
 * - Selection state is shared between them
 */
export const SelectionWithAllActions: Story = {
  args: {
    data: users,
    columns,
    features: {
      selection: {
        mode: "multiple",
        onChange: (rows) => console.info("Selected:", rows),
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: true,
      filtering: true,
    },
    actions: {
      row: [
        {
          id: "edit",
          label: "Edit",
          icon: <Edit className="h-4 w-4" />,
          onClick: (row) => alert(`Editing ${row.name}`),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: (row) => {
            if (confirm(`Delete ${row.name}?`)) {
              alert(`Deleted ${row.name}`);
            }
          },
        },
      ] as RowAction<User>[],
      bulk: [
        {
          id: "export",
          label: "Export",
          icon: <Download className="h-4 w-4" />,
          onClick: (rows) => alert(`Exporting ${rows.length} users`),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: (rows) => {
            if (confirm(`Delete ${rows.length} users?`)) {
              alert(`Deleted ${rows.length} users`);
            }
          },
        },
      ] as BulkAction<User>[],
    },
  },
};

/**
 * **Controlled Selection State**
 *
 * Control selection state from parent component.
 *
 * This allows:
 * - Programmatic selection control
 * - Selection persistence outside table
 * - Syncing selection with external state
 *
 * Try:
 * - Select rows normally
 * - Notice selection is controlled by parent
 * - External state changes reflect in table
 */
export const ControlledSelection: Story = {
  render: () => {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
      {},
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRowSelection({ "0": true, "1": true, "2": true })}
            className="rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Select First 3
          </button>
          <button
            onClick={() => setRowSelection({})}
            className="rounded-sm bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Clear Selection
          </button>
          <span className="text-sm text-muted-foreground">
            Selected: {Object.keys(rowSelection).length} rows
          </span>
        </div>

        <DataTable
          data={users}
          columns={columns}
          features={{
            selection: {
              mode: "multiple",
            },
            pagination: {
              enabled: true,
              pageSize: 10,
            },
          }}
          state={{
            rowSelection,
          }}
          onStateChange={(state) => {
            if (state.rowSelection !== undefined) {
              setRowSelection(state.rowSelection);
            }
          }}
        />
      </div>
    );
  },
};

/**
 * **Conditional Row Actions (Dynamic Visibility)**
 *
 * Show/hide row actions based on row data.
 *
 * In this example:
 * - "Activate" only shown for inactive users
 * - "Deactivate" only shown for active users
 * - "Delete" hidden for Admin role
 * - Actions adapt to each row's data
 *
 * Try:
 * - Open dropdown for different rows
 * - Notice different actions available
 * - Admin users don't have Delete option
 * - Active/Inactive users have different actions
 */
export const ConditionalRowActions: Story = {
  args: {
    data: users,
    columns,
    actions: {
      row: [
        {
          id: "edit",
          label: "Edit",
          icon: <Edit className="h-4 w-4" />,
          onClick: (row) => alert(`Editing ${row.name}`),
        },
        {
          id: "activate",
          label: "Activate",
          hidden: (row) => row.status === "active", // Hide if already active
          onClick: (row) => alert(`Activating ${row.name}`),
        },
        {
          id: "deactivate",
          label: "Deactivate",
          hidden: (row) => row.status !== "active", // Hide if not active
          onClick: (row) => alert(`Deactivating ${row.name}`),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          hidden: (row) => row.role === "Admin", // Can't delete admins
          onClick: (row) => {
            if (confirm(`Delete ${row.name}?`)) {
              alert(`Deleted ${row.name}`);
            }
          },
        },
      ] as RowAction<User>[],
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Bulk Actions with Constraints**
 *
 * Demonstrate min/max selection constraints on bulk actions.
 *
 * Constraints:
 * - "Send Email": max 5 selections (email quota)
 * - "Compare": requires exactly 2-3 selections
 * - "Archive": minimum 1 selection
 * - Actions auto-disable when constraints not met
 *
 * Try:
 * - Select 1 row - only Archive enabled
 * - Select 2-3 rows - all actions enabled
 * - Select 6+ rows - Send Email disabled
 * - Notice how buttons disable based on count
 */
export const BulkActionsWithConstraints: Story = {
  args: {
    data: users,
    columns,
    features: {
      selection: {
        mode: "multiple",
      },
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
    actions: {
      bulk: [
        {
          id: "email",
          label: "Send Email",
          icon: <Mail className="h-4 w-4" />,
          maxSelection: 5,
          onClick: (rows) => alert(`Emailing ${rows.length} users`),
        },
        {
          id: "compare",
          label: "Compare",
          minSelection: 2,
          maxSelection: 3,
          onClick: (rows) => alert(`Comparing ${rows.length} users`),
        },
        {
          id: "archive",
          label: "Archive",
          minSelection: 1,
          onClick: (rows) => alert(`Archiving ${rows.length} users`),
        },
      ] as BulkAction<User>[],
    },
  },
};
