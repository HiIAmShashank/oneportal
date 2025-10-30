/**
 * DataTable V2 - Grouping & Aggregation Stories
 *
 * Demonstrates grouping and aggregation features:
 * - Table footer with aggregated values (sum, count, average)
 * - Row grouping by column values
 * - Column header grouping (multi-level headers)
 * - Custom aggregation functions
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";

const meta: Meta<typeof DataTable> = {
  title: "DataTable V2/09-Grouping & Aggregation",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// Sample data type - Sales transactions
interface SalesTransaction {
  id: number;
  orderNumber: string;
  customer: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  region: string;
  date: string;
}

// Generate sales data
const generateSalesData = (count: number): SalesTransaction[] => {
  const categories = ["Electronics", "Clothing", "Home", "Sports", "Books"];
  const regions = ["North", "South", "East", "West"];
  const customers = Array.from({ length: 20 }, () => faker.person.fullName());

  return Array.from({ length: count }, (_, i) => {
    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitPrice = parseFloat(faker.commerce.price({ min: 10, max: 500 }));
    return {
      id: i + 1,
      orderNumber: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
      customer: faker.helpers.arrayElement(customers),
      product: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      region: faker.helpers.arrayElement(regions),
      date: faker.date.recent({ days: 90 }).toISOString().split("T")[0],
    };
  });
};

const salesData = generateSalesData(100);

/**
 * Footer with Aggregations
 *
 * Demonstrates table footer showing aggregated values:
 * - Total quantity (sum)
 * - Total amount (sum)
 * - Average unit price
 * - Row count
 *
 * Footer appears at the bottom of the table with summary statistics.
 */
export const FooterWithAggregations: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "orderNumber",
        accessorKey: "orderNumber",
        header: "Order #",
        size: 140,
        footer: "Totals:",
      },
      {
        id: "customer",
        accessorKey: "customer",
        header: "Customer",
        size: 180,
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        size: 200,
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 120,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Qty",
        size: 80,
        aggregationFn: "sum",
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.quantity, 0);
          return <span className="font-mono font-bold">{total}</span>;
        },
      },
      {
        id: "unitPrice",
        accessorKey: "unitPrice",
        header: "Unit Price",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.unitPrice.toFixed(2)}
          </span>
        ),
        aggregationFn: "mean",
        footer: ({ table }) => {
          const avg =
            table
              .getFilteredRowModel()
              .rows.reduce((sum, row) => sum + row.original.unitPrice, 0) /
            table.getFilteredRowModel().rows.length;
          return (
            <span className="font-mono font-bold">Avg: ${avg.toFixed(2)}</span>
          );
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono font-semibold">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
        aggregationFn: "sum",
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.totalAmount, 0);
          return (
            <span className="font-mono font-bold text-green-700 dark:text-green-400">
              ${total.toFixed(2)}
            </span>
          );
        },
      },
      {
        id: "region",
        accessorKey: "region",
        header: "Region",
        size: 100,
        footer: ({ table }) => {
          return (
            <span className="text-xs">
              {table.getFilteredRowModel().rows.length} orders
            </span>
          );
        },
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      filtering: true,
      pagination: {
        enabled: true,
        pageSize: 20,
      },
    },
  },
};

/**
 * Footer with Filtering
 *
 * Shows how footer aggregations update dynamically when filters are applied.
 * - Try filtering by category or customer
 * - Watch the footer totals recalculate automatically
 * - Only visible/filtered rows are included in aggregations
 */
export const FooterWithFiltering: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "customer",
        accessorKey: "customer",
        header: "Customer",
        size: 180,
        enableColumnFilter: true,
        footer: "Summary:",
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 120,
        enableColumnFilter: true,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        aggregationFn: "sum",
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.quantity, 0);
          return (
            <div className="text-right">
              <div className="font-mono font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">items</div>
            </div>
          );
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Revenue",
        size: 140,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
        aggregationFn: "sum",
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.totalAmount, 0);
          return (
            <div className="text-right">
              <div className="font-mono font-bold text-green-700 dark:text-green-400">
                ${total.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">total</div>
            </div>
          );
        },
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      filtering: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
    },
  },
};

/**
 * Multiple Aggregation Types
 *
 * Demonstrates different aggregation functions in the footer:
 * - Sum: Total quantity and revenue
 * - Average: Mean unit price
 * - Count: Number of orders
 * - Min/Max: Price range
 */
export const MultipleAggregationTypes: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 120,
        footer: "Statistics:",
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        aggregationFn: "sum",
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const sum = rows.reduce((acc, row) => acc + row.original.quantity, 0);
          return (
            <div className="space-y-1">
              <div className="font-mono font-bold">{sum}</div>
              <div className="text-xs text-muted-foreground">total</div>
            </div>
          );
        },
      },
      {
        id: "unitPrice",
        accessorKey: "unitPrice",
        header: "Unit Price",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.unitPrice.toFixed(2)}
          </span>
        ),
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const prices = rows.map((r) => r.original.unitPrice);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          return (
            <div className="space-y-1">
              <div className="font-mono text-xs">
                <div>Avg: ${avg.toFixed(2)}</div>
                <div className="text-muted-foreground">
                  ${min.toFixed(2)} - ${max.toFixed(2)}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
        aggregationFn: "sum",
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = rows.reduce(
            (acc, row) => acc + row.original.totalAmount,
            0,
          );
          return (
            <div className="space-y-1">
              <div className="font-mono font-bold text-green-700 dark:text-green-400">
                ${total.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {rows.length} orders
              </div>
            </div>
          );
        },
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      filtering: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
    },
  },
};

/**
 * Footer with Pinned Columns
 *
 * Shows footer working correctly with pinned columns:
 * - Order # pinned left
 * - Total Amount pinned right
 * - Footer cells maintain pinning and shadows
 */
export const FooterWithPinnedColumns: Story = {
  args: {
    data: salesData.slice(0, 30),
    columns: [
      {
        id: "orderNumber",
        accessorKey: "orderNumber",
        header: "Order #",
        size: 140,
        enablePinning: true,
        footer: () => <span className="font-semibold">Grand Total:</span>,
      },
      {
        id: "customer",
        accessorKey: "customer",
        header: "Customer",
        size: 180,
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        size: 200,
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 120,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Qty",
        size: 80,
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.quantity, 0);
          return <span className="font-mono">{total}</span>;
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total",
        size: 140,
        enablePinning: true,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.totalAmount, 0);
          return (
            <span className="font-mono font-bold text-green-700 dark:text-green-400">
              ${total.toFixed(2)}
            </span>
          );
        },
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      pagination: false,
      columns: {
        pinning: true,
        initialPinning: {
          left: ["orderNumber"],
          right: ["totalAmount"],
        },
      },
    },
  },
};

/**
 * Basic Row Grouping
 *
 * Demonstrates grouping rows by a single column:
 * - Rows are grouped by Category
 * - Click expand/collapse buttons to show/hide group items
 * - Group rows show count of items in parentheses
 * - Groups are collapsed by default
 */
export const BasicRowGrouping: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 150,
        enableGrouping: true,
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        size: 200,
      },
      {
        id: "customer",
        accessorKey: "customer",
        header: "Customer",
        size: 180,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Amount",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      grouping: {
        enabled: true,
        initialState: ["category"],
      },
      expanding: {
        enabled: true,
      },
    },
  },
};

/**
 * Multi-Level Row Grouping
 *
 * Demonstrates grouping by multiple columns:
 * - First level: Group by Region
 * - Second level: Group by Category within each region
 * - Hierarchical expand/collapse
 * - Shows nested group structure
 */
export const MultiLevelGrouping: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "region",
        accessorKey: "region",
        header: "Region",
        size: 120,
        enableGrouping: true,
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 130,
        enableGrouping: true,
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        size: 200,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Qty",
        size: 80,
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Amount",
        size: 120,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      grouping: {
        enabled: true,
        initialState: ["region", "category"],
      },
      expanding: {
        enabled: true,
      },
    },
  },
};

/**
 * Row Grouping with Aggregations
 *
 * Demonstrates grouping with aggregated values:
 * - Group by Category
 * - Quantity column shows sum for each group
 * - Total Amount column shows sum for each group
 * - Aggregated cells are bold to distinguish from regular cells
 */
export const GroupingWithAggregations: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 150,
        enableGrouping: true,
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        size: 200,
      },
      {
        id: "customer",
        accessorKey: "customer",
        header: "Customer",
        size: 180,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => (
          <span className="font-mono font-bold text-primary dark:text-primary">
            {getValue() as number} items
          </span>
        ),
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total Amount",
        size: 140,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => (
          <span className="font-mono font-bold text-green-700 dark:text-green-400">
            ${(getValue() as number).toFixed(2)}
          </span>
        ),
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      grouping: {
        enabled: true,
        initialState: ["category"],
      },
      expanding: {
        enabled: true,
      },
    },
  },
};

/**
 * Row Grouping with Footer
 *
 * Demonstrates both row-level and table-level aggregations:
 * - Rows grouped by Region
 * - Each group shows sum of quantity and amount
 * - Footer shows grand totals across all groups
 * - Combines row grouping with footer aggregations
 */
export const GroupingWithFooter: Story = {
  args: {
    data: salesData,
    columns: [
      {
        id: "region",
        accessorKey: "region",
        header: "Region",
        size: 120,
        enableGrouping: true,
        footer: "Grand Total:",
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        size: 130,
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        size: 200,
      },
      {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => (
          <span className="font-mono font-bold">
            {getValue() as number} items
          </span>
        ),
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.quantity, 0);
          return (
            <span className="font-mono font-bold text-primary dark:text-primary">
              {total}
            </span>
          );
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Amount",
        size: 140,
        cell: ({ row }) => (
          <span className="font-mono">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        ),
        aggregationFn: "sum",
        aggregatedCell: ({ getValue }) => (
          <span className="font-mono font-bold text-green-700 dark:text-green-400">
            ${(getValue() as number).toFixed(2)}
          </span>
        ),
        footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.original.totalAmount, 0);
          return (
            <span className="font-mono font-bold text-green-700 dark:text-green-400">
              ${total.toFixed(2)}
            </span>
          );
        },
      },
    ] as ColumnDef<SalesTransaction>[],
    features: {
      sorting: true,
      filtering: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      grouping: {
        enabled: true,
        initialState: ["region"],
      },
      expanding: {
        enabled: true,
      },
    },
  },
};
