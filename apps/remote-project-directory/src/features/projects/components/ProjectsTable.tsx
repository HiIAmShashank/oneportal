import { useState, useEffect, useMemo, useCallback } from "react";
import {
  type ColumnFiltersState,
  DataTable,
  type FeaturesConfig,
} from "@one-portal/ui";
import { useProjects } from "../../../hooks/useProjects";
import { getProjectColumns } from "../columns/projectColumns";
import { ProjectFilters } from "./ProjectFilters";
import { type Project } from "../../../api/types";
import { ProjectDetailsDrawer } from "./ProjectDetailsDrawer";
import { useOptionSets } from "../../../hooks/useOptionSets";

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

  const { data: optionSets } = useOptionSets();

  // State for the details drawer
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Client-side pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Client-side filter state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // Reset pagination when client-side filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters, globalFilter]);

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

  const columns = useMemo(() => getProjectColumns(optionSets), [optionSets]);

  // Memoize features config to prevent re-renders
  const features: FeaturesConfig<Project> = useMemo(
    () => ({
      pagination: {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
        autoResetPageIndex: false,
        onChange: setPagination,
        // If filters are applied, let table handle pageCount (set to undefined)
        // Otherwise, use server totalCount
        pageCount:
          columnFilters.length > 0 || globalFilter
            ? undefined
            : Math.ceil(totalCount / pagination.pageSize),
        rowCount:
          columnFilters.length > 0 || globalFilter ? undefined : totalCount,
        showFirstLastButtons: false,
      },
      filtering: {
        mode: "faceted",
        enabled: true,
        // Pass filter state control
        onChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
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
    [totalCount, pagination.pageSize, columnFilters.length, globalFilter],
  );

  const persistence = useMemo(
    () => ({
      enabled: true,
      key: "remote-project-directory-projects-table",
    }),
    [],
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
      columnFilters,
      globalFilter,
    }),
    [pagination, columnFilters, globalFilter],
  );

  return (
    <div className="space-y-4">
      {/* Server-side Filters */}
      <ProjectFilters
        onFilter={(newFilters) => {
          setFilters(newFilters);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
        optionSets={optionSets}
      />

      <DataTable
        data={projects}
        columns={columns}
        isLoading={isLoading}
        error={error ? (error as Error) : null}
        state={tableState}
        features={features}
        persistence={persistence}
        ui={ui}
        onRowClick={handleRowClick}
      />

      {/* Project Details Drawer */}
      <ProjectDetailsDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}
