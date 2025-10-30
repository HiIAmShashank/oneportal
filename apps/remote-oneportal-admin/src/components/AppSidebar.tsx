import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderTree,
  Box,
  Layers,
  Palette,
  Rocket,
  Route,
  Table,
  ChevronRight,
  LogOut,
  User,
  Shield,
} from "lucide-react";
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
import { menuItems } from "../config/menu";
import type { MenuItem } from "../types/menu";

/**
 * Icon mapping from string names to lucide-react components
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  FolderTree,
  Layers,
  LayoutDashboard,
  Box,
  Table,
  Route,
  Palette,
  Shield,
};

/**
 * Get icon component from icon name
 */
function getIcon(
  iconName?: string,
): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

/**
 * Render a single menu item with optional children
 */
function MenuItemComponent({ item }: { item: MenuItem }) {
  const Icon = getIcon(item.icon);
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
            {Icon && <Icon className="h-4 w-4" />}
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
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.name}</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
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
                      {getIcon(child.icon) &&
                        React.createElement(getIcon(child.icon)!, {
                          className: "h-4 w-4",
                        })}
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
  return (
    <Sidebar collapsible="icon" className="border-r" style={{ width: "16rem" }}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"></div>
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
      <SidebarRail />
    </Sidebar>
  );
}
