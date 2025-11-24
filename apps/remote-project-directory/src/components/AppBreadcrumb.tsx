import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  useIsMobile,
} from "@one-portal/ui";
import { ChevronRight } from "lucide-react";

/**
 * Convert path segment to readable label
 * Example: 'dashboard' -> 'Dashboard', 'event-details' -> 'Event Details'
 */
function formatBreadcrumbLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Auto-generated breadcrumb navigation from current route
 *
 * Features:
 * - Mobile: Shows last 2 levels only
 * - Desktop: Shows full breadcrumb path
 * - Root is always "Project Directory" linking to "/"
 */
export function AppBreadcrumb() {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Parse pathname into breadcrumb segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Build breadcrumb items with paths
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = formatBreadcrumbLabel(segment);
    return { path, label };
  });

  // On mobile, show only last 2 items
  const visibleItems =
    isMobile && breadcrumbItems.length > 2
      ? breadcrumbItems.slice(-2)
      : breadcrumbItems;

  // Helper to render "Project Directory" root link
  const renderRootLink = () => (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link to="/">Project Directory</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always show Root link on desktop */}
        {!isMobile && (
          <>
            {renderRootLink()}
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
          </>
        )}

        {/* Handle Root Page (All Projects) */}
        {breadcrumbItems.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>All Projects</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          // Handle Other Pages
          visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;

            return (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.path}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
