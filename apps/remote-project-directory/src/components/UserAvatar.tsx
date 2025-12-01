import { Avatar, AvatarFallback, AvatarImage, cn } from "@one-portal/ui";
import { useGraphPhoto } from "../contexts/GraphPhotoContext";
import { useMemo } from "react";

interface UserAvatarProps {
  email?: string;
  name?: string;
  className?: string;
  showName?: boolean;
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const firstInitial = parts[0]?.[0] || "";
      const lastInitial = parts[parts.length - 1]?.[0] || "";
      return (firstInitial + lastInitial).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (email) {
    const parts = email.split("@")[0]?.split(".");
    if (parts && parts.length >= 2) {
      const firstInitial = parts[0]?.[0] || "";
      const lastInitial = parts[1]?.[0] || "";
      return (firstInitial + lastInitial).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }

  return "??";
}

export function UserAvatar({
  email,
  name,
  className,
  showName = false,
}: UserAvatarProps) {
  const photoUrl = useGraphPhoto(email);
  const initials = useMemo(() => getInitials(name, email), [name, email]);

  // Don't render anything if no identifier provided
  if (!email && !name) return null;

  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("h-8 w-8", className)}>
        {photoUrl && <AvatarImage src={photoUrl} alt={name || email} />}
        <AvatarFallback title={name || email}>{initials}</AvatarFallback>
      </Avatar>
      {showName && (name || email) && (
        <span className="text-sm truncate max-w-[150px]" title={name || email}>
          {name || email}
        </span>
      )}
    </div>
  );
}
