/**
 * Reusable column definitions for DataTable stories
 * Includes custom renderers, filters, and formatting
 */

import type { ColumnDef } from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@one-portal/ui";
import type {
  User,
  Order,
  Product,
  Transaction,
  Task,
} from "./data-generators";

// =============================================================================
// USER COLUMNS
// =============================================================================

export const userColumns: ColumnDef<User>[] = [
  {
    id: "avatar",
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => (
      <Avatar className="h-8 w-8">
        <AvatarImage src={row.original.avatar} alt={row.original.name} />
        <AvatarFallback>
          {row.original.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
    enableFiltering: false,
    enableResizing: false,
    size: 60,
    minSize: 60,
    maxSize: 60,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    size: 200,
    minSize: 150,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    size: 250,
    minSize: 200,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
    editType: "email",
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    size: 120,
    cell: ({ row }) => {
      const roleColors = {
        Admin: "destructive",
        Editor: "default",
        Viewer: "secondary",
      } as const;

      return (
        <Badge variant={roleColors[row.original.role]}>
          {row.original.role}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "Admin", value: "Admin" },
        { label: "Editor", value: "Editor" },
        { label: "Viewer", value: "Viewer" },
      ],
    },
    editable: true,
    editType: "select",
    editOptions: ["Admin", "Editor", "Viewer"],
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const statusColors = {
        Active: "default",
        Inactive: "secondary",
        Pending: "outline",
      } as const;

      return (
        <Badge variant={statusColors[row.original.status]}>
          {row.original.status}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Pending", value: "Pending" },
      ],
    },
  },
  {
    id: "department",
    accessorKey: "department",
    header: "Department",
    size: 150,
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: "lastLogin",
    accessorKey: "lastLogin",
    header: "Last Login",
    size: 180,
    cell: ({ row }) => {
      return new Date(row.original.lastLogin).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    enableSorting: true,
    enableFiltering: false,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    size: 150,
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    enableSorting: true,
    enableFiltering: false,
  },
];

// =============================================================================
// ORDER COLUMNS
// =============================================================================

export const orderColumns: ColumnDef<Order>[] = [
  {
    id: "orderNumber",
    accessorKey: "orderNumber",
    header: "Order #",
    size: 140,
    enableSorting: true,
    enableFiltering: true,
    cell: ({ row }) => (
      <span className="font-mono font-medium">{row.original.orderNumber}</span>
    ),
  },
  {
    id: "customer",
    accessorKey: "customer",
    header: "Customer",
    size: 200,
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    size: 220,
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    size: 140,
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.original.amount);
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "number-range",
    },
    aggregationFn: "sum",
    aggregatedCell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span className="font-bold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)}
        </span>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ row }) => {
      const statusColors = {
        Pending: "outline",
        Processing: "default",
        Shipped: "default",
        Delivered: "default",
        Cancelled: "destructive",
      } as const;

      return (
        <Badge variant={statusColors[row.original.status]}>
          {row.original.status}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "multi-select",
      filterOptions: [
        { label: "Pending", value: "Pending" },
        { label: "Processing", value: "Processing" },
        { label: "Shipped", value: "Shipped" },
        { label: "Delivered", value: "Delivered" },
        { label: "Cancelled", value: "Cancelled" },
      ],
    },
  },
  {
    id: "items",
    accessorKey: "items",
    header: "Items",
    size: 100,
    enableSorting: true,
    enableFiltering: true,
    aggregationFn: "sum",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Order Date",
    size: 160,
    cell: ({ row }) => {
      return new Date(row.original.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "date-range",
    },
  },
];

// =============================================================================
// PRODUCT COLUMNS
// =============================================================================

export const productColumns: ColumnDef<Product>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Product Name",
    size: 250,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
  },
  {
    id: "sku",
    accessorKey: "sku",
    header: "SKU",
    size: 140,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.sku}</span>
    ),
    enableSorting: true,
    enableFiltering: true,
    editable: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    size: 150,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
    editType: "text",
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    size: 120,
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.original.price);
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "number-range",
    },
    editable: true,
    editType: "number",
    editProps: { min: 0, step: 0.01 },
  },
  {
    id: "stock",
    accessorKey: "stock",
    header: "Stock",
    size: 100,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
    editType: "number",
    editProps: { min: 0 },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 130,
    cell: ({ row }) => {
      const statusColors = {
        "In Stock": "default",
        "Low Stock": "outline",
        "Out of Stock": "destructive",
      } as const;

      return (
        <Badge variant={statusColors[row.original.status]}>
          {row.original.status}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "In Stock", value: "In Stock" },
        { label: "Low Stock", value: "Low Stock" },
        { label: "Out of Stock", value: "Out of Stock" },
      ],
    },
  },
  {
    id: "supplier",
    accessorKey: "supplier",
    header: "Supplier",
    size: 200,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
  },
  {
    id: "lastRestocked",
    accessorKey: "lastRestocked",
    header: "Last Restocked",
    size: 160,
    cell: ({ row }) => {
      return new Date(row.original.lastRestocked).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    enableSorting: true,
  },
];

// =============================================================================
// TRANSACTION COLUMNS
// =============================================================================

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    size: 160,
    cell: ({ row }) => {
      return new Date(row.original.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    enableSorting: true,
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: "Reference",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.reference}</span>
    ),
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    size: 300,
    enableSorting: false,
    enableFiltering: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    size: 150,
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    size: 100,
    cell: ({ row }) => {
      const typeColors = {
        Credit: "default",
        Debit: "secondary",
      } as const;

      return (
        <Badge variant={typeColors[row.original.type]}>
          {row.original.type}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "Credit", value: "Credit" },
        { label: "Debit", value: "Debit" },
      ],
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    size: 140,
    cell: ({ row }) => {
      const isCredit = row.original.type === "Credit";
      return (
        <span
          className={
            isCredit ? "text-green-600 font-medium" : "text-red-600 font-medium"
          }
        >
          {isCredit ? "+" : "-"}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.amount)}
        </span>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "number-range",
    },
  },
  {
    id: "balance",
    accessorKey: "balance",
    header: "Balance",
    size: 140,
    cell: ({ row }) => {
      return (
        <span className="font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.balance)}
        </span>
      );
    },
    enableSorting: true,
  },
];

// =============================================================================
// TASK COLUMNS
// =============================================================================

export const taskColumns: ColumnDef<Task>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Task",
    size: 300,
    enableSorting: true,
    enableFiltering: true,
    editable: true,
  },
  {
    id: "assignee",
    accessorKey: "assignee",
    header: "Assignee",
    size: 180,
    enableSorting: true,
    enableFiltering: true,
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: "Priority",
    size: 120,
    cell: ({ row }) => {
      const priorityColors = {
        Low: "secondary",
        Medium: "outline",
        High: "default",
        Critical: "destructive",
      } as const;

      return (
        <Badge variant={priorityColors[row.original.priority]}>
          {row.original.priority}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "Critical", value: "Critical" },
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" },
      ],
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 130,
    cell: ({ row }) => {
      const statusColors = {
        Todo: "secondary",
        "In Progress": "default",
        Review: "outline",
        Done: "default",
      } as const;

      return (
        <Badge variant={statusColors[row.original.status]}>
          {row.original.status}
        </Badge>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "multi-select",
      filterOptions: [
        { label: "Todo", value: "Todo" },
        { label: "In Progress", value: "In Progress" },
        { label: "Review", value: "Review" },
        { label: "Done", value: "Done" },
      ],
    },
  },
  {
    id: "dueDate",
    accessorKey: "dueDate",
    header: "Due Date",
    size: 140,
    cell: ({ row }) => {
      const dueDate = new Date(row.original.dueDate);
      const isOverdue = dueDate < new Date() && row.original.status !== "Done";

      return (
        <span className={isOverdue ? "text-red-600 font-medium" : ""}>
          {dueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
    enableSorting: true,
    enableFiltering: true,
    meta: {
      filterVariant: "date-range",
    },
  },
  {
    id: "tags",
    accessorKey: "tags",
    header: "Tags",
    size: 250,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
    enableFiltering: false,
  },
  {
    id: "estimatedHours",
    accessorKey: "estimatedHours",
    header: "Est. Hours",
    size: 110,
    enableSorting: true,
  },
  {
    id: "completedHours",
    accessorKey: "completedHours",
    header: "Actual Hours",
    size: 120,
    cell: ({ row }) => {
      return row.original.completedHours ?? "-";
    },
    enableSorting: true,
  },
];
