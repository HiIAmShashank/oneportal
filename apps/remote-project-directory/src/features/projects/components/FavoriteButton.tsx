import { Button } from "@one-portal/ui";
import { Bookmark } from "lucide-react";
import { useToggleFavorite } from "../../../hooks/useToggleFavorite";
import { cn } from "@one-portal/ui";

interface FavoriteButtonProps {
  projectId: number;
  isFavourite: boolean;
  className?: string;
}

export function FavoriteButton({
  projectId,
  isFavourite,
  className,
}: FavoriteButtonProps) {
  const { mutate, isPending } = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (isPending) return;
    mutate({ projectId, isFavourite });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 hover:bg-transparent cursor-pointer", className)}
      onClick={handleClick}
      disabled={isPending}
      title={isFavourite ? "Remove from favorites" : "Add to favorites"}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-colors",
          isFavourite ? "fill-primary text-primary" : "text-muted-foreground",
        )}
      />
      <span className="sr-only">
        {isFavourite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
