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
  const {
    data: roles = [],
    isLoading,
    error,
  } = useUserApplicationRoles(userIdentifier);
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

  return (
    <DataTable
      data={!userIdentifier ? [] : roles}
      columns={columns}
      isLoading={isLoading && !!userIdentifier}
      error={error}
      features={{
        filtering: { enabled: true },
        sorting: { enabled: true },
        pagination: { enabled: true, pageSize: 10 },
      }}
      ui={{
        variant: "striped",
        showToolbar: true,
        emptyMessage: !userIdentifier
          ? "Select a user to view their application roles"
          : "No application roles assigned",
        loadingMessage: "Loading roles...",
        errorMessage: "Failed to load application roles",
      }}
    />
  );
}
