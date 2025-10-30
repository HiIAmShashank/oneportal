/**
 * TablePagination - Pagination controls for DataTable
 *
 * Displays page info, navigation buttons, and page size selector
 * Uses shadcn Button and Select components
 */

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
}

export function TablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageInfo = true,
  showPageSizeSelector = true,
}: TablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  // Calculate showing range
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border dark:border-border bg-background dark:bg-background px-4 py-3">
      {/* Left: Page size selector */}
      {showPageSizeSelector && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Center: Page info */}
      {showPageInfo && totalRows > 0 && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-muted-foreground">
          <span>
            Showing {startRow} to {endRow} of {totalRows} results
          </span>
        </div>
      )}

      {/* Right: Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPreviousPage}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!canPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-foreground">
            Page {pageIndex + 1} of {pageCount}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!canNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!canNextPage}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
