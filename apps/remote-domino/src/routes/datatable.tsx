import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/datatable")({
  component: DataTablePage,
});

function DataTablePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">DataTable Component</h1>
        <p className="text-muted-foreground text-lg">
          A simplified abstraction layer over TanStack Table
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is DataTable V2?</CardTitle>
          <CardDescription>Understanding the abstraction layer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <strong>DataTable V2</strong> is a powerful React component that
            wraps TanStack Table and provides a simplified API for common table
            features. Instead of writing hundreds of lines of boilerplate code,
            you can create feature-rich tables with just a few props.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h3 className="font-semibold text-sm mb-2">
              Why Use DataTable V2?
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>Simplified API</strong> - Enable features with boolean
                props
              </li>
              <li>
                <strong>Less Boilerplate</strong> - No need to manage table
                state manually
              </li>
              <li>
                <strong>Built-in Features</strong> - Sorting, filtering,
                pagination out of the box
              </li>
              <li>
                <strong>Customizable</strong> - Extensive configuration options
              </li>
              <li>
                <strong>Accessible</strong> - ARIA attributes and keyboard
                navigation
              </li>
              <li>
                <strong>Type-Safe</strong> - Full TypeScript support
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 text-red-500">
                Without DataTable V2
              </h4>
              <div className="bg-muted rounded-md p-3 text-xs text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Manually manage sorting state</li>
                  <li>• Manually manage filter state</li>
                  <li>• Manually manage pagination state</li>
                  <li>• Write custom filter UI components</li>
                  <li>• Handle column visibility manually</li>
                  <li>• ~300+ lines of code</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 text-green-500">
                With DataTable V2
              </h4>
              <div className="bg-muted rounded-md p-3 text-xs">
                <ul className="space-y-1">
                  <li>• enableSorting={"{true}"}</li>
                  <li>• enableFilters={"{true}"}</li>
                  <li>• enablePagination={"{true}"}</li>
                  <li>• Built-in faceted filters</li>
                  <li>• Built-in column visibility</li>
                  <li>• ~50 lines of code</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>
            Where to find the DataTable component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
            <div>packages/ui/src/data-table-v2/</div>
            <div className="ml-4">
              ├── DataTable.tsx{" "}
              <span className="text-muted-foreground">→ Main component</span>
            </div>
            <div className="ml-4">├── components/</div>
            <div className="ml-8 text-muted-foreground">
              │ ├── DataTableToolbar.tsx → Filters, search, controls
            </div>
            <div className="ml-8 text-muted-foreground">
              │ ├── FacetedFilter.tsx → Multi-select filter
            </div>
            <div className="ml-8 text-muted-foreground">
              │ ├── ColumnHeader.tsx → Sortable column headers
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── DataTablePagination → Pagination controls
            </div>
            <div className="ml-4">├── hooks/</div>
            <div className="ml-8 text-muted-foreground">
              │ ├── useDataTable.ts → Main table hook
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── usePersistence.ts → State persistence
            </div>
            <div className="ml-4">├── utils/</div>
            <div className="ml-8 text-muted-foreground">
              │ └── columnUtils.tsx → Column helper utilities
            </div>
            <div className="ml-4">
              └── types.ts{" "}
              <span className="text-muted-foreground">→ TypeScript types</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Import the component from{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded">
              @one-portal/ui
            </code>
            :
          </p>
          <div className="bg-muted rounded-md p-3 font-mono text-xs mt-2">
            import {"{ DataTable }"} from '@one-portal/ui';
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Usage</CardTitle>
          <CardDescription>Creating your first table</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Simple Example</h3>
            <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">
                // Define your data type
              </div>
              <div>type User = {"{"}</div>
              <div> id: string;</div>
              <div> name: string;</div>
              <div> email: string;</div>
              <div> role: string;</div>
              <div>{"}"}</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">// Define columns</div>
              <div>const columns: ColumnDef{"<User>"}[] = [</div>
              <div> {"{"}</div>
              <div> accessorKey: 'name',</div>
              <div> header: 'Name',</div>
              <div> {"}"},</div>
              <div> {"{"}</div>
              <div> accessorKey: 'email',</div>
              <div> header: 'Email',</div>
              <div> {"}"},</div>
              <div> {"{"}</div>
              <div> accessorKey: 'role',</div>
              <div> header: 'Role',</div>
              <div> {"}"},</div>
              <div>];</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">// Render table</div>
              <div>{"<DataTable"}</div>
              <div> data={"{users}"}</div>
              <div> columns={"{columns}"}</div>
              <div> enableSorting</div>
              <div> enableFilters</div>
              <div> enablePagination</div>
              <div>{"/>"}</div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">That's it!</p>
            <p className="text-xs text-muted-foreground">
              With just a few props, you get a fully functional table with
              sorting, filtering, and pagination. No need to manage state or
              write custom UI components.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Features</CardTitle>
          <CardDescription>What you can do with DataTable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Sorting</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Click column headers to sort. Supports multi-column sorting.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableSorting={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Filtering</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Global search and column-specific filters. Supports text,
                select, multi-select, and date ranges.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableFilters={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Pagination</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Client-side pagination with page size controls. Supports
                server-side pagination too.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enablePagination={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Column Visibility</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Show/hide columns with dropdown menu.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableColumnVisibility={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Row Selection</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Select single or multiple rows with checkboxes.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableRowSelection={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Column Pinning</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Pin columns to left or right side with directional shadows.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableColumnPinning={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Column Resizing</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Drag column borders to resize.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableColumnResizing={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">State Persistence</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Save table state to localStorage (sorting, filters, column
                visibility, etc.)
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                persistState={"{true}"} stateKey="my-table"
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">
                Grouping & Aggregation
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Group rows by column values with aggregate functions (sum,
                count, avg, etc.)
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableGrouping={"{true}"}
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Row Expansion</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Expand rows to show additional details.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                enableRowExpansion={"{true}"}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
          <CardDescription>More powerful capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">
              Custom Cell Renderers
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              Customize how cells are displayed (badges, avatars, formatted
              dates, etc.)
            </p>
            <div className="bg-muted rounded-md p-2 font-mono text-[10px] mt-2">
              cell: ({"{row}"}) ={">"} {"<Badge>{row.original.status}</Badge>"}
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">Inline Editing</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Edit cells directly in the table with validation.
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              enableInlineEdit={"{true}"}
            </code>
          </div>

          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">
              Server-Side Operations
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              Handle sorting, filtering, and pagination on the server for large
              datasets.
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              manualSorting={"{true}"} manualFiltering={"{true}"}
            </code>
          </div>

          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">
              Empty States & Loading
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              Built-in states for loading, empty, and error conditions.
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              isLoading={"{isLoading}"} emptyMessage="No data"
            </code>
          </div>

          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">Density Control</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Adjust row height and spacing (comfortable, normal, compact)
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              density="compact"
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation & Examples</CardTitle>
          <CardDescription>Where to learn more</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Storybook Examples</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                pnpm storybook
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              The best place to see DataTable in action. Includes 15+
              interactive examples demonstrating all features with real data.
            </p>
            <div className="bg-muted rounded-md p-3 mt-2">
              <p className="text-xs font-semibold mb-1">Featured Stories</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Basic Features - Sorting, filtering, pagination</li>
                <li>• Column Features - Resizing, reordering, pinning</li>
                <li>• Selection & Actions - Row selection, bulk actions</li>
                <li>• Server-Side - Handling large datasets</li>
                <li>• Grouping - Aggregations and grouping</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">TanStack Table Docs</h3>
              <a
                href="https://tanstack.com/table"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-xs"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              For advanced use cases, refer to TanStack Table documentation.
              DataTable V2 is a wrapper around TanStack Table, so all core
              concepts apply.
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold">Source Code</h3>
            <p className="text-sm text-muted-foreground">
              The DataTable component is fully commented and documented. Read
              the source code in{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                packages/ui/src/data-table-v2/
              </code>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Quick Tips</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Start simple - enable basic features first, then add advanced ones
          </li>
          <li>• Check Storybook for copy-paste examples</li>
          <li>• Use TypeScript for column definitions to get autocompletion</li>
          <li>• Enable state persistence to remember user preferences</li>
          <li>
            • For large datasets (&gt;10,000 rows), use server-side operations
          </li>
        </ul>
      </div>
    </div>
  );
}
