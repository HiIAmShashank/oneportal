import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, LogOut, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@one-portal/ui";
import { AuthContext } from "@one-portal/auth";
import { isEmbeddedMode } from "@one-portal/auth/utils";
import { menuItems } from "../config/menu";
import type { MenuItem } from "../types/menu";
import { DynamicIcon } from "./DynamicIcon";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Render a single menu item with optional children
 */
function MenuItemComponent({ item }: { item: MenuItem }) {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.description}>
          <Link
            to={item.path}
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
            }}
            activeOptions={{ exact: true }}
          >
            <DynamicIcon name={item.icon} className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Menu item with children (collapsible)
  return (
    <SidebarMenuItem>
      <Collapsible asChild defaultOpen className="group/collapsible">
        <div>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.description}>
              <DynamicIcon name={item.icon} className="h-4 w-4" />
              <span>{item.name}</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
            <SidebarMenuSub>
              {item.children?.map((child) => (
                <SidebarMenuSubItem key={child.path}>
                  <SidebarMenuSubButton asChild>
                    <Link
                      to={child.path}
                      activeProps={{
                        className:
                          "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                      }}
                      activeOptions={{ exact: true }}
                    >
                      <DynamicIcon name={child.icon} className="h-4 w-4" />
                      <span>{child.name}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </SidebarMenuItem>
  );
}

/**
 * User profile footer for sidebar
 */
function UserProfile() {
  // Use React.useContext directly to avoid the error thrown by useAuth
  const authContext = React.useContext(AuthContext);

  // If no auth context, don't render
  if (!authContext) {
    return null;
  }
  const { state, logout } = authContext;
  const { userProfile, isAuthenticated } = state;

  if (!isAuthenticated || !userProfile) {
    return null;
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate font-medium">{userProfile.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {userProfile.email}
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
export function AppSidebar() {
  const isStandalone = !isEmbeddedMode({
    mode: import.meta.env.VITE_APP_MODE as "auto" | "standalone" | "embedded",
  });

  return (
    <Sidebar collapsible="icon" className="border-r" style={{ width: "16rem" }}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <DynamicIcon name="AppWindow" className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">One Portal Admin</span>
                  <span className="text-xs text-muted-foreground">
                    OnePortal Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <MenuItemComponent key={item.path} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <UserProfile />

      {/* Theme toggle in sidebar footer (standalone only) */}
      {isStandalone && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-center px-2 py-1.5">
                <ThemeToggle />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
