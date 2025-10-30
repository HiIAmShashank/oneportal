/**
 * DataTable V2 - States Stories
 *
 * Comprehensive demonstration of all table states:
 * - Empty state (no data)
 * - Loading state (spinner and skeleton modes)
 * - Error state (with retry)
 * - No results state (filtered data)
 * - Custom states
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { useState } from "react";
import { Database, Loader2, XCircle } from "lucide-react";

// Sample data type
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    category: "Electronics",
    price: 999,
    stock: 15,
  },
  {
    id: "2",
    name: "Mouse",
    category: "Electronics",
    price: 29,
    stock: 50,
  },
  {
    id: "3",
    name: "Keyboard",
    category: "Electronics",
    price: 79,
    stock: 30,
  },
  {
    id: "4",
    name: "Monitor",
    category: "Electronics",
    price: 299,
    stock: 8,
  },
  {
    id: "5",
    name: "Desk",
    category: "Furniture",
    price: 399,
    stock: 5,
  },
];

// Column definitions
const columns: ColumnDef<Product>[] = [
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
    cell: ({ row }) => `$${row.original.price}`,
  },
  {
    id: "stock",
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return (
        <span
          className={
            stock < 10
              ? "text-destructive dark:text-destructive"
              : "text-foreground dark:text-foreground"
          }
        >
          {stock}
        </span>
      );
    },
  },
];

const meta = {
  title: "DataTable V2/11-States",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Empty State - Default**
 *
 * Shows the default empty state when table has no data.
 * The empty state component displays a friendly message with an icon.
 */
export const EmptyDefault: Story = {
  args: {
    data: [],
    columns,
  },
};

/**
 * **Empty State - Custom Message**
 *
 * Shows empty state with a custom message.
 */
export const EmptyCustomMessage: Story = {
  args: {
    data: [],
    columns,
    ui: {
      emptyMessage: "No products available in the inventory",
    },
  },
};

/**
 * **Empty State - Custom Component**
 *
 * Shows fully custom empty state with custom icon and action button.
 */
export const EmptyCustomComponent: Story = {
  args: {
    data: [],
    columns,
    ui: {
      emptyState: (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Database className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              No inventory data
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start by adding your first product to the inventory
            </p>
          </div>
          <button
            onClick={() => alert("Add product clicked")}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add First Product
          </button>
        </div>
      ),
    },
  },
};

/**
 * **Loading State - Spinner (Default)**
 *
 * Shows the default loading spinner when data is being fetched.
 * Uses server-side mode with loading flag.
 */
export const LoadingSpinner: Story = {
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
      loadingMessage: "Loading products...",
    },
  },
};

/**
 * **Loading State - Skeleton**
 *
 * Shows skeleton rows while loading data.
 * More polished loading experience for better perceived performance.
 */
export const LoadingSkeleton: Story = {
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
      loadingState: "skeleton",
    },
  },
};

/**
 * **Loading State - Custom Component**
 *
 * Shows fully custom loading state component.
 */
export const LoadingCustomComponent: Story = {
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
      loadingState: (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              Fetching inventory data
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This may take a few moments...
            </p>
          </div>
        </div>
      ),
    },
  },
};

/**
 * **Error State - Default**
 *
 * Shows the default error state when data fetch fails.
 * Displays error message with details from the error object.
 */
export const ErrorDefault: Story = {
  args: {
    data: [],
    columns,
    features: {
      serverSide: {
        enabled: true,
        totalCount: 0,
        error: new Error("Failed to fetch products from the server"),
      },
    },
  },
};

/**
 * **Error State - With Retry**
 *
 * Shows error state with a functional retry button.
 * Clicking retry triggers the onFetch callback.
 */
export const ErrorWithRetry: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(true);

    const handleRetry = async () => {
      setHasError(false);
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Simulate error again for demo
        setHasError(true);
      }, 1500);
    };

    return (
      <DataTable
        data={[]}
        columns={columns}
        features={{
          serverSide: {
            enabled: true,
            totalCount: 0,
            loading: isLoading,
            error: hasError
              ? new Error("Network error: Unable to connect to server")
              : undefined,
            onFetch: handleRetry,
          },
        }}
        ui={{
          errorMessage: "Failed to load products",
        }}
      />
    );
  },
};

/**
 * **Error State - Custom Message**
 *
 * Shows error state with custom message.
 */
export const ErrorCustomMessage: Story = {
  args: {
    data: [],
    columns,
    features: {
      serverSide: {
        enabled: true,
        totalCount: 0,
        error: new Error("Database connection timeout"),
      },
    },
    ui: {
      errorMessage: "Oops! Something went wrong",
    },
  },
};

/**
 * **Error State - Custom Component**
 *
 * Shows fully custom error state component.
 */
export const ErrorCustomComponent: Story = {
  args: {
    data: [],
    columns,
    features: {
      serverSide: {
        enabled: true,
        totalCount: 0,
        error: new Error("Server unreachable"),
      },
    },
    ui: {
      errorState: (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              Connection Failed
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Unable to reach the inventory server. Please check your
              connection.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            Reload Page
          </button>
        </div>
      ),
    },
  },
};

/**
 * **No Results State**
 *
 * Shows when table has data but filters produce no results.
 * Displays a "clear filters" button to reset the table.
 */
export const NoResults: Story = {
  args: {
    data: sampleProducts,
    columns,
    features: {
      filtering: true,
    },
  },
  play: async ({ canvasElement: _canvasElement }) => {
    // Note: User needs to manually apply filters to see this state
    // Example: Search for "NonExistent" in the global search
  },
  parameters: {
    docs: {
      description: {
        story:
          "Apply a filter that returns no results (e.g., search for 'NonExistent') to see this state. The 'Clear filters' button will reset all filters.",
      },
    },
  },
};

/**
 * **State Transitions**
 *
 * Interactive demo showing transitions between loading, error, and success states.
 */
export const StateTransitions: Story = {
  render: () => {
    const [state, setState] = useState<"loading" | "error" | "success">(
      "loading",
    );
    const [data, setData] = useState<Product[]>([]);

    const loadData = () => {
      setState("loading");
      setData([]);

      // Simulate API call
      setTimeout(() => {
        // Randomly succeed or fail
        if (Math.random() > 0.3) {
          setState("success");
          setData(sampleProducts);
        } else {
          setState("error");
        }
      }, 1500);
    };

    // Load on mount
    useState(() => {
      loadData();
    });

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Reload Data
          </button>
        </div>
        <DataTable
          data={data}
          columns={columns}
          features={{
            serverSide: {
              enabled: true,
              totalCount: data.length,
              loading: state === "loading",
              error:
                state === "error"
                  ? new Error("Random error occurred")
                  : undefined,
              onFetch: loadData,
            },
          }}
          ui={{
            loadingState: "skeleton",
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing state transitions. Click 'Reload Data' to trigger a random success or error state.",
      },
    },
  },
};
