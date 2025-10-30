# DataTable V2 - Comprehensive Documentation

A powerful, feature-rich data table component built on top of TanStack Table v8 with full TypeScript support.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [DataTable Props](#datatable-props)
  - [Column Definition](#column-definition)
  - [Features Configuration](#features-configuration)
  - [UI Configuration](#ui-configuration)
  - [Persistence Configuration](#persistence-configuration)
  - [Actions Configuration](#actions-configuration)
- [Feature Guides](#feature-guides)
  - [Sorting](#sorting)
  - [Filtering](#filtering)
  - [Pagination](#pagination)
  - [Column Features](#column-features)
  - [Row Selection](#row-selection)
  - [Grouping & Aggregation](#grouping--aggregation)
  - [Row Expansion](#row-expansion)
  - [Server-Side Operations](#server-side-operations)
  - [Persistence](#persistence)
  - [States & Loading](#states--loading)
- [Advanced Usage](#advanced-usage)
- [TypeScript](#typescript)
- [Examples](#examples)

---

## Features

### Core Features

- ✅ **Sorting** - Single and multi-column sorting
- ✅ **Filtering** - Global search, column filters, faceted filters (text, select, multi-select, boolean, number-range, date-range)
- ✅ **Pagination** - Client-side and server-side pagination with page size controls
- ✅ **Column Visibility** - Show/hide columns dynamically
- ✅ **Column Resizing** - Drag to resize columns
- ✅ **Column Reordering** - Drag and drop column reordering
- ✅ **Column Pinning** - Pin columns to left or right
- ✅ **Row Selection** - Single and multi-row selection with conditional selection
- ✅ **Row Actions** - Per-row dropdown actions menu
- ✅ **Bulk Actions** - Actions on selected rows with min/max constraints
- ✅ **Grouping & Aggregation** - Group rows and aggregate values (sum, count, mean, min, max)
- ✅ **Row Expansion** - Sub-rows and custom detail panels
- ✅ **Server-Side Mode** - Delegate all operations to server for massive datasets
- ✅ **Persistence** - Auto-save/restore table state to localStorage
- ✅ **Inline Editing** - Edit cells inline (coming soon)

### UI Features

- ✅ **Density Controls** - Compact, default, comfortable modes
- ✅ **Variants** - Default, bordered, striped styles
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Custom States** - Empty, loading (spinner/skeleton), error, no results
- ✅ **Responsive** - Mobile-friendly design

### Developer Experience

- ✅ **TypeScript** - Full type safety with generics
- ✅ **Controlled/Uncontrolled** - Support for both patterns
- ✅ **Custom Renderers** - Full control over cell/header/footer rendering
- ✅ **Composable** - Export sub-components for custom layouts
- ✅ **Accessible** - ARIA attributes and keyboard navigation

---

## Recent Changes (January 2025)

### New Features

- **Inline filter mode** - Now the default (was "toolbar")
- **Visual sorting indicators** - Up/down arrows in column headers when sorted
- **Conditional footer** - Footer only renders when columns define footer content
- **Client-side loading states** - `isLoading` and `error` props work without serverSide mode
- **Configurable column positions**:
  - Actions column: `actions.pinRight` (defaults to `true`)
  - Selection column: `features.selection.pinLeft` (defaults to `true`)
  - Automatic column pinning based on position

### Performance Improvements

- Memoized internal class objects for stable references
- Optimized duplicate `getVisibleCells()` calls (50% reduction per row)
- All optimizations validated against TanStack Table best practices

### Breaking Changes

None - all changes are backward compatible.

### Important: Consumer Requirements

⚠️ **To prevent infinite re-renders, you MUST provide stable references for `data` and `columns`:**

```tsx
// ✅ CORRECT
const columns = useMemo(
  () => [
    /* ... */
  ],
  [],
);
const [data, setData] = useState(initialData);

// ❌ WRONG - Will cause infinite renders
const columns = [
  /* ... */
]; // Recreated every render!
const data = items.filter((x) => x.active); // Recreated every render!
```

See [Quick Start](#quick-start) for proper usage patterns.

---

## Installation

DataTable V2 is part of the `@one-portal/ui` package:

```bash
pnpm add @one-portal/ui
```

### Required Dependencies

The UI package includes all required dependencies:

- `react` (^19.0.0)
- `@tanstack/react-table` (^8.21.0)
- `@dnd-kit/*` (for column reordering)
- `lucide-react` (for icons)
- `date-fns` (for date formatting)

---

## Quick Start

### Basic Example

```tsx
import { DataTable } from "@one-portal/ui";
import type { ColumnDef } from "@one-portal/ui";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

const data: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "User" },
];

function MyTable() {
  return <DataTable data={data} columns={columns} />;
}
```

### With All Features

```tsx
import {
  DataTable,
  createSelectionColumn,
  createActionsColumn,
} from "@one-portal/ui";

const columns = [
  createSelectionColumn<User>(),
  // ... your data columns
  createActionsColumn<User>({
    actions: [
      { label: "Edit", onClick: (row) => console.log("Edit", row) },
      {
        label: "Delete",
        onClick: (row) => console.log("Delete", row),
        variant: "destructive",
      },
    ],
  }),
];

function FeatureRichTable() {
  return (
    <DataTable
      data={data}
      columns={columns}
      features={{
        sorting: { enabled: true, multi: true },
        filters: { enabled: true, mode: "faceted" },
        pagination: { enabled: true, pageSize: 25 },
        selection: {
          enabled: true,
          mode: "multiple",
          getCanSelect: (row) => row.original.role !== "Admin",
        },
        columns: {
          resizing: true,
          reordering: true,
          pinning: true,
          visibility: true,
        },
      }}
      actions={{
        bulk: [
          {
            label: "Delete Selected",
            onClick: (rows) => console.log("Delete", rows),
            variant: "destructive",
            minSelection: 1,
          },
        ],
      }}
      ui={{
        variant: "default",
        density: "default",
        showToolbar: true,
      }}
      persistState={true}
      stateKey="users-table"
    />
  );
}
```

---

## API Reference

### DataTable Props

```typescript
interface DataTableProps<TData> {
  // Required
  data: TData[];
  columns: ColumnDef<TData>[];

  // Optional - Features
  features?: FeaturesConfig;

  // Optional - UI
  ui?: UIConfig;

  // Optional - Persistence
  persistState?: boolean | PersistenceConfig;
  stateKey?: string;

  // Optional - Actions
  actions?: ActionsConfig<TData>;

  // Optional - State Control (Controlled Mode)
  state?: Partial<TableState>;
  onStateChange?: (state: TableState) => void;

  // Optional - Individual State Control
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  // ... (all TanStack Table state props supported)

  // Optional - Custom Rendering
  getRowId?: (row: TData, index: number) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;

  // Optional - Styling
  className?: string;
}
```

### Column Definition

```typescript
interface ColumnDef<TData> {
  // Basic
  id?: string;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => any;
  header?: string | ((context: HeaderContext<TData>) => React.ReactNode);
  cell?: (context: CellContext<TData>) => React.ReactNode;
  footer?: string | ((context: FooterContext<TData>) => React.ReactNode);

  // Metadata (for filtering, styling, etc.)
  meta?: ColumnMeta<TData>;

  // Sizing
  size?: number;
  minSize?: number;
  maxSize?: number;

  // Features
  enableSorting?: boolean;
  enableColumnFilter?: boolean;
  enableGlobalFilter?: boolean;
  enableResizing?: boolean;
  enablePinning?: boolean;
  enableHiding?: boolean;
  enableGrouping?: boolean;

  // Sorting
  sortingFn?: SortingFn<TData>;
  sortDescFirst?: boolean;
  invertSorting?: boolean;

  // Filtering
  filterFn?: FilterFn<TData>;

  // Grouping & Aggregation
  aggregationFn?: AggregationFn<TData>;
  aggregatedCell?: (context: CellContext<TData>) => React.ReactNode;

  // Sub-columns (for row expansion)
  columns?: ColumnDef<TData>[];
}
```

### ColumnMeta

Custom metadata for enhanced filtering and display:

```typescript
interface ColumnMeta<TData> {
  // Filtering
  filterVariant?:
    | "text"
    | "select"
    | "multi-select"
    | "boolean"
    | "number-range"
    | "date-range";
  filterOptions?: Array<{ label: string; value: string }>;
  filterPlaceholder?: string;

  // Display
  headerClassName?: string;
  cellClassName?: string;
  align?: "left" | "center" | "right";
  truncate?: boolean;

  // Custom Rendering
  renderFilter?: (column: Column<TData>) => React.ReactNode;
}
```

### Features Configuration

```typescript
interface FeaturesConfig {
  // Sorting
  sorting?: {
    enabled: boolean;
    multi?: boolean;
    manual?: boolean;
  };

  // Filtering
  filters?: {
    enabled: boolean;
    mode?: "toolbar" | "inline" | "faceted";
    debounceMs?: number;
  };

  // Pagination
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    manual?: boolean;
  };

  // Column Features
  columns?: {
    visibility?: boolean;
    resizing?: boolean;
    reordering?: boolean;
    pinning?: boolean;
  };

  // Selection
  selection?: {
    enabled: boolean;
    mode?: "single" | "multiple";
    getCanSelect?: (row: Row<TData>) => boolean;
  };

  // Grouping & Aggregation
  grouping?: {
    enabled: boolean;
    manualGrouping?: boolean;
  };

  // Row Expansion
  expansion?: {
    enabled: boolean;
    getCanExpand?: (row: Row<TData>) => boolean;
    defaultExpanded?: boolean;
  };

  // Server-Side
  serverSide?: {
    enabled: boolean;
    totalCount: number;
    loading?: boolean;
    error?: Error | null;
    onFetch: (params: ServerSideParams) => void;
  };
}
```

### ServerSideParams

Parameters sent to server:

```typescript
interface ServerSideParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, unknown>;
  globalFilter?: string;
}
```

### ServerSideResponse

Expected response from server:

```typescript
interface ServerSideResponse<TData> {
  data: TData[];
  totalCount: number;
  page: number;
  pageSize: number;
}
```

### UI Configuration

```typescript
interface UIConfig {
  // Visual Variant
  variant?: "default" | "bordered" | "striped";

  // Density
  density?: "compact" | "default" | "comfortable";

  // Toolbar
  showToolbar?: boolean;
  toolbarActions?: React.ReactNode;

  // Custom States
  emptyState?: React.ReactNode;
  loadingState?: "spinner" | "skeleton" | React.ReactNode;
  errorState?: React.ReactNode;
  noResultsState?: React.ReactNode;
}
```

### Persistence Configuration

```typescript
interface PersistenceConfig {
  // Selective Persistence
  include?: Array<keyof PersistedState>;
  exclude?: Array<keyof PersistedState>;

  // Storage Key (auto-generated if not provided)
  key?: string;
}

interface PersistedState {
  // Column State
  columnVisibility?: ColumnVisibilityState;
  columnSizing?: ColumnSizingState;
  columnPinning?: ColumnPinningState;
  columnOrder?: ColumnOrderState;

  // Data State
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  globalFilter?: string;

  // UI State
  density?: "compact" | "default" | "comfortable";

  // Grouping State
  grouping?: GroupingState;
}
```

### Actions Configuration

```typescript
interface ActionsConfig<TData> {
  // Row Actions (dropdown menu on each row)
  row?: RowAction<TData>[];

  // Bulk Actions (toolbar when rows selected)
  bulk?: BulkAction<TData>[];
}

interface RowAction<TData> {
  label: string;
  onClick: (row: Row<TData>) => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  disabled?: (row: Row<TData>) => boolean;
  hidden?: (row: Row<TData>) => boolean;
}

interface BulkAction<TData> {
  label: string;
  onClick: (rows: Row<TData>[]) => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  minSelection?: number;
  maxSelection?: number;
}
```

---

## Feature Guides

### Sorting

Enable sorting on all columns or specific columns:

```tsx
// Enable on all columns
<DataTable
  data={data}
  columns={columns}
  features={{
    sorting: { enabled: true }
  }}
/>

// Multi-column sorting (Shift+Click)
<DataTable
  features={{
    sorting: { enabled: true, multi: true }
  }}
/>

// Disable sorting on specific column
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableSorting: false,
  },
];

// Custom sort function
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    sortingFn: (rowA, rowB) => {
      return rowA.original.date.getTime() - rowB.original.date.getTime();
    },
  },
];

// Controlled sorting
const [sorting, setSorting] = useState<SortingState>([]);

<DataTable
  sorting={sorting}
  onSortingChange={setSorting}
/>
```

### Filtering

Three filter modes: toolbar, inline, faceted

```tsx
// Global search only (toolbar mode)
<DataTable
  features={{
    filters: { enabled: true, mode: 'toolbar' }
  }}
/>

// Inline filters under column headers
<DataTable
  features={{
    filters: { enabled: true, mode: 'inline' }
  }}
/>

// Faceted filters (auto-detected based on data)
<DataTable
  features={{
    filters: { enabled: true, mode: 'faceted' }
  }}
/>

// Custom filter variant
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'role',
    header: 'Role',
    meta: {
      filterVariant: 'select',
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      filterVariant: 'multi-select',
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  },
  {
    accessorKey: 'age',
    header: 'Age',
    meta: {
      filterVariant: 'number-range',
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    meta: {
      filterVariant: 'date-range',
    },
  },
];

// Custom filter function
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'tags',
    header: 'Tags',
    filterFn: (row, columnId, filterValue) => {
      const tags = row.getValue(columnId) as string[];
      return tags.some(tag => tag.includes(filterValue));
    },
  },
];

// Controlled filters
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

<DataTable
  columnFilters={columnFilters}
  onColumnFiltersChange={setColumnFilters}
/>
```

### Pagination

```tsx
// Basic pagination
<DataTable
  features={{
    pagination: { enabled: true, pageSize: 25 }
  }}
/>

// Custom page sizes
<DataTable
  features={{
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    }
  }}
/>

// Controlled pagination
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 25,
});

<DataTable
  pagination={pagination}
  onPaginationChange={setPagination}
/>
```

### Column Features

```tsx
// Enable all column features
<DataTable
  features={{
    columns: {
      visibility: true, // Show/hide columns
      resizing: true, // Drag to resize
      reordering: true, // Drag to reorder
      pinning: true, // Pin left/right
    },
  }}
/>;

// Column with custom sizing
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    minSize: 100,
    maxSize: 400,
  },
];

// Disable resizing on specific column
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "actions",
    header: "Actions",
    enableResizing: false,
  },
];

// Controlled column visibility
const [columnVisibility, setColumnVisibility] = useState({});

<DataTable
  columnVisibility={columnVisibility}
  onColumnVisibilityChange={setColumnVisibility}
/>;
```

### Row Selection

```tsx
import { createSelectionColumn } from '@one-portal/ui';

// Basic selection
const columns = [
  createSelectionColumn<User>(),
  // ... your columns
];

<DataTable
  columns={columns}
  features={{
    selection: { enabled: true, mode: 'multiple' }
  }}
/>

// Single selection
<DataTable
  features={{
    selection: { enabled: true, mode: 'single' }
  }}
/>

// Conditional selection
<DataTable
  features={{
    selection: {
      enabled: true,
      getCanSelect: (row) => row.original.status === 'active',
    }
  }}
/>

// Controlled selection
const [rowSelection, setRowSelection] = useState({});

<DataTable
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
/>

// Get selected rows
const selectedRows = table.getSelectedRowModel().rows;
```

### Grouping & Aggregation

```tsx
// Enable grouping
<DataTable
  features={{
    grouping: { enabled: true },
  }}
/>;

// Column with aggregation
const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "category",
    header: "Category",
    enableGrouping: true,
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ getValue }) => `$${getValue()}`,
    aggregationFn: "sum",
    aggregatedCell: ({ getValue }) => `Total: $${getValue()}`,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + row.original.revenue, 0);
      return `Grand Total: $${total}`;
    },
  },
];

// Built-in aggregation functions: sum, count, mean, min, max, extent, unique, uniqueCount
```

### Row Expansion

```tsx
// Sub-rows (hierarchical data)
interface Employee {
  id: string;
  name: string;
  role: string;
  subordinates?: Employee[];
}

<DataTable
  data={employees}
  columns={columns}
  getSubRows={(row) => row.subordinates}
  features={{
    expansion: { enabled: true }
  }}
/>

// Custom detail panel
<DataTable
  renderExpandedRow={(row) => (
    <div className="p-4 bg-muted">
      <h4>Details for {row.original.name}</h4>
      <p>{row.original.bio}</p>
    </div>
  )}
  features={{
    expansion: { enabled: true }
  }}
/>

// Conditional expansion
<DataTable
  features={{
    expansion: {
      enabled: true,
      getCanExpand: (row) => row.original.hasDetails,
    }
  }}
/>
```

### Server-Side Operations

Delegate all operations to server for massive datasets:

```tsx
import { useDebounce } from "@one-portal/ui";

function ServerSideTable() {
  const [data, setData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleFetch = useCallback(async (params: ServerSideParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(params),
      });

      const result: ServerSideResponse<User> = await response.json();

      setData(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataTable
      data={data}
      columns={columns}
      features={{
        pagination: { enabled: true, pageSize: 25 },
        sorting: { enabled: true },
        filters: { enabled: true },
        serverSide: {
          enabled: true,
          totalCount,
          loading,
          error,
          onFetch: handleFetch,
        },
      }}
    />
  );
}

// With debounced search
function DebouncedServerTable() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // Fetch with debounced search value
  }, [debouncedSearch]);

  // ...
}
```

### Persistence

Auto-save and restore table state to localStorage:

```tsx
// Auto-persist everything
<DataTable
  persistState={true}
  stateKey="users-table"
/>

// Selective persistence - only save specific state
<DataTable
  persistState={{
    include: ['columnVisibility', 'columnSizing', 'sorting'],
  }}
  stateKey="users-table"
/>

// Exclude specific state
<DataTable
  persistState={{
    exclude: ['globalFilter'], // Don't persist search
  }}
  stateKey="users-table"
/>

// Manual persistence control
import { usePersistence } from '@one-portal/ui';

const { state, setState, clearState } = usePersistence({
  key: 'users-table',
  include: ['columnVisibility', 'sorting'],
});

// Clear persisted state
<Button onClick={clearState}>Reset Table</Button>
```

### States & Loading

```tsx
// Custom empty state
<DataTable
  ui={{
    emptyState: (
      <div className="text-center p-8">
        <h3>No users found</h3>
        <Button onClick={handleAdd}>Add User</Button>
      </div>
    ),
  }}
/>

// Loading skeleton
<DataTable
  ui={{
    loadingState: 'skeleton',
  }}
  features={{
    serverSide: {
      enabled: true,
      loading: isLoading,
      // ...
    },
  }}
/>

// Custom error state
<DataTable
  ui={{
    errorState: (
      <div className="text-center p-8 text-destructive">
        <p>Failed to load data</p>
        <Button onClick={handleRetry}>Retry</Button>
      </div>
    ),
  }}
  features={{
    serverSide: {
      enabled: true,
      error: error,
      // ...
    },
  }}
/>

// Use built-in state components
import { EmptyState, LoadingState, ErrorState } from '@one-portal/ui';

<DataTable
  ui={{
    emptyState: (
      <EmptyState
        title="No Data"
        description="Add your first item to get started"
        action={{ label: 'Add Item', onClick: handleAdd }}
      />
    ),
  }}
/>
```

---

## Advanced Usage

### Custom Cell Rendering

```tsx
import { Badge, Avatar, Progress } from "@one-portal/ui";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.avatar} />
        <AvatarFallback>{row.original.name[0]}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <Progress value={getValue() as number} className="w-24" />
        <span className="text-xs">{getValue()}%</span>
      </div>
    ),
  },
];
```

### Using Hooks for Advanced Control

```tsx
import { useDataTable } from "@one-portal/ui";

function AdvancedTable() {
  const table = useDataTable({
    data,
    columns,
    features: {
      sorting: { enabled: true },
      filters: { enabled: true },
      pagination: { enabled: true },
    },
  });

  // Access table instance
  const selectedRows = table.getSelectedRowModel().rows;
  const filteredRows = table.getFilteredRowModel().rows;
  const totalRows = table.getRowModel().rows.length;

  // Custom controls
  const handleExport = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCSV(data);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          Showing {filteredRows.length} of {totalRows} rows
          {selectedRows.length > 0 && ` (${selectedRows.length} selected)`}
        </div>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>

      <DataTable table={table} />
    </div>
  );
}
```

### Composing Custom Layouts

```tsx
import {
  DataTable,
  DataTableToolbar,
  TablePagination,
  ViewOptions,
} from "@one-portal/ui";

function CustomLayout() {
  const table = useDataTable({ data, columns, features });

  return (
    <div className="space-y-4">
      {/* Custom toolbar */}
      <div className="flex justify-between">
        <DataTableToolbar table={table} />
        <div className="flex gap-2">
          <Button onClick={handleAdd}>Add User</Button>
          <ViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <DataTable table={table} />

      {/* Custom footer */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total: {table.getRowModel().rows.length} rows
        </div>
        <TablePagination table={table} />
      </div>
    </div>
  );
}
```

### Custom Filter Functions

```tsx
import { customFilterFns } from "@one-portal/ui";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "tags",
    header: "Tags",
    filterFn: customFilterFns.arrIncludesSome,
  },
  {
    accessorKey: "price",
    header: "Price",
    filterFn: customFilterFns.inNumberRange,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    filterFn: customFilterFns.inDateRange,
  },
];
```

---

## TypeScript

DataTable V2 is fully typed with TypeScript generics:

```typescript
import type {
  DataTableProps,
  ColumnDef,
  ColumnMeta,
  FeaturesConfig,
  ServerSideParams,
  ServerSideResponse,
  TableState,
  RowAction,
  BulkAction,
} from "@one-portal/ui";

// Infer data type from columns
type InferDataType<T> = T extends ColumnDef<infer U>[] ? U : never;

// Type-safe column definitions
const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
] as const satisfies ColumnDef<User>[];

// Type-safe feature config
const features: FeaturesConfig = {
  sorting: { enabled: true },
  filters: { enabled: true },
  pagination: { enabled: true },
};

// Type-safe actions
const rowActions: RowAction<User>[] = [
  {
    label: "Edit",
    onClick: (row) => {
      // row.original is typed as User
      console.log(row.original.name);
    },
  },
];
```

---

## Examples

Comprehensive examples available in Storybook:

```bash
pnpm storybook
```

Navigate to **DataTable V2** to see:

- 01-Basic-Features (sorting, pagination, search)
- 02-Column-Customization (custom renderers, formatting)
- 03-Filtering (toolbar, inline, faceted modes)
- 04-Column-Features (resize, reorder, pin, hide)
- 05-Selection-And-Actions (row selection, bulk actions)
- 06-Density-And-Variants (compact, bordered, striped, dark mode)
- 07-Real-World-Examples (users, products, orders, transactions)
- 08-Column-Features (advanced column controls)
- 09-Grouping-And-Aggregation (grouped rows, aggregated values, footer)
- 10-Row-Expansion (sub-rows, detail panels)
- 11-States (empty, loading, error, no results)
- 12-Persistence (localStorage, selective persistence)
- 13-Custom-Cell-Rendering (badges, avatars, progress bars, images)
- 14-Server-Side (pagination, sorting, filtering, errors, performance)

---

## Performance Tips

1. **Memoize columns**: Use `useMemo` for column definitions to prevent re-renders
2. **Virtualization**: For 10,000+ rows, consider implementing virtualization (Phase 7)
3. **Server-side mode**: For massive datasets, use server-side operations
4. **Debounce search**: Use `useDebounce` hook for search inputs
5. **Selective persistence**: Only persist state you need with `include`/`exclude`

---

## Troubleshooting

### Table not updating after data changes

- Ensure data reference changes (use `[...data]` or `setState`)
- Check if controlled state is blocking updates

### Filters not working

- Verify `enableColumnFilter` is not `false` on column
- Check filter function matches data type
- Ensure `features.filters.enabled` is `true`

### Persistence not working

- Verify `stateKey` is provided and unique
- Check browser localStorage is enabled
- Ensure OnePortal localStorage namespace is correct

### Server-side pagination showing wrong count

- Verify `totalCount` from server matches actual total
- Check `pageCount` calculation in server response
- Ensure `manual` flags are set correctly

---

## Migration from V1

DataTable V2 is a complete rewrite with breaking changes. V1 is deprecated.

Key differences:

- Column definitions now use TanStack Table v8 format
- Feature configuration moved to `features` prop
- Actions split into `row` and `bulk` actions
- Persistence configuration simplified
- State management improved with full controlled/uncontrolled support

Since V1 is not in use, there is no migration path needed.

---

## Support

For issues, questions, or feature requests:

- Check Storybook examples first
- Review this documentation
- Check DATATABLE_V2_PROGRESS.md for known issues
- Ask in team chat

---

## License

Part of OnePortal UI package - Internal use only.
