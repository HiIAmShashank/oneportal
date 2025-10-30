/**
 * Application Roles Table Component
 *
 * Displays application-level roles for a selected user with revoke actions.
 */

import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { createApplicationRoleColumns } from "../columns/applicationRoleColumns";
import { useUserApplicationRoles } from "../hooks/useUserApplicationRoles";
import { useRevokeApplicationRole } from "../hooks/useRevokeApplicationRole";
import type { UserApplicationRole } from "../../../api/types";

interface ApplicationRolesTableProps {
  userIdentifier: string | undefined;
}

export function ApplicationRolesTable({
  userIdentifier,
}: ApplicationRolesTableProps) {
  const { data: roles = [], isLoading } =
    useUserApplicationRoles(userIdentifier);
  const { mutate: revokeRole } = useRevokeApplicationRole();

  const columns = useMemo(
    () =>
      createApplicationRoleColumns({
        onRevoke: (role: UserApplicationRole) => {
          if (
            confirm(
              `Are you sure you want to revoke ${role.role.roleName} role for this application? This will also revoke all feature roles for this application.`,
            )
          ) {
            revokeRole({
              userIdentifier: role.userIdentifier,
              applicationIdentifier: role.applicationIdentifier,
            });
          }
        },
      }),
    [revokeRole],
  );

  if (!userIdentifier) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Select a user to view their application roles
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading roles...</div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No application roles assigned
      </div>
    );
  }

  return (
    <DataTable
      data={roles}
      columns={columns}
      features={{
        filtering: { enabled: true },
        sorting: { enabled: true },
        pagination: { enabled: true, pageSize: 10 },
      }}
    />
  );
}
