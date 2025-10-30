import * as React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@one-portal/ui';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '@one-portal/ui';

/**
 * Convert path segment to readable label
 * Example: 'dashboard' -> 'Dashboard', 'event-details' -> 'Event Details'
 */
function formatBreadcrumbLabel(segment: string): string {
    return segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Auto-generated breadcrumb navigation from current route
 * 
 * Features:
 * - Mobile: Shows last 2 levels only
 * - Desktop: Shows full breadcrumb path
 * - Home link defaults to '/dashboard'
 */
export function AppBreadcrumb() {
    const location = useLocation();
    const isMobile = useIsMobile();

    // Parse pathname into breadcrumb segments
    const pathSegments = location.pathname
        .split('/')
        .filter(Boolean);

    // Build breadcrumb items with paths
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = formatBreadcrumbLabel(segment);
        return { path, label };
    });

    // On mobile, show only last 2 items
    const visibleItems = isMobile && breadcrumbItems.length > 2
        ? breadcrumbItems.slice(-2)
        : breadcrumbItems;

    // If no breadcrumbs (root path), show nothing
    if (breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Always show Home link on desktop */}
                {!isMobile && (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/dashboard">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {visibleItems.length > 0 && (
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                        )}
                    </>
                )}

                {visibleItems.map((item, index) => {
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
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
