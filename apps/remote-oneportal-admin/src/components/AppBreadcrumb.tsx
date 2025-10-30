import { useLocation, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@one-portal/ui";
import React from "react";

/**
 * Breadcrumb navigation component
 *
 * Automatically generates breadcrumbs based on the current route path.
 * Handles both root paths and nested routes.
 */
export function AppBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Parse path segments
  const segments = pathname.split("/").filter(Boolean);

  // Handle root path
  if (segments.length === 0 || pathname === "/") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              Overview
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Build breadcrumb path
  let currentPath = "";
  const breadcrumbs = segments.map((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Format segment name (capitalize and replace hyphens with spaces)
    const displayName = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      path: currentPath,
      name: displayName,
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              Overview
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.path}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.path}>{crumb.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
