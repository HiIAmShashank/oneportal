import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Settings,
  User,
  LogOut,
  ShieldCheck,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  cn,
  Search,
} from "@one-portal/ui";
import { useAuth } from "@one-portal/auth/hooks";
import { ThemeToggle } from "./ThemeToggle";
import { publishAuthEvent } from "@one-portal/auth/events";
import { Link, useRouterState } from "@tanstack/react-router";
import { getAuthConfig } from "../auth/msalInstance";
import ShellIcon from "../shellIcon";
import { useSuperUser } from "../hooks/useSuperUser";
import { ApplicationCommandPalette } from "./ApplicationCommandPalette";

interface HeaderProps {
  className?: string;
}

/**
 * Get user initials from display name
 * @param name - User's display name
 * @returns Two-letter initials in uppercase, or "U" if no name
 */
function getInitials(name: string | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header({ className = "" }: HeaderProps) {
  const { state, login, logout } = useAuth();
  const { isAuthenticated, account } = state;
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { data: isSuperUser } = useSuperUser();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const handleSignIn = async () => {
    try {
      sessionStorage.setItem("auth_return_url", currentPath);
      await login(getAuthConfig().scopes);
    } catch (error) {
      console.error("[Shell] Sign-in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      publishAuthEvent("auth:signed-out", {
        appName: "shell",
        clientId: getAuthConfig().clientId,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to sign-in page after logout (not home page which would trigger route guard)
      const postLogoutUrl = new URL(window.location.origin);
      postLogoutUrl.pathname = "/sign-in";
      postLogoutUrl.searchParams.set("signed-out", "true");

      await logout(postLogoutUrl.toString());
    } catch (error) {
      console.error("[Shell] Logout error:", error);
    }
  };

  // Keyboard shortcut handler for ⌘K / Ctrl+K to focus search input
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Click outside handler to close the search dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <>
      <header
        className={`flex h-16 border-b shadow-2xl border-b-primary/10 bg-linear-to-r from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10 flex-col justify-center ${className}`}
      >
        <div className="flex items-center justify-between px-4 gap-4">
          {/* Left section: Logo and navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ShellIcon className="h-8 w-8" title="OnePortal Logo" />
              <div>
                <h1 className="text-lg font-semibold">OnePortal</h1>
              </div>
            </Link>

            {isAuthenticated && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        "inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-all focus:outline-none",
                        currentPath === "/"
                          ? "border-b-2! border-primary! text-foreground font-semibold"
                          : "border-b-2! border-transparent! text-muted-foreground hover:text-foreground hover:border-primary/60!",
                      )}
                    >
                      <Link
                        to="/"
                        aria-current={currentPath === "/" ? "page" : undefined}
                      >
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Center section: Search */}
          {isAuthenticated && (
            <div className="flex-1 flex justify-center max-w-2xl mx-auto">
              <div
                ref={searchContainerRef}
                className="relative w-full max-w-md"
              >
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                  <input
                    ref={inputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search applications..."
                    onFocus={() => setSearchOpen(true)}
                    className="flex h-9 w-full rounded-md border border-input bg-background py-2 pl-10 pr-14 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Search applications"
                  />
                  <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex z-10">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>

                {searchOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] mt-2 rounded-lg border shadow-md bg-popover max-h-[400px] overflow-auto z-50">
                    <ApplicationCommandPalette
                      search={search}
                      onSearchChange={setSearch}
                      onSelect={() => {
                        setSearchOpen(false);
                        setSearch("");
                        inputRef.current?.blur();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right section: Theme toggle and user menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {!isAuthenticated && (
              <Button onClick={handleSignIn} variant="default">
                Sign In
              </Button>
            )}

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {account ? getInitials(account.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">
                        {account?.name || "User Name"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {account?.username || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {isSuperUser && (
                    <DropdownMenuItem>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
