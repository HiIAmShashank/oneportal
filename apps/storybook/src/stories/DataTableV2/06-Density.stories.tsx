/**
 * DataTable V2 - Density Stories
 *
 * Tests table density controls:
 * - Compact: Minimal spacing, small text (text-xs)
 * - Default: Standard spacing and text (text-sm)
 * - Comfortable: Maximum spacing, large text (text-base)
 * - Interactive density switcher in View menu
 * - Controlled density from parent
 *
 * Density affects both text size and cell padding for optimal data display.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";
import { useState } from "react";

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

const products = generateProducts(100);

// Column definitions
const columns: ColumnDef<Product>[] = [
  {
    id: "sku",
    accessorKey: "sku",
    header: "SKU",
    size: 150,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Product Name",
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
  },
  {
    id: "stock",
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => row.original.stock.toLocaleString(),
  },
  {
    id: "supplier",
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
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
  },
];

const meta = {
  title: "DataTable V2/06-Density",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Compact Density**
 *
 * Minimal spacing for maximum data visibility.
 *
 * Features:
 * - Text size: text-xs (12px)
 * - Cell padding: px-2 py-1
 * - Best for: Large datasets, dashboards, data analysis
 * - More rows visible on screen
 *
 * Use Case:
 * - Admin dashboards with many columns
 * - Data grids where space is premium
 * - Power users who want dense information
 */
export const CompactDensity: Story = {
  args: {
    data: products,
    columns,
    ui: {
      density: "compact",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 15,
      },
      sorting: true,
    },
  },
};

/**
 * **Default Density**
 *
 * Balanced spacing - recommended for most use cases.
 *
 * Features:
 * - Text size: text-sm (14px)
 * - Cell padding: px-4 py-2
 * - Best for: General purpose tables
 * - Good balance of readability and data density
 *
 * Use Case:
 * - Standard CRUD tables
 * - Most business applications
 * - General data browsing
 */
export const DefaultDensity: Story = {
  args: {
    data: products,
    columns,
    ui: {
      density: "default",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: true,
    },
  },
};

/**
 * **Comfortable Density**
 *
 * Maximum spacing for best readability.
 *
 * Features:
 * - Text size: text-base (16px)
 * - Cell padding: px-6 py-4
 * - Best for: Accessibility, presentations, mobile
 * - Easier on the eyes, more touch-friendly
 *
 * Use Case:
 * - Accessibility requirements
 * - Presentations or demos
 * - Touch-screen interfaces
 * - Users with vision impairments
 */
export const ComfortableDensity: Story = {
  args: {
    data: products,
    columns,
    ui: {
      density: "comfortable",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: true,
    },
  },
};

/**
 * **Interactive Density Switcher**
 *
 * Let users choose their preferred density.
 *
 * Features:
 * - View menu (Settings icon) in toolbar
 * - Radio group with all 3 density options
 * - Persists throughout session (internal state)
 * - Default starts at "default" density
 *
 * Try:
 * 1. Click the "View" button in toolbar
 * 2. Select different density options
 * 3. Watch table spacing and text size change
 * 4. Note how many rows fit on screen at each level
 */
export const InteractiveDensity: Story = {
  args: {
    data: products,
    columns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      sorting: true,
      filtering: true,
    },
  },
};

/**
 * **Controlled Density**
 *
 * Parent component controls density state.
 *
 * Features:
 * - External state management
 * - Buttons to programmatically change density
 * - onDensityChange callback notifies parent
 * - Useful for persisting user preferences
 *
 * Use Case:
 * - Save density preference to localStorage
 * - Sync density across multiple tables
 * - Apply density based on screen size
 */
export const ControlledDensity: Story = {
  render: () => {
    const [density, setDensity] = useState<
      "compact" | "default" | "comfortable"
    >("default");

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">External Density Control:</span>
          <button
            onClick={() => setDensity("compact")}
            className={`rounded-sm px-3 py-1 text-sm ${
              density === "compact"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Compact
          </button>
          <button
            onClick={() => setDensity("default")}
            className={`rounded-sm px-3 py-1 text-sm ${
              density === "default"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Default
          </button>
          <button
            onClick={() => setDensity("comfortable")}
            className={`rounded-sm px-3 py-1 text-sm ${
              density === "comfortable"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Comfortable
          </button>
          <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
            Current: <strong>{density}</strong>
          </span>
        </div>

        <DataTable
          data={products}
          columns={columns}
          ui={{
            density,
            onDensityChange: setDensity,
          }}
          features={{
            pagination: {
              enabled: true,
              pageSize: 10,
            },
            sorting: true,
          }}
        />
      </div>
    );
  },
};

/**
 * **Density with All Features**
 *
 * Density works seamlessly with all table features.
 *
 * Features Combined:
 * - Sorting
 * - Filtering
 * - Pagination
 * - Row selection
 * - Density switcher
 *
 * Try:
 * 1. Change density in View menu
 * 2. Apply filters
 * 3. Select rows
 * 4. Notice all features adapt to density
 */
export const DensityWithAllFeatures: Story = {
  args: {
    data: products,
    columns,
    features: {
      sorting: true,
      filtering: true,
      pagination: {
        enabled: true,
        pageSize: 10,
      },
      selection: {
        mode: "multiple",
      },
    },
  },
};

/**
 * **Density Comparison**
 *
 * Side-by-side comparison of all three densities.
 *
 * This demonstrates how density affects:
 * - Vertical space usage
 * - Text readability
 * - Number of visible rows
 * - Overall data density
 */
export const DensityComparison: Story = {
  render: () => {
    // Use smaller dataset for comparison
    const comparisonData = products.slice(0, 20);

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Compact</h3>
          <DataTable
            data={comparisonData}
            columns={columns}
            ui={{ density: "compact" }}
            features={{ pagination: false }}
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Default</h3>
          <DataTable
            data={comparisonData}
            columns={columns}
            ui={{ density: "default" }}
            features={{ pagination: false }}
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Comfortable</h3>
          <DataTable
            data={comparisonData}
            columns={columns}
            ui={{ density: "comfortable" }}
            features={{ pagination: false }}
          />
        </div>
      </div>
    );
  },
};
