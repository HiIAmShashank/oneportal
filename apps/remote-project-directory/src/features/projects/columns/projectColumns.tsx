import { type ColumnDef } from "@one-portal/ui/data-table-v2";
import { type Project } from "../../../api/types";
import { Badge } from "@one-portal/ui";

export const projectColumns: ColumnDef<Project>[] = [
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
