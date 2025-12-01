import { type ColumnDef } from "@one-portal/ui/data-table-v2";
import { type Project, type OptionSetsResponse } from "../../../api/types";
import { Badge } from "@one-portal/ui";
import { FavoriteButton } from "../components/FavoriteButton";
import { CopyableCell } from "../components/CopyableCell";
import { LinkCell } from "../components/LinkCell";
import { SharePointIcon } from "../components/SharePointIcon";
import { UserAvatar } from "../../../components/UserAvatar";

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

export const getProjectColumns = (
  optionSets?: OptionSetsResponse,
): ColumnDef<Project>[] => {
  const divisionOptions =
    optionSets?.divisionCode.map((code) => ({ label: code, value: code })) ||
    [];
  const unitOptions =
    optionSets?.unitCode.map((code) => ({ label: code, value: code })) || [];
  const regionOptions =
    optionSets?.regionCode.map((code) => ({ label: code, value: code })) || [];
  const statusOptions =
    optionSets?.projectStatus.map((status) => ({
      label: status,
      value: status,
    })) || [];
  const openClosedOptions =
    optionSets?.projectOpenOrClosed.map((status) => ({
      label: status,
      value: status,
    })) || [];

  return [
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
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "clientNumber",
      header: "Client Number",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "projectManager",
      header: "Project Manager",
      cell: ({ row, getValue }) => (
        <UserAvatar
          name={getValue() as string}
          email={row.original.projectManagerEmail}
          showName
        />
      ),
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "projectStatus",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <CopyableCell
            value={status}
            displayValue={
              <Badge variant={status === "Active" ? "default" : "secondary"}>
                {status}
              </Badge>
            }
          />
        );
      },
      meta: {
        filterVariant: "select",
        filterOptions: statusOptions,
      },
    },
    {
      accessorKey: "expectedEndDate",
      header: "End Date",
      cell: ({ getValue }) => (
        <CopyableCell value={formatDate(getValue() as string)} />
      ),
      meta: { filterVariant: "date" },
    },
    // --- Extended Columns ---
    {
      accessorKey: "projectSharepointSite_url",
      header: "SharePoint Site",
      cell: ({ getValue }) => (
        <LinkCell
          url={getValue() as string}
          label="Open Site"
          icon={SharePointIcon}
        />
      ),
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "accountLeader",
      header: "Account Leader",
      cell: ({ row, getValue }) => (
        <UserAvatar
          name={getValue() as string}
          email={row.original.accountLeaderEmail}
          showName
        />
      ),
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "projectPrincipal",
      header: "Project Principal",
      cell: ({ row, getValue }) => (
        <UserAvatar
          name={getValue() as string}
          email={row.original.projectPrincipalEmail}
          showName
        />
      ),
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "project_Director",
      header: "Project Director",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ getValue }) => (
        <CopyableCell value={formatDate(getValue() as string)} />
      ),
      meta: { filterVariant: "date" },
    },
    {
      accessorKey: "actualEndDate",
      header: "Actual End Date",
      cell: ({ getValue }) => (
        <CopyableCell value={formatDate(getValue() as string)} />
      ),
      meta: { filterVariant: "date" },
    },
    {
      accessorKey: "projectType",
      header: "Project Type",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "contractType",
      header: "Contract Type",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "mainOrSubProject",
      header: "Main/Sub",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "projectOpenOrClosed",
      header: "Open/Closed",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "select", filterOptions: openClosedOptions },
    },
    {
      accessorKey: "wonOrLost",
      header: "Won/Lost",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: {
        filterVariant: "select",
        filterOptions: [
          { label: "Won", value: "Won" },
          { label: "Lost", value: "Lost" },
        ], // Assuming these are static or handled elsewhere if not in optionsets
      },
    },
    {
      accessorKey: "approvalState",
      header: "Approval State",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "unitCode",
      header: "Unit Code",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text", filterOptions: unitOptions },
    },
    {
      accessorKey: "divisionCode",
      header: "Division Code",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text", filterOptions: divisionOptions },
    },
    {
      accessorKey: "regionCode",
      header: "Region Code",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text", filterOptions: regionOptions },
    },
    {
      accessorKey: "countryName",
      header: "Country",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "baseCurrencyCode",
      header: "Currency",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "grossFeeAtCAAP_GBP",
      header: "Gross Fee (GBP)",
      cell: ({ getValue }) => (
        <CopyableCell value={formatCurrency(getValue() as number)} />
      ),
      meta: { filterVariant: "number" },
    },
    {
      accessorKey: "portfolioCode",
      header: "Portfolio Code",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
    {
      accessorKey: "parentProjectName",
      header: "Parent Project",
      cell: ({ getValue }) => <CopyableCell value={getValue() as string} />,
      meta: { filterVariant: "text" },
    },
  ];
};
