/**
 * DataTable V2 - Pagination Stories
 *
 * Tests pagination functionality with 100 customer records:
 * - First/Previous/Next/Last page navigation
 * - Page size selector (rows per page dropdown)
 * - Page info display ("Showing X to Y of Z results")
 * - Configurable options for customization
 *
 * All pagination controls work in uncontrolled mode by default - no state management required!
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@one-portal/ui/data-table-v2";
import { faker } from "@faker-js/faker";

// Sample data type
interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
}

// Generate large dataset for pagination testing
const generateCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    company: faker.company.name(),
    phone: faker.phone.number(),
    country: faker.location.country(),
  }));
};

const customers = generateCustomers(100);

// Column definitions
const columns: ColumnDef<Customer>[] = [
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
    id: "company",
    accessorKey: "company",
    header: "Company",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "country",
    accessorKey: "country",
    header: "Country",
  },
];

const meta = {
  title: "DataTable V2/03-Pagination",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default Pagination**
 *
 * Pagination enabled by default with 10 rows per page.
 *
 * Features visible:
 * - Page size selector (dropdown showing "10")
 * - Page info ("Showing 1 to 10 of 100 results")
 * - Navigation buttons (First/Prev/Next/Last)
 * - Current page indicator ("Page 1 of 10")
 *
 * Try:
 * - Click Next/Previous buttons to navigate pages
 * - Click First/Last to jump to endpoints
 * - Change page size in dropdown to see more/fewer rows
 */
export const DefaultPagination: Story = {
  args: {
    data: customers,
    columns,
  },
};

/**
 * **Custom Page Size**
 *
 * Start with 20 rows per page.
 */
export const CustomPageSize: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 20,
      },
    },
  },
};

/**
 * **Custom Page Size Options**
 *
 * Provide custom options for page size selector.
 */
export const CustomPageSizeOptions: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 25,
        pageSizeOptions: [5, 10, 25, 50, 100],
      },
    },
  },
};

/**
 * **Hide Page Info**
 *
 * Hide the "Showing X to Y of Z results" text.
 */
export const HidePageInfo: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: {
        enabled: true,
        showPageInfo: false,
      },
    },
  },
};

/**
 * **Hide Page Size Selector**
 *
 * Hide the rows per page dropdown.
 */
export const HidePageSizeSelector: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: {
        enabled: true,
        showPageSizeSelector: false,
      },
    },
  },
};

/**
 * **Minimal Pagination**
 *
 * Hide both page info and page size selector, only show navigation buttons.
 */
export const MinimalPagination: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: {
        enabled: true,
        showPageInfo: false,
        showPageSizeSelector: false,
      },
    },
  },
};

/**
 * **Pagination Disabled**
 *
 * Show all rows without pagination.
 */
export const PaginationDisabled: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: false,
    },
  },
};

/**
 * **With Sorting and Pagination**
 *
 * Combined sorting and pagination features.
 */
export const WithSorting: Story = {
  args: {
    data: customers,
    columns,
    features: {
      sorting: true,
      pagination: {
        enabled: true,
        pageSize: 15,
      },
    },
  },
};

/**
 * **Small Dataset**
 *
 * Test pagination with small dataset (< 1 page).
 */
export const SmallDataset: Story = {
  args: {
    data: customers.slice(0, 5),
    columns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 10,
      },
    },
  },
};

/**
 * **Large Page Size**
 *
 * Test with large page size (50 rows per page).
 */
export const LargePageSize: Story = {
  args: {
    data: customers,
    columns,
    features: {
      pagination: {
        enabled: true,
        pageSize: 50,
      },
    },
  },
};
