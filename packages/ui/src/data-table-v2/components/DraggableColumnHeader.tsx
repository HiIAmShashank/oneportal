/**
 * DraggableColumnHeader - Drag and drop column reordering
 *
 * Integrates @dnd-kit for column reordering functionality
 * Wraps column headers to make them draggable and droppable
 */

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Header } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { cn } from "../../lib/utils";

interface DraggableColumnHeaderProps<TData> {
  header: Header<TData, unknown>;
  children: React.ReactNode;
}

export function DraggableColumnHeader<TData>({
  header,
  children,
}: DraggableColumnHeaderProps<TData>) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    position: "relative",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2 w-full">
        <button
          className={cn(
            "cursor-grab active:cursor-grabbing touch-none",
            "flex items-center p-1 hover:bg-muted/50 rounded",
            isDragging && "cursor-grabbing",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
