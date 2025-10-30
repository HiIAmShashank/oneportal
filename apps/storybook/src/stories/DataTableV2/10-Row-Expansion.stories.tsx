/**
 * DataTable V2 - Row Expansion Stories
 *
 * Demonstrates row expansion features:
 * - Sub-rows expansion (hierarchical data)
 * - Custom detail panel expansion
 * - Expand all/collapse all functionality
 * - Mixed expansion with other features
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";

const meta: Meta<typeof DataTable> = {
  title: "DataTable V2/10-Row Expansion",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// Sample data type with sub-rows
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  salary: number;
  email: string;
  phone: string;
  hireDate: string;
  subRows?: Employee[];
}

// Generate hierarchical employee data
const employeeData: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "CEO",
    department: "Executive",
    salary: 250000,
    email: "alice.johnson@company.com",
    phone: "(555) 001-0001",
    hireDate: "2015-01-15",
    subRows: [
      {
        id: 2,
        name: "Bob Smith",
        role: "VP of Engineering",
        department: "Engineering",
        salary: 180000,
        email: "bob.smith@company.com",
        phone: "(555) 001-0002",
        hireDate: "2016-03-20",
        subRows: [
          {
            id: 3,
            name: "Charlie Brown",
            role: "Senior Engineer",
            department: "Engineering",
            salary: 120000,
            email: "charlie.brown@company.com",
            phone: "(555) 001-0003",
            hireDate: "2018-06-10",
          },
          {
            id: 4,
            name: "Diana Prince",
            role: "Senior Engineer",
            department: "Engineering",
            salary: 125000,
            email: "diana.prince@company.com",
            phone: "(555) 001-0004",
            hireDate: "2017-11-05",
          },
        ],
      },
      {
        id: 5,
        name: "Eve Davis",
        role: "VP of Sales",
        department: "Sales",
        salary: 170000,
        email: "eve.davis@company.com",
        phone: "(555) 001-0005",
        hireDate: "2016-08-12",
        subRows: [
          {
            id: 6,
            name: "Frank Miller",
            role: "Sales Manager",
            department: "Sales",
            salary: 95000,
            email: "frank.miller@company.com",
            phone: "(555) 001-0006",
            hireDate: "2019-02-14",
          },
          {
            id: 7,
            name: "Grace Lee",
            role: "Sales Manager",
            department: "Sales",
            salary: 98000,
            email: "grace.lee@company.com",
            phone: "(555) 001-0007",
            hireDate: "2018-09-21",
          },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Henry Wilson",
    role: "CFO",
    department: "Finance",
    salary: 220000,
    email: "henry.wilson@company.com",
    phone: "(555) 001-0008",
    hireDate: "2015-05-10",
    subRows: [
      {
        id: 9,
        name: "Iris Chen",
        role: "Accountant",
        department: "Finance",
        salary: 75000,
        email: "iris.chen@company.com",
        phone: "(555) 001-0009",
        hireDate: "2020-01-08",
      },
      {
        id: 10,
        name: "Jack Thompson",
        role: "Financial Analyst",
        department: "Finance",
        salary: 80000,
        email: "jack.thompson@company.com",
        phone: "(555) 001-0010",
        hireDate: "2019-07-15",
      },
    ],
  },
];

/**
 * Basic Sub-Rows Expansion
 *
 * Demonstrates hierarchical data with sub-rows:
 * - Click the expand icon to reveal sub-rows
 * - Sub-rows are indented automatically
 * - Uses getSubRows to specify nested data
 * - Click header expand button to toggle all rows
 */
export const BasicSubRows: Story = {
  args: {
    data: employeeData,
    columns: [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        size: 180,
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        size: 130,
      },
      {
        id: "salary",
        accessorKey: "salary",
        header: "Salary",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.salary.toLocaleString()}
          </span>
        ),
      },
    ] as ColumnDef<Employee>[],
    features: {
      expanding: {
        enabled: true,
        showExpandColumn: true,
        getSubRows: (row: Employee) => row.subRows,
      },
    },
  },
};

/**
 * Custom Detail Panel
 *
 * Demonstrates custom expandable content:
 * - Rows expand to show custom detail panel
 * - Detail panel displays additional row information
 * - Uses renderExpandedRow for custom content
 * - All rows can be expanded (no sub-rows required)
 */
export const CustomDetailPanel: Story = {
  args: {
    data: employeeData.flatMap((emp) => [
      emp,
      ...(emp.subRows?.flatMap((sub) => [sub, ...(sub.subRows || [])]) || []),
    ]),
    columns: [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        size: 180,
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        size: 130,
      },
      {
        id: "salary",
        accessorKey: "salary",
        header: "Salary",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.salary.toLocaleString()}
          </span>
        ),
      },
    ] as ColumnDef<Employee>[],
    features: {
      expanding: {
        enabled: true,
        showExpandColumn: true,
        getCanExpand: () => true, // All rows can expand
        renderExpandedRow: ({ row }: { row: Employee }) => (
          <div className="p-4 space-y-3 bg-muted/20 dark:bg-muted/10 rounded-sm">
            <h4 className="font-semibold text-sm">Employee Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Email:
                </span>
                <br />
                <span className="font-mono">{row.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Phone:
                </span>
                <br />
                <span className="font-mono">{row.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Hire Date:
                </span>
                <br />
                <span>{new Date(row.hireDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Employee ID:
                </span>
                <br />
                <span className="font-mono">
                  #{row.id.toString().padStart(5, "0")}
                </span>
              </div>
            </div>
          </div>
        ),
      },
    },
  },
};

/**
 * Expansion with Sorting and Filtering
 *
 * Demonstrates expansion combined with other features:
 * - Sub-rows expansion
 * - Sorting by any column
 * - Global search filtering
 * - Expanded state persists during sort/filter
 */
export const ExpansionWithFeatures: Story = {
  args: {
    data: employeeData,
    columns: [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        size: 180,
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        size: 130,
        enableColumnFilter: true,
      },
      {
        id: "salary",
        accessorKey: "salary",
        header: "Salary",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.salary.toLocaleString()}
          </span>
        ),
      },
    ] as ColumnDef<Employee>[],
    features: {
      sorting: true,
      filtering: true,
      expanding: {
        enabled: true,
        showExpandColumn: true,
        getSubRows: (row: Employee) => row.subRows,
      },
    },
  },
};

/**
 * Expansion with Selection
 *
 * Demonstrates expansion with row selection:
 * - Sub-rows expansion
 * - Row selection with checkboxes
 * - Parent selection selects all sub-rows
 * - Sub-row selection updates parent state
 */
export const ExpansionWithSelection: Story = {
  args: {
    data: employeeData,
    columns: [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        size: 180,
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        size: 130,
      },
      {
        id: "salary",
        accessorKey: "salary",
        header: "Salary",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.salary.toLocaleString()}
          </span>
        ),
      },
    ] as ColumnDef<Employee>[],
    features: {
      selection: {
        mode: "multiple",
      },
      expanding: {
        enabled: true,
        showExpandColumn: true,
        getSubRows: (row: Employee) => row.subRows,
      },
    },
  },
};
