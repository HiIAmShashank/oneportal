/**
 * DataTable V2 - Server-Side Operations Stories
 *
 * Demonstrates server-side pagination, sorting, and filtering.
 * All data operations are handled by a mock server API with realistic delays.
 */

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DataTable,
  type ServerSideParams,
  useDebounce,
} from "@one-portal/ui/data-table-v2";
import { Badge } from "@one-portal/ui";
import {
  createMockServerAPI,
  createFastAPI,
  createSlowAPI,
  createUnreliableAPI,
} from "../../mocks/server-api";
import { generateUsers, type User } from "../../mocks/data-generators";
import { userColumns } from "../../mocks/column-definitions";

// =============================================================================
// META
// =============================================================================

const meta = {
  title: "DataTable V2/14-Server Side",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Server-side operations delegate pagination, sorting, and filtering to the server/API. This enables handling massive datasets (millions of rows) without performance degradation. All stories use a mock server API with realistic network delays.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// STORY 1: SERVER-SIDE PAGINATION
// =============================================================================

export const ServerSidePagination: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    // Generate large dataset (simulates server database)
    const allUsers = React.useMemo(() => generateUsers(1000), []);
    const mockAPI = React.useMemo(
      () => createMockServerAPI(allUsers),
      [allUsers],
    );

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">Server-Side Pagination</h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 1,000 rows | Network delay: 500ms | Only current page data
            is loaded
          </p>
        </div>

        <DataTable
          data={data}
          columns={userColumns.slice(0, 6)} // Simpler columns for clarity
          features={{
            pagination: {
              enabled: true,
              pageSize: 20,
              pageSizeOptions: [10, 20, 50, 100],
            },
            sorting: { enabled: false }, // Disabled for this story
            filters: { enabled: false }, // Disabled for this story
            serverSide: {
              enabled: true,
              totalCount,
              loading,
              error,
              onFetch: handleFetch,
            },
          }}
          ui={{
            showToolbar: true,
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
          "Basic server-side pagination with 1,000 rows. Only the current page (20 rows) is loaded from the server. Watch the skeleton loader during page navigation.",
      },
    },
  },
};

// =============================================================================
// STORY 2: SERVER-SIDE SORTING
// =============================================================================

export const ServerSideSorting: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const allUsers = React.useMemo(() => generateUsers(500), []);
    const mockAPI = React.useMemo(
      () => createMockServerAPI(allUsers),
      [allUsers],
    );

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">Server-Side Sorting</h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 500 rows | Network delay: 500ms | Click column headers to
            sort
          </p>
        </div>

        <DataTable
          data={data}
          columns={userColumns.slice(0, 6)}
          features={{
            pagination: {
              enabled: true,
              pageSize: 25,
            },
            sorting: {
              enabled: true,
              multi: false, // Single column sort for clarity
            },
            filters: { enabled: false },
            serverSide: {
              enabled: true,
              totalCount,
              loading,
              error,
              onFetch: handleFetch,
            },
          }}
          ui={{
            showToolbar: false,
            loadingState: "spinner",
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Server-side sorting demonstration. Click any column header to sort - the server sorts the data before returning the page. Notice the spinner during the sort operation.",
      },
    },
  },
};

// =============================================================================
// STORY 3: SERVER-SIDE FILTERING
// =============================================================================

export const ServerSideFiltering: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const allUsers = React.useMemo(() => generateUsers(800), []);
    const mockAPI = React.useMemo(
      () => createMockServerAPI(allUsers),
      [allUsers],
    );

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">Server-Side Filtering</h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 800 rows | Network delay: 500ms | Filters trigger server
            requests
          </p>
        </div>

        <DataTable
          data={data}
          columns={userColumns.slice(0, 6)}
          features={{
            pagination: {
              enabled: true,
              pageSize: 20,
            },
            sorting: { enabled: false },
            filters: {
              enabled: true,
              mode: "faceted",
              global: true,
              columns: true,
            },
            serverSide: {
              enabled: true,
              totalCount,
              loading,
              error,
              onFetch: handleFetch,
            },
          }}
          ui={{
            showToolbar: true,
            showGlobalSearch: true,
            showColumnFilters: true,
            filterMode: "toolbar",
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
          "Server-side filtering with global search and column filters. Each filter change triggers a new server request. Notice how the total count updates based on filtered results.",
      },
    },
  },
};

// =============================================================================
// STORY 4: SERVER-SIDE COMBINED (ALL OPERATIONS)
// =============================================================================

export const ServerSideCombined: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const allUsers = React.useMemo(() => generateUsers(2000), []);
    const mockAPI = React.useMemo(
      () => createMockServerAPI(allUsers),
      [allUsers],
    );

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">
            Server-Side: Pagination + Sorting + Filtering
          </h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 2,000 rows | All operations handled server-side | Realistic
            workflow
          </p>
          <div className="mt-2 flex gap-2 text-xs">
            <Badge variant="outline">
              Total: {totalCount.toLocaleString()}
            </Badge>
            <Badge variant="outline">Current Page: {data.length}</Badge>
            {loading && <Badge>Loading...</Badge>}
          </div>
        </div>

        <DataTable
          data={data}
          columns={userColumns}
          features={{
            pagination: {
              enabled: true,
              pageSize: 25,
              pageSizeOptions: [10, 25, 50, 100],
            },
            sorting: {
              enabled: true,
              multi: true,
            },
            filters: {
              enabled: true,
              mode: "faceted",
              global: true,
              columns: true,
            },
            columns: {
              enableResizing: true,
              enablePinning: true,
              enableVisibility: true,
            },
            serverSide: {
              enabled: true,
              totalCount,
              loading,
              error,
              onFetch: handleFetch,
            },
          }}
          ui={{
            showToolbar: true,
            showGlobalSearch: true,
            showColumnFilters: true,
            showViewOptions: true,
            filterMode: "toolbar",
            loadingState: "skeleton",
            density: "default",
            variant: "bordered",
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete server-side example with all operations: pagination, sorting (multi-column), and filtering (global + column). This represents a realistic production scenario with a 2,000 row dataset.",
      },
    },
  },
};

// =============================================================================
// STORY 5: SERVER-SIDE WITH ERRORS
// =============================================================================

export const ServerSideWithErrors: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [retryCount, setRetryCount] = React.useState(0);

    const allUsers = React.useMemo(() => generateUsers(300), []);
    const mockAPI = React.useMemo(
      () => createUnreliableAPI(allUsers), // 15% error rate
      [allUsers],
    );

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
          setRetryCount(0); // Reset on success
        } catch (err) {
          setError(err as Error);
          setRetryCount((c) => c + 1);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    const handleRetry = () => {
      // Trigger refetch by resetting state
      handleFetch({
        page: 0,
        pageSize: 20,
        sortBy: undefined,
        sortOrder: "asc",
        filters: {},
        globalFilter: undefined,
      });
    };

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">
            Server-Side with Error Handling
          </h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 300 rows | 15% error rate | Demonstrates error recovery
          </p>
          <div className="mt-2">
            <Badge variant={error ? "destructive" : "outline"}>
              {error ? `Error (Retry #${retryCount})` : "No errors"}
            </Badge>
          </div>
        </div>

        <DataTable
          data={data}
          columns={userColumns.slice(0, 6)}
          features={{
            pagination: {
              enabled: true,
              pageSize: 20,
            },
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
          ui={{
            showToolbar: true,
            loadingState: "spinner",
            errorState: error ? (
              <div className="text-center py-8">
                <p className="text-destructive font-medium">{error.message}</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90"
                >
                  Retry Request
                </button>
              </div>
            ) : undefined,
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates error handling in server-side mode. The unreliable API has a 15% failure rate. When errors occur, an error state is shown with a retry button. Click retry to attempt the request again.",
      },
    },
  },
};

// =============================================================================
// STORY 6: SERVER-SIDE PERFORMANCE (LARGE DATASET)
// =============================================================================

export const ServerSidePerformance: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    // Large dataset to demonstrate scalability
    const allUsers = React.useMemo(() => generateUsers(10000), []);
    const mockAPI = React.useMemo(() => createFastAPI(allUsers), [allUsers]); // Fast API (200ms)

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-green-500/10 border-green-500/20">
          <h3 className="font-semibold mb-2 text-green-700 dark:text-green-400">
            High Performance: 10,000 Rows
          </h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 10,000 rows | Fast API (200ms) | No client-side performance
            impact
          </p>
          <div className="mt-2 flex gap-2 text-xs">
            <Badge variant="outline" className="border-green-500/20">
              Total Rows: {totalCount.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="border-green-500/20">
              Loaded: {data.length}
            </Badge>
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">
              Fast API
            </Badge>
          </div>
        </div>

        <DataTable
          data={data}
          columns={userColumns}
          features={{
            pagination: {
              enabled: true,
              pageSize: 50,
              pageSizeOptions: [25, 50, 100, 200],
            },
            sorting: {
              enabled: true,
              multi: true,
            },
            filters: {
              enabled: true,
              mode: "faceted",
              global: true,
              columns: true,
            },
            columns: {
              enableResizing: true,
              enablePinning: true,
            },
            serverSide: {
              enabled: true,
              totalCount,
              loading,
              error,
              onFetch: handleFetch,
            },
          }}
          ui={{
            showToolbar: true,
            loadingState: "skeleton",
            density: "compact",
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Performance demonstration with 10,000 rows. Server-side mode enables handling massive datasets without any client-side performance degradation. Notice the fast response times (200ms) and smooth interactions.",
      },
    },
  },
};

// =============================================================================
// STORY 7: SERVER-SIDE WITH DEBOUNCED SEARCH
// =============================================================================

export const ServerSideWithDebounce: Story = {
  render: () => {
    const [data, setData] = React.useState<User[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [requestCount, setRequestCount] = React.useState(0);

    // Debounce search input to prevent excessive API calls
    const debouncedSearch = useDebounce(searchTerm, 500);

    const allUsers = React.useMemo(() => generateUsers(1500), []);
    const mockAPI = React.useMemo(() => createSlowAPI(allUsers), [allUsers]); // Slow API (1.5s)

    const handleFetch = React.useCallback(
      async (params: ServerSideParams) => {
        setLoading(true);
        setError(null);
        setRequestCount((c) => c + 1);
        try {
          const response = await mockAPI.fetchData(params);
          setData(response.data);
          setTotalCount(response.totalCount);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      [mockAPI],
    );

    // Trigger fetch when debounced search changes
    React.useEffect(() => {
      handleFetch({
        page: 0,
        pageSize: 25,
        sortBy: undefined,
        sortOrder: "asc",
        filters: {},
        globalFilter: debouncedSearch,
      });
    }, [debouncedSearch, handleFetch]);

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">Debounced Global Search</h3>
          <p className="text-sm text-muted-foreground">
            Dataset: 1,500 rows | Slow API (1.5s) | Search debounced by 500ms
          </p>
          <div className="mt-2 flex gap-2 text-xs">
            <Badge variant="outline">API Requests: {requestCount}</Badge>
            <Badge variant="outline">Search: {searchTerm || "none"}</Badge>
            {loading && <Badge>Searching...</Badge>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Global Search (Debounced 500ms)
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search... (waits 500ms after you stop typing)"
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground">
            INFO: Try typing quickly - the API is only called 500ms after you
            stop typing, preventing excessive requests
          </p>
        </div>

        <DataTable
          data={data}
          columns={userColumns.slice(0, 6)}
          features={{
            pagination: {
              enabled: true,
              pageSize: 25,
            },
            sorting: { enabled: true },
            filters: { enabled: false }, // Using custom search above
            serverSide: {
              enabled: true,
              totalCount,
              loading,
              error,
              onFetch: handleFetch,
            },
          }}
          ui={{
            showToolbar: false, // Hide toolbar, using custom search
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
          "Optimized server-side search with debouncing. The search input is debounced by 500ms, meaning the API is only called 500ms after you stop typing. This prevents excessive API requests and improves performance with slow APIs (1.5s delay). Notice the request count increases only when you pause typing.",
      },
    },
  },
};
