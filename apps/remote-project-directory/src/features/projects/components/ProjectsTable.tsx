import { useState, useEffect } from "react";
import { DataTable } from "@one-portal/ui";
import { useProjects } from "../../../hooks/useProjects";
import { projectColumns } from "../columns/projectColumns";
import { Loader2 } from "lucide-react";
import { ProjectFilters } from "./ProjectFilters";

export function ProjectsTable() {
  const {
    projects,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalCount,
    setFilters,
  } = useProjects();

  // Client-side pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Hybrid Pagination Logic:
  // Check if we are near the end of the currently loaded data.
  // If so, trigger fetchNextPage to load more data from the server.
  useEffect(() => {
    const { pageIndex, pageSize } = pagination;
    const totalLoaded = projects.length;
    const totalPagesLoaded = Math.ceil(totalLoaded / pageSize);

    // If we are on the last page of loaded data, and there is more on server
    if (
      pageIndex >= totalPagesLoaded - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    pagination,
    projects.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div className="space-y-4">
      {/* Server-side Filters */}
      <ProjectFilters
        onFilter={(newFilters) => {
          setFilters(newFilters);
          setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset pagination on filter
        }}
      />

      <DataTable
        data={projects}
        columns={projectColumns}
        isLoading={isLoading}
        error={error ? (error as Error) : null}
        state={{
          pagination,
        }}
        features={{
          pagination: {
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 50],
            autoResetPageIndex: false, // Prevent reset on data update (requires library support)
            onChange: setPagination,
            pageCount: Math.ceil(totalCount / pagination.pageSize),
            rowCount: totalCount,
            showFirstLastButtons: false,
          },
          // Disable client-side filtering as we are using server-side filters
          filtering: {
            enabled: false,
            mode: "faceted",
          },
          serverSide: {
            enabled: false, // Disable server-side mode to keep client features
            totalCount: 0, // Required by type even if disabled
          },
        }}
        ui={{
          showToolbar: true, // Keep toolbar for global search if needed, or set to false
          loadingMessage: "Loading projects...",
          emptyMessage: "No projects found.",
        }}
      />

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading more projects...
          </span>
        </div>
      )}
    </div>
  );
}
