import { type ColumnDef } from "@one-portal/ui/data-table-v2";
import { type Project } from "../../../api/types";
import { Badge } from "@one-portal/ui";
import { FavoriteButton } from "../components/FavoriteButton";

export const projectColumns: ColumnDef<Project>[] = [
  {
    id: "favorite",
    header: "",
    maxSize: 20,
    enableResizing: false,
    cell: ({ row }) => (
      <FavoriteButton
        projectId={row.original.id}
        isFavourite={row.original.isFavourite}
        projectName={row.original.projectName}
      />
    ),
    enablePinning: false,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectNumber",
    header: "Project Number",
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "clientName",
    header: "Client",
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "projectManager",
    header: "Project Manager",
    meta: {
      filterVariant: "text",
    },
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
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
    meta: {
      filterVariant: "date",
    },
  },
];
