/**
 * DataTable V2 - Variants and Themes Stories
 *
 * Tests table visual variants and theme support:
 * - Default: Clean minimal style
 * - Bordered: Cell borders for clarity
 * - Striped: Alternating row colors
 * - Dark mode support for all variants
 * - Combining variants with density
 *
 * All variants support both light and dark mode automatically.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";

// Sample data type
interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "debit" | "credit";
  balance: number;
}

// Generate transactions dataset
const generateTransactions = (count: number): Transaction[] => {
  const categories = [
    "Salary",
    "Groceries",
    "Utilities",
    "Entertainment",
    "Transport",
    "Healthcare",
    "Shopping",
    "Dining",
  ];

  let runningBalance = 5000;

  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(["debit", "credit", "credit"]) as
      | "debit"
      | "credit";
    const amount = parseFloat(
      faker.finance.amount({ min: 10, max: 500, dec: 2 }),
    );

    if (type === "debit") {
      runningBalance -= amount;
    } else {
      runningBalance += amount;
    }

    return {
      id: i + 1,
      date: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
      description: faker.finance.transactionDescription(),
      category: faker.helpers.arrayElement(categories),
      amount,
      type,
      balance: runningBalance,
    };
  });
};

const transactions = generateTransactions(50);

// Column definitions
const columns: ColumnDef<Transaction>[] = [
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    size: 120,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            type === "credit"
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const type = row.original.type;
      return (
        <span
          className={
            type === "debit"
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }
        >
          {type === "debit" ? "-" : "+"}${amount.toFixed(2)}
        </span>
      );
    },
  },
  {
    id: "balance",
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.original.balance;
      return (
        <span
          className={
            balance < 0 ? "text-red-600 font-semibold dark:text-red-400" : ""
          }
        >
          ${balance.toFixed(2)}
        </span>
      );
    },
  },
];

const meta = {
  title: "DataTable V2/07-Variants-And-Themes",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default Variant**
 *
 * Clean minimal style with subtle borders.
 *
 * Features:
 * - Border only on table container
 * - Row borders between rows
 * - Hover state for interactivity
 * - Minimal visual noise
 *
 * Best For:
 * - Modern minimalist UIs
 * - Focus on content over chrome
 * - Clean professional look
 */
export const DefaultVariant: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "default",
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
 * **Bordered Variant**
 *
 * Full cell borders for maximum clarity.
 *
 * Features:
 * - Borders on all cells
 * - Clear visual separation
 * - Grid-like appearance
 * - Easy to scan across columns
 *
 * Best For:
 * - Data-heavy tables
 * - Financial reports
 * - When cell boundaries matter
 * - Printing and PDF export
 */
export const BorderedVariant: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "bordered",
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
 * **Striped Variant**
 *
 * Alternating row colors for readability.
 *
 * Features:
 * - Every other row shaded
 * - Easier to track across columns
 * - Subtle background pattern
 * - Reduces visual fatigue
 *
 * Best For:
 * - Wide tables with many columns
 * - Long data rows
 * - Reducing reading errors
 * - Improving data entry accuracy
 */
export const StripedVariant: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "striped",
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
 * **Dark Mode - Default Variant**
 *
 * All variants automatically support dark mode.
 *
 * Features:
 * - Proper dark: color classes
 * - Inverted contrast
 * - Maintains readability
 * - Consistent with design system
 *
 * Try:
 * - Toggle Storybook's dark mode
 * - Notice smooth theme transition
 * - All text and borders adapt
 */
export const DarkModeDefault: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "default",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * **Dark Mode - Bordered Variant**
 *
 * Bordered variant in dark mode.
 */
export const DarkModeBordered: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "bordered",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * **Dark Mode - Striped Variant**
 *
 * Striped variant in dark mode.
 */
export const DarkModeStriped: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "striped",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * **Variant with Compact Density**
 *
 * Combining variants with density settings.
 *
 * Features:
 * - Striped variant for readability
 * - Compact density for data density
 * - Best of both worlds
 *
 * Try:
 * - Notice how striping helps in compact mode
 * - More rows visible with minimal spacing
 * - Striping reduces visual confusion
 */
export const VariantWithCompactDensity: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "striped",
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
 * **Variant with Comfortable Density**
 *
 * Maximum spacing with bordered variant.
 *
 * Features:
 * - Bordered variant for clarity
 * - Comfortable density for accessibility
 * - Large touch targets
 * - Excellent readability
 *
 * Best For:
 * - Presentations
 * - Touch interfaces
 * - Accessibility requirements
 */
export const VariantWithComfortableDensity: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "bordered",
      density: "comfortable",
    },
    features: {
      pagination: {
        enabled: true,
        pageSize: 8,
      },
      sorting: true,
    },
  },
};

/**
 * **All Variants Comparison**
 *
 * Side-by-side comparison of all three variants.
 *
 * Compare:
 * - Visual weight and density
 * - Border styles
 * - Row alternation patterns
 * - Overall aesthetics
 */
export const AllVariantsComparison: Story = {
  render: () => {
    const comparisonData = transactions.slice(0, 15);

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Default Variant</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Clean and minimal - best for modern UIs
          </p>
          <DataTable
            data={comparisonData}
            columns={columns}
            ui={{ variant: "default" }}
            features={{ pagination: false, sorting: true }}
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Bordered Variant</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Full cell borders - best for data-heavy tables
          </p>
          <DataTable
            data={comparisonData}
            columns={columns}
            ui={{ variant: "bordered" }}
            features={{ pagination: false, sorting: true }}
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Striped Variant</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Alternating rows - best for wide tables
          </p>
          <DataTable
            data={comparisonData}
            columns={columns}
            ui={{ variant: "striped" }}
            features={{ pagination: false, sorting: true }}
          />
        </div>
      </div>
    );
  },
};

/**
 * **Variant with All Features**
 *
 * Variants work with all table features.
 *
 * Features Combined:
 * - Striped variant
 * - Sorting
 * - Filtering
 * - Pagination
 * - Row selection
 * - Density control
 *
 * Try:
 * - Select rows (notice hover + striping)
 * - Apply filters
 * - Sort columns
 * - Change density in View menu
 */
export const VariantWithAllFeatures: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "striped",
    },
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
 * **Sticky Header with Variant**
 *
 * Variants work with sticky headers.
 *
 * Features:
 * - Bordered variant for clarity
 * - Sticky header stays visible
 * - Scroll to see effect
 * - 600px max height
 *
 * Try:
 * - Scroll down the table
 * - Notice header stays at top
 * - Borders remain consistent
 */
export const StickyHeaderWithVariant: Story = {
  args: {
    data: transactions,
    columns,
    ui: {
      variant: "bordered",
      stickyHeader: true,
    },
    features: {
      pagination: false,
      sorting: true,
    },
  },
};

/**
 * **Custom Styling with Variants**
 *
 * Variants can be extended with custom className.
 *
 * Features:
 * - Striped variant as base
 * - Custom shadow and rounded corners
 * - Custom border color
 *
 * Demonstrates how variants integrate with custom styling.
 */
export const CustomStylingWithVariant: Story = {
  args: {
    data: transactions.slice(0, 20),
    columns,
    ui: {
      variant: "striped",
    },
    className: "shadow-lg",
    containerClassName: "rounded-lg overflow-hidden",
    features: {
      pagination: false,
      sorting: true,
    },
  },
};
