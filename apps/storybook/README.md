# Storybook - OnePortal Component Documentation

Interactive documentation and testing environment for OnePortal's DataTable V2 component and shared UI library.

## Overview

**Location:** `apps/storybook`  
**Purpose:** Component documentation, testing, and design system showcase  
**Port:** 6006  
**Deployment:** Excluded from production builds (dev-only)

Storybook provides a comprehensive showcase of the DataTable V2 component from `@one-portal/ui`, demonstrating all features with realistic mock data and interactive controls.

## What is Storybook?

Storybook is an open-source tool for building UI components in isolation. In OnePortal, it serves as:

- **Component Documentation** - Complete API reference with live examples
- **Visual Testing** - Test components in different states and configurations
- **Design System Showcase** - Demonstrate component library capabilities
- **Development Sandbox** - Rapid prototyping and experimentation

## Features

### DataTable V2 Stories

Comprehensive coverage of all DataTable features:

- **01-Basic** - Simple table with data
- **02-Sorting** - Single and multi-column sorting
- **03-Pagination** - Page sizes and navigation
- **04-Filtering** - Toolbar, inline, and faceted filters
- **05-Selection-And-Actions** - Row selection and bulk actions
- **06-Density** - Compact, default, comfortable modes
- **07-Variants-And-Themes** - Default, bordered, striped styles with dark mode
- **08-Column-Features** - Resizing, reordering, pinning, visibility
- **09-Grouping-And-Aggregation** - Grouped rows with aggregated values
- **10-Row-Expansion** - Sub-rows and detail panels
- **11-States** - Empty, loading, error, no results
- **12-Persistence** - localStorage integration
- **13-Custom-Cell-Rendering** - Badges, avatars, progress bars, images
- **14-Server-Side** - Pagination, sorting, filtering with API simulation

### Mock Data System

Powered by `@faker-js/faker` for realistic test data:

**Data Types:**

- **Users** - Names, emails, roles, departments, avatars, status
- **Orders** - Order numbers, customers, amounts, status, dates
- **Products** - SKUs, pricing, stock levels, categories, suppliers
- **Transactions** - Financial data with debits, credits, running balances
- **Tasks** - Project management with priorities, statuses, due dates, tags

**Data Generators** (`src/mocks/data-generators.ts`):

```typescript
import {
  generateUsers,
  generateOrders,
  generateProducts,
} from "@/mocks/data-generators";

const users = generateUsers(50); // 50 realistic users
const orders = generateOrders(100); // 100 orders
const products = generateProducts(25); // 25 products
```

### Column Definitions

Reusable column configurations (`src/mocks/column-definitions.tsx`):

- Custom cell renderers (badges, avatars, formatted currency/dates)
- Filter configurations (select, multi-select, date-range, number-range)
- Inline editing configurations
- Aggregation functions for grouping
- Sort functions and conditional styling

### Interactive Controls

All stories include Storybook controls:

- **Data Size** - Adjust number of rows
- **Features** - Toggle sorting, filtering, pagination
- **UI Options** - Change density, variant, theme
- **State** - Simulate loading, error, empty states

### Light/Dark Mode

Toggle between themes with toolbar button to test component appearance.

## Running Storybook

### Start Development Server

```bash
# From monorepo root
pnpm storybook

# Or from storybook directory
cd apps/storybook
pnpm storybook
```

Access at `http://localhost:6006`

### Build Static Site

```bash
# From monorepo root
pnpm build-storybook

# Or from storybook directory
cd apps/storybook
pnpm build-storybook
```

Output: `storybook-static/` directory (can be hosted on any static server)

## Project Structure

```
apps/storybook/
├── .storybook/
│   ├── main.ts              # Storybook configuration
│   ├── preview.tsx          # Global decorators and theme setup
│   └── storybook.css        # Custom Storybook styles
├── src/
│   ├── stories/
│   │   ├── Welcome.stories.tsx
│   │   └── DataTableV2/     # DataTable V2 feature stories
│   │       ├── 01-Basic.stories.tsx
│   │       ├── 02-Sorting.stories.tsx
│   │       ├── 03-Pagination.stories.tsx
│   │       ├── 04-Filtering.stories.tsx
│   │       ├── 05-Selection-And-Actions.stories.tsx
│   │       ├── 06-Density.stories.tsx
│   │       ├── 07-Variants-And-Themes.stories.tsx
│   │       ├── 08-Column-Features.stories.tsx
│   │       ├── 09-Grouping-And-Aggregation.stories.tsx
│   │       ├── 10-Row-Expansion.stories.tsx
│   │       ├── 11-States.stories.tsx
│   │       ├── 12-Persistence.stories.tsx
│   │       ├── 13-Custom-Cell-Rendering.stories.tsx
│   │       └── 14-Server-Side.stories.tsx
│   └── mocks/
│       ├── data-generators.ts    # Faker.js mock data generators
│       ├── column-definitions.tsx # Reusable column configs
│       └── server-api.ts         # Simulated server-side API
├── package.json
└── tsconfig.json
```

## Writing Stories

### Basic Story Template

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "@one-portal/ui";
import { generateUsers } from "../mocks/data-generators";
import { userColumns } from "../mocks/column-definitions";

const meta: Meta<typeof DataTable> = {
  title: "DataTable V2/01-Basic",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const data = generateUsers(50);
    return <DataTable data={data} columns={userColumns} />;
  },
};
```

### Story with Controls

```tsx
export const WithControls: Story = {
  args: {
    data: generateUsers(25),
    columns: userColumns,
    features: {
      sorting: { enabled: true },
      filtering: { enabled: true },
      pagination: { enabled: true, pageSize: 10 },
    },
  },
  argTypes: {
    "features.pagination.pageSize": {
      control: { type: "select" },
      options: [10, 25, 50, 100],
    },
  },
};
```

### Story with Mock Data

```tsx
import { generateOrders } from "@/mocks/data-generators";
import { orderColumns } from "@/mocks/column-definitions";

export const Orders: Story = {
  render: () => (
    <DataTable
      data={generateOrders(100)}
      columns={orderColumns}
      features={{
        sorting: { enabled: true },
        filtering: { enabled: true, mode: "inline" },
        pagination: { enabled: true, pageSize: 25 },
      }}
    />
  ),
};
```

## Using Mock Data

### Generating Data

```typescript
import {
  generateUsers,
  generateOrders,
  generateProducts,
  generateTransactions,
  generateTasks,
} from "@/mocks/data-generators";

// Generate 50 users with realistic data
const users = generateUsers(50);

// Generate 100 orders with customer info
const orders = generateOrders(100);

// Generate 25 products with pricing
const products = generateProducts(25);
```

### Using Column Definitions

```typescript
import {
  userColumns,
  orderColumns,
  productColumns,
  transactionColumns,
  taskColumns,
} from "@/mocks/column-definitions";

<DataTable data={users} columns={userColumns} />;
```

### Custom Column Renderers

Column definitions include:

- **Badges** - Status, role, priority with color coding
- **Avatars** - User profiles with initials fallback
- **Currency** - Formatted money with locale support
- **Dates** - Relative and absolute date formatting
- **Progress Bars** - Visual progress indicators
- **Images** - Product images with placeholders
- **Tags** - Multi-value chip displays

## Storybook Configuration

### Addons

- **@storybook/addon-docs** - Auto-generated documentation
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-themes** - Light/dark mode switcher
- **@storybook/addon-links** - Navigation between stories

### Theme Provider

Global decorator in `.storybook/preview.tsx` wraps all stories:

```tsx
import { ThemeProvider } from "@one-portal/ui";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

### Custom Styles

Storybook-specific styles in `.storybook/storybook.css`:

- Custom scrollbar styles
- Dark mode adjustments
- Layout spacing

## Server-Side Simulation

`src/mocks/server-api.ts` provides simulated server:

```typescript
import { simulateServerFetch } from "@/mocks/server-api";

const handleFetch = async (params: ServerSideParams) => {
  const response = await simulateServerFetch(params, allData);
  setData(response.data);
  setTotalCount(response.totalCount);
};

<DataTable
  features={{
    serverSide: {
      enabled: true,
      totalCount,
      onFetch: handleFetch,
    },
  }}
/>;
```

Features:

- Pagination simulation
- Sorting simulation
- Filtering simulation
- Configurable delays
- Error simulation

## Progress Tracking

Implementation progress tracked in `docs/STORYBOOK_CHECKLIST.md`:

- ✅ Completed phases
- 🚧 In-progress features
- 📋 Planned improvements

Checklist includes:

- Story coverage
- Mock data completeness
- Documentation quality
- Interactive controls
- Accessibility testing

## Development Workflow

### Adding New Story

1. Create story file in `src/stories/DataTableV2/`
2. Import mock data generators
3. Import column definitions
4. Write story with examples
5. Add controls for interactive testing
6. Test in browser at `http://localhost:6006`

### Testing Component Changes

1. Start Storybook: `pnpm storybook`
2. Make changes to `@one-portal/ui` components
3. Changes hot-reload in Storybook (~2 seconds)
4. Verify visual and functional changes
5. Test across different stories/configurations

### Adding Mock Data Type

1. Add type definition in `src/mocks/data-generators.ts`
2. Implement generator using `@faker-js/faker`
3. Add column definitions in `src/mocks/column-definitions.tsx`
4. Create story showcasing new data type
5. Export from mock index files

## Deployment

**Important:** Storybook is **excluded from production deployment**.

- `scripts/combine-builds.js` skips `@one-portal/storybook`
- `pnpm build:deploy` ignores storybook app
- Only used for development and documentation

### Hosting Static Storybook (Optional)

To host documentation separately:

```bash
# Build static site
pnpm build-storybook

# Deploy storybook-static/ to hosting service
# (e.g., Azure Static Web Apps, Netlify, GitHub Pages)
```

## Accessibility Testing

Storybook includes `@storybook/addon-a11y` for automated accessibility checks:

- **Color Contrast** - Verify WCAG AA/AAA compliance
- **Keyboard Navigation** - Test tab order and focus management
- **ARIA Labels** - Validate screen reader compatibility
- **Violations** - Highlights accessibility issues in real-time

Access via "Accessibility" tab in Storybook UI.

## Best Practices

### Story Organization

- Group related stories in folders (e.g., `DataTableV2/`)
- Number stories for logical progression (01, 02, 03...)
- Use descriptive names (e.g., `05-Selection-And-Actions.stories.tsx`)

### Mock Data

- Use realistic data from Faker.js
- Generate sufficient quantity for testing (50-100 rows)
- Include edge cases (empty strings, nulls, extremes)
- Reuse column definitions across stories

### Documentation

- Add description metadata to stories
- Include code examples in docs
- Document component props and features
- Link to main documentation (`packages/ui/README.md`)

### Performance

- Memoize column definitions
- Use reasonable data sizes (avoid 10,000+ rows)
- Test performance with server-side mode for large datasets

## Troubleshooting

### Storybook Won't Start

**Cause:** Port 6006 already in use  
**Fix:** `lsof -ti:6006 | xargs kill -9` (Mac/Linux) or change port in `package.json`

### Stories Not Showing

**Cause:** Story file not matching glob pattern  
**Fix:** Verify file ends with `.stories.tsx` and is in `src/stories/`

### Mock Data Not Realistic

**Cause:** Faker.js not configured correctly  
**Fix:** Check generator implementation in `src/mocks/data-generators.ts`

### Dark Mode Not Working

**Cause:** Theme provider not wrapping stories  
**Fix:** Verify decorator in `.storybook/preview.tsx`

### Component Changes Not Reflecting

**Cause:** Stale build cache  
**Fix:** Restart Storybook or rebuild `@one-portal/ui`

## Contributing

When adding DataTable features:

1. Add story demonstrating new feature
2. Update mock data if needed
3. Add column definition examples
4. Update `docs/STORYBOOK_CHECKLIST.md`
5. Test across light/dark modes
6. Run accessibility checks

## Related Documentation

- **DataTable V2:** `packages/ui/src/data-table-v2/README.md` - Complete API reference
- **UI Package:** `packages/ui/README.md` - Component library overview
- **CLAUDE.md** - Architecture and patterns
- **Storybook Checklist:** `docs/STORYBOOK_CHECKLIST.md` - Implementation progress

## Resources

- **Storybook Docs:** https://storybook.js.org/docs
- **Faker.js Docs:** https://fakerjs.dev/guide/
- **TanStack Table:** https://tanstack.com/table/latest

## License

Internal use only - Part of OnePortal monorepo.
