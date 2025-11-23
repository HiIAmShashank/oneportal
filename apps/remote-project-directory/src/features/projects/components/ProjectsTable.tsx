import { useState, useEffect, useMemo, useCallback } from "react";
import { DataTable, type FeaturesConfig } from "@one-portal/ui";
import { useProjects } from "../../../hooks/useProjects";
import { projectColumns } from "../columns/projectColumns";
import { Loader2 } from "lucide-react";
import { ProjectFilters } from "./ProjectFilters";
import { type Project } from "../../../api/types";
import { ProjectDetailsDrawer } from "./ProjectDetailsDrawer";

// Default visibility configuration - defined outside component for stability
const DEFAULT_VISIBILITY = {
  // Default Visible
  projectNumber: true,
  projectName: true,
  clientName: true,
  projectManager: true,
  projectStatus: true,
  expectedEndDate: true,
  favorite: true,

  // Default Hidden
  description: false,
  accountLeader: false,
  projectPrincipal: false,
  project_Director: false,
  startDate: false,
  actualEndDate: false,
  projectType: false,
  contractType: false,
  mainOrSubProject: false,
  projectOpenOrClosed: false,
  wonOrLost: false,
  approvalState: false,
  unitCode: false,
  divisionCode: false,
  regionCode: false,
  countryName: false,
  baseCurrencyCode: false,
  grossFeeAtCAAP_GBP: false,
  portfolioCode: false,
  parentProjectName: false,
  clientNumber: false,
};

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

  // State for the details drawer
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Client-side pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Handle row click to open drawer
  const handleRowClick = useCallback((row: Project) => {
    setSelectedProject(row);
    setIsDrawerOpen(true);
  }, []);

  // Handle drawer close
  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      // Optional: clear selection after animation, or keep it
      // keeping it allows smoother reopening if needed, but we'll clear for now
      // setTimeout(() => setSelectedProject(null), 300);
    }
  }, []);

  // Hybrid Pagination Logic:
  useEffect(() => {
    const { pageIndex, pageSize } = pagination;
    const totalLoaded = projects.length;
    const totalPagesLoaded = Math.ceil(totalLoaded / pageSize);

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

  // Memoize features config to prevent re-renders
  const features: FeaturesConfig<Project> = useMemo(
    () => ({
      pagination: {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
        autoResetPageIndex: false,
        onChange: setPagination,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        rowCount: totalCount,
        showFirstLastButtons: false,
      },
      filters: {
        mode: "inline",
        enabled: true,
      },
      serverSide: {
        enabled: false,
        totalCount: totalCount,
      },
      columns: {
        initialVisibility: DEFAULT_VISIBILITY,
        resizing: true,
        pinning: true,
      },
    }),
    [totalCount, pagination.pageSize],
  );

  // Memoize UI config
  const ui = useMemo(
    () => ({
      showToolbar: true,
      loadingMessage: "Loading projects...",
      emptyMessage: "No projects found.",
      showColumnFilters: true, // Using external filters
    }),
    [],
  );

  // Memoize state to prevent re-renders
  const tableState = useMemo(
    () => ({
      pagination,
    }),
    [pagination],
  );

  return (
    <div className="space-y-4">
      {/* Server-side Filters */}
      <ProjectFilters
        onFilter={(newFilters) => {
          setFilters(newFilters);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      />

      <DataTable
        data={projects}
        columns={projectColumns}
        isLoading={isLoading}
        error={error ? (error as Error) : null}
        state={tableState}
        features={features}
        ui={ui}
        onRowClick={handleRowClick}
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

      {/* Project Details Drawer */}
      <ProjectDetailsDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}
