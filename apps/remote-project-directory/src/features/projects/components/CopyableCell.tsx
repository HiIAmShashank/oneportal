import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button, cn } from "@one-portal/ui";

interface CopyableCellProps {
  value: string | number | null | undefined;
  displayValue?: React.ReactNode;
  className?: string;
}

export function CopyableCell({
  value,
  displayValue,
  className,
}: CopyableCellProps) {
  const [copied, setCopied] = useState(false);

  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">-</span>;
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group flex items-center gap-2 truncate", className)}>
      <div className="truncate">{displayValue ?? value}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-3 w-3 text-white" />
        ) : (
          <Copy className="h-3 w-3 text-white hover:text-white" />
        )}
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  );
}
