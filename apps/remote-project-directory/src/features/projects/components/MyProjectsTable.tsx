import { useMemo, useState, useCallback } from "react";
import {
  DataTable,
  type FeaturesConfig,
  type ColumnFiltersState,
} from "@one-portal/ui";
import { type Project } from "../../../api/types";
import { projectColumns } from "../columns/projectColumns";
import { ProjectDetailsDrawer } from "./ProjectDetailsDrawer";

interface MyProjectsTableProps {
  projects: Project[];
}

// Default visibility configuration
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

export function MyProjectsTable({ projects }: MyProjectsTableProps) {
  // Client-side state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle row click to open drawer
  const handleRowClick = useCallback((row: Project) => {
    setSelectedProject(row);
    setIsDrawerOpen(true);
  }, []);

  // Handle drawer close
  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
  }, []);

  const features: FeaturesConfig<Project> = useMemo(
    () => ({
      pagination: {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50],
        showFirstLastButtons: false,
      },
      filtering: {
        mode: "faceted",
        enabled: true,
        onChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
      },
      sorting: {
        enabled: true,
        multi: true,
      },
      columns: {
        initialVisibility: DEFAULT_VISIBILITY,
        resizing: true,
        pinning: true,
      },
    }),
    [],
  );

  const persistence = useMemo(
    () => ({
      enabled: true,
      key: "remote-project-directory-my-projects-table",
    }),
    [],
  );

  const ui = useMemo(
    () => ({
      showToolbar: true,
      loadingMessage: "Loading your projects...",
      emptyMessage: "You haven't favorited any projects yet.",
      showColumnFilters: true,
    }),
    [],
  );

  const tableState = useMemo(
    () => ({
      columnFilters,
      globalFilter,
    }),
    [columnFilters, globalFilter],
  );

  return (
    <div className="space-y-4">
      <DataTable
        data={projects}
        columns={projectColumns}
        features={features}
        persistence={persistence}
        ui={ui}
        state={tableState}
        onRowClick={handleRowClick}
      />

      <ProjectDetailsDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}
