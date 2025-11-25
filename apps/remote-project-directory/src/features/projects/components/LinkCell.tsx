import { CopyableCell } from "./CopyableCell";

interface LinkCellProps {
  url: string | null | undefined;
  label?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function LinkCell({ url, label, icon: Icon, className }: LinkCellProps) {
  if (!url) {
    return <span className="text-muted-foreground">-</span>;
  }

  const displayValue = (
    <div className="flex items-center gap-2 truncate">
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-primary hover:underline hover:text-primary/80"
        onClick={(e) => e.stopPropagation()}
      >
        {label || url}
      </a>
    </div>
  );

  return (
    <CopyableCell
      value={url}
      displayValue={displayValue}
      className={className}
    />
  );
}
