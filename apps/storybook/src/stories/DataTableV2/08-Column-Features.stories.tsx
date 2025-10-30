/**
 * DataTable V2 - Column Features Stories
 *
 * Demonstrates advanced column features:
 * - Column visibility toggle
 * - Column resizing
 * - Column reordering (drag and drop)
 * - Column pinning (left/right)
 * - Column header menu
 *
 * All features accessible through the column header menu (... button)
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";
import { useState } from "react";

const meta: Meta<typeof DataTable> = {
  title: "DataTable V2/08-Column Features",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// Sample data type
interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

// Generate products dataset
const generateProducts = (count: number): Product[] => {
  const categories = ["Electronics", "Clothing", "Home", "Sports", "Books"];
  const suppliers = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"];

  return Array.from({ length: count }, (_, i) => {
    const stock = faker.number.int({ min: 0, max: 500 });
    return {
      id: i + 1,
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      stock,
      supplier: faker.helpers.arrayElement(suppliers),
      status:
        stock === 0 ? "out-of-stock" : stock < 50 ? "low-stock" : "in-stock",
    };
  });
};

const products = generateProducts(50);

// Column definitions
const columns: ColumnDef<Product>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    size: 80,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: "sku",
    accessorKey: "sku",
    header: "SKU",
    size: 150,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Product Name",
    size: 250,
    enableResizing: true,
    enablePinning: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    size: 130,
    enableResizing: true,
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    size: 120,
    cell: ({ row }) => {
      return (
        <span className="font-mono">${row.original.price.toFixed(2)}</span>
      );
    },
    enableResizing: true,
  },
  {
    id: "stock",
    accessorKey: "stock",
    header: "Stock",
    size: 100,
    enableResizing: true,
  },
  {
    id: "supplier",
    accessorKey: "supplier",
    header: "Supplier",
    size: 150,
    enableResizing: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 130,
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap = {
        "in-stock":
          "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "low-stock":
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        "out-of-stock":
          "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorMap[status]}`}
        >
          {status}
        </span>
      );
    },
    enableResizing: true,
  },
];

/**
 * Default - Column Features Enabled
 *
 * All column features are enabled by default:
 * - Click the ... button in any column header to access the menu
 * - Try sorting, pinning, hiding columns
 * - Resize columns by dragging the right edge
 * - Use the View menu (top right) to show hidden columns
 */
export const Default: Story = {
  args: {
    data: products,
    columns,
    features: {
      sorting: true,
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      columns: {
        visibility: true,
        resizing: true,
        pinning: true,
      },
    },
  },
};

/**
 * Column Resizing
 *
 * Demonstrates column resizing:
 * - Drag the right edge of any column header to resize
 * - The resize handle appears on hover
 * - Column sizes update in real-time
 * - Resize is enabled per-column via enableResizing
 */
export const ColumnResizing: Story = {
  args: {
    data: products.slice(0, 20),
    columns,
    features: {
      pagination: false,
      columns: {
        resizing: true,
      },
    },
  },
};

/**
 * Column Reordering
 *
 * Demonstrates column reordering with drag and drop:
 * - Drag the grip handle (⋮⋮) on any column header to reorder
 * - Columns can be reordered by dragging
 * - Pinned columns cannot be reordered
 * - Visual feedback during drag operation
 * - Reordering is enabled via features.columns.reordering
 */
export const ColumnReordering: Story = {
  args: {
    data: products.slice(0, 20),
    columns,
    features: {
      pagination: false,
      columns: {
        reordering: true,
      },
    },
  },
};

/**
 * Column Pinning
 *
 * Demonstrates column pinning:
 * - Click the ... button in a column header
 * - Select "Pin to left" or "Pin to right"
 * - Pinned columns stay fixed while others scroll
 * - Unpin using the menu or by pinning to the opposite side
 */
export const ColumnPinning: Story = {
  args: {
    data: products.slice(0, 20),
    columns,
    features: {
      pagination: false,
      columns: {
        pinning: true,
        initialPinning: {
          left: ["id"],
          right: ["status"],
        },
      },
    },
  },
};

/**
 * Column Visibility
 *
 * Demonstrates column visibility:
 * - Use the View menu (top right) to toggle column visibility
 * - Or use the column header menu to hide specific columns
 * - Hidden columns can be shown again from the View menu
 * - Some columns can be set to not hideable
 */
export const ColumnVisibility: Story = {
  args: {
    data: products.slice(0, 20),
    columns: columns.map((col) => ({
      ...col,
      enableHiding: col.id !== "name", // Name column cannot be hidden
    })),
    features: {
      pagination: false,
      columns: {
        visibility: true,
        initialVisibility: {
          supplier: false, // Start with supplier hidden
          category: false, // Start with category hidden
        },
      },
    },
  },
};

/**
 * Column Header Menu
 *
 * Demonstrates the full column header menu:
 * - Click the ... button in any column header
 * - Access all column-specific actions in one place
 * - Menu options adapt based on column capabilities
 * - Clean header design without clutter
 */
export const ColumnHeaderMenu: Story = {
  args: {
    data: products.slice(0, 20),
    columns,
    features: {
      sorting: true,
      filtering: true,
      pagination: false,
      columns: {
        visibility: true,
        resizing: true,
        pinning: true,
      },
    },
  },
};

/**
 * All Column Features Combined
 *
 * Demonstrates all column features working together:
 * - Resize, reorder, pin, hide, and sort columns
 * - With filtering and pagination enabled
 * - Full-featured data table
 */
export const AllFeaturesCombined: Story = {
  args: {
    data: products,
    columns,
    features: {
      sorting: true,
      filtering: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      columns: {
        visibility: true,
        resizing: true,
        reordering: true,
        pinning: true,
        initialPinning: {
          left: ["id"],
        },
      },
    },
  },
};

/**
 * Controlled Column State
 *
 * Demonstrates controlled column state:
 * - Column visibility, sizing, and pinning can be controlled externally
 * - Useful for persisting user preferences
 * - State changes are reflected in the table
 */
export const ControlledColumnState: Story = {
  render: () => {
    const [columnVisibility, setColumnVisibility] = useState({
      supplier: false,
    });

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() =>
              setColumnVisibility((old) => ({
                ...old,
                supplier: !old.supplier,
              }))
            }
            className="rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Toggle Supplier Column
          </button>
          <button
            onClick={() => setColumnVisibility({})}
            className="rounded-sm bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Show All Columns
          </button>
        </div>
        <div className="rounded-sm border p-2 text-sm">
          <strong>Current state:</strong> Supplier{" "}
          {columnVisibility.supplier === false ? "hidden" : "visible"}
        </div>
        <DataTable
          data={products.slice(0, 20)}
          columns={columns}
          features={{
            pagination: false,
            columns: {
              visibility: true,
              resizing: true,
              pinning: true,
              initialVisibility: columnVisibility,
              onVisibilityChange: setColumnVisibility,
            },
          }}
        />
      </div>
    );
  },
};

/**
 * Wide Table with Pinned Columns
 *
 * Demonstrates pinning with a wide table:
 * - Table has many columns requiring horizontal scroll
 * - ID is pinned left, Status is pinned right
 * - Pinned columns stay visible while scrolling
 * - Shadow effect shows pinned columns
 */
export const WideTableWithPinning: Story = {
  args: {
    data: products.slice(0, 30),
    columns,
    features: {
      pagination: false,
      columns: {
        visibility: true,
        resizing: true,
        pinning: true,
        initialPinning: {
          left: ["id", "sku"],
          right: ["status"],
        },
      },
    },
    ui: {
      variant: "bordered",
    },
  },
};

/**
 * Text Truncation and Overflow Handling
 *
 * Demonstrates how the table handles very long text:
 * - Column headers with very long names truncate with ellipsis
 * - Cell content with long text also truncates
 * - Hover on header shows menu icon without breaking layout
 * - Try resizing columns to see text truncation behavior
 * - Minimum column width prevents UI elements from overlapping
 */
export const TextTruncationAndOverflow: Story = {
  render: () => {
    // Generate data with very long text values
    interface LongTextData {
      id: number;
      veryLongProductDescription: string;
      extremelyLongCategoryWithMultipleWords: string;
      anotherVeryLongColumnNameToTestHeaderTruncation: string;
      shortName: string;
    }

    const longTextData: LongTextData[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      veryLongProductDescription:
        "This is an extremely long product description that contains multiple sentences and should definitely be truncated when the column is narrow. It demonstrates how the table handles overflow text gracefully without breaking the layout or causing visual issues.",
      extremelyLongCategoryWithMultipleWords:
        "Electronics > Computers > Laptops > Gaming Laptops > High Performance Gaming Laptops > RGB Gaming Laptops with Advanced Cooling Systems",
      anotherVeryLongColumnNameToTestHeaderTruncation: `Sample data ${i + 1} with moderately long text content that should also demonstrate truncation behavior`,
      shortName: `Item ${i + 1}`,
    }));

    const longTextColumns: ColumnDef<LongTextData>[] = [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        size: 60,
        minSize: 60,
        enableResizing: true,
      },
      {
        id: "veryLongProductDescription",
        accessorKey: "veryLongProductDescription",
        header:
          "Very Long Product Description That Should Truncate In The Header",
        size: 200,
        minSize: 80,
        enableResizing: true,
      },
      {
        id: "extremelyLongCategoryWithMultipleWords",
        accessorKey: "extremelyLongCategoryWithMultipleWords",
        header:
          "Extremely Long Category Name With Multiple Words To Test Header Truncation Behavior",
        size: 180,
        minSize: 80,
        enableResizing: true,
      },
      {
        id: "anotherVeryLongColumnNameToTestHeaderTruncation",
        accessorKey: "anotherVeryLongColumnNameToTestHeaderTruncation",
        header:
          "Another Very Long Column Name To Test Header Truncation And Menu Icon Visibility On Hover",
        size: 200,
        minSize: 80,
        enableResizing: true,
      },
      {
        id: "shortName",
        accessorKey: "shortName",
        header: "Short",
        size: 100,
        minSize: 80,
        enableResizing: true,
      },
    ];

    return (
      <div className="space-y-4">
        <div className="rounded-sm border border-border bg-muted/50 p-4 text-sm">
          <p className="font-semibold mb-2">Testing Text Truncation:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Column headers with very long names truncate with ellipsis</li>
            <li>Cell content also truncates to prevent overflow</li>
            <li>
              Hover on headers to see menu icon (appears without breaking
              layout)
            </li>
            <li>Try resizing columns narrow to see truncation in action</li>
            <li>Minimum width (80px) ensures menu button always fits</li>
          </ul>
        </div>
        <DataTable
          data={longTextData}
          columns={longTextColumns}
          features={{
            pagination: {
              enabled: true,
              pageSize: 10,
            },
            columns: {
              resizing: true,
              visibility: true,
            },
          }}
        />
      </div>
    );
  },
};
