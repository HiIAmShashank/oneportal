import { type ColumnDef } from "@one-portal/ui/data-table-v2";
import { type Project } from "../../../api/types";
import { Badge } from "@one-portal/ui";
import { FavoriteButton } from "../components/FavoriteButton";

// Helper to format currency
const formatCurrency = (amount?: number, currency = "GBP") => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Helper to format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString();
};

export const projectColumns: ColumnDef<Project>[] = [
  {
    id: "favorite",
    header: "",
    maxSize: 30,
    minSize: 30,
    size: 30,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <FavoriteButton
          projectId={row.original.id}
          isFavourite={row.original.isFavourite}
          projectName={row.original.projectName}
        />
      </div>
    ),
    enablePinning: false,
    enableSorting: false,
    enableHiding: false,
    meta: {
      cellClassName: "px-1",
      headerClassName: "px-1",
    },
  },
  {
    accessorKey: "projectNumber",
    header: "Project Number",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "clientName",
    header: "Client",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "clientNumber",
    header: "Client Number",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "projectManager",
    header: "Project Manager",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "projectStatus",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "Active", value: "Active" },
        { label: "Closed", value: "Closed" },
      ],
    },
  },
  {
    accessorKey: "expectedEndDate",
    header: "End Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
    meta: { filterVariant: "date" },
  },
  // --- Extended Columns ---
  {
    accessorKey: "description",
    header: "Description",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "accountLeader",
    header: "Account Leader",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "projectPrincipal",
    header: "Project Principal",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "project_Director",
    header: "Project Director",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
    meta: { filterVariant: "date" },
  },
  {
    accessorKey: "actualEndDate",
    header: "Actual End Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
    meta: { filterVariant: "date" },
  },
  {
    accessorKey: "projectType",
    header: "Project Type",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "contractType",
    header: "Contract Type",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "mainOrSubProject",
    header: "Main/Sub",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "projectOpenOrClosed",
    header: "Open/Closed",
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "wonOrLost",
    header: "Won/Lost",
    meta: { filterVariant: "select" },
  },
  {
    accessorKey: "approvalState",
    header: "Approval State",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "unitCode",
    header: "Unit Code",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "divisionCode",
    header: "Division Code",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "regionCode",
    header: "Region Code",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "countryName",
    header: "Country",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "baseCurrencyCode",
    header: "Currency",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "grossFeeAtCAAP_GBP",
    header: "Gross Fee (GBP)",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
    meta: { filterVariant: "number" },
  },
  {
    accessorKey: "portfolioCode",
    header: "Portfolio Code",
    meta: { filterVariant: "text" },
  },
  {
    accessorKey: "parentProjectName",
    header: "Parent Project",
    meta: { filterVariant: "text" },
  },
];
