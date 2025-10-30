/**
 * BulkActions - Component for displaying bulk actions on selected rows
 *
 * Shows action buttons when rows are selected
 */

import type { Table } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import type { BulkAction } from "../types";

interface BulkActionsProps<TData> {
  table: Table<TData>;
  actions: BulkAction<TData>[];
}

export function BulkActions<TData>({
  table,
  actions,
}: BulkActionsProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedData = selectedRows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-2">
      <span className="text-sm font-medium">
        {selectedCount} row{selectedCount !== 1 ? "s" : ""} selected
      </span>

      <div className="flex items-center gap-2 ml-auto">
        {actions.map((action) => {
          const isDisabled = Boolean(
            action.disabled?.(selectedData) ||
              (action.minSelection && selectedCount < action.minSelection) ||
              (action.maxSelection && selectedCount > action.maxSelection),
          );

          return (
            <Button
              key={action.id}
              variant={action.variant || "default"}
              size="sm"
              onClick={() => action.onClick(selectedData)}
              disabled={isDisabled}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
