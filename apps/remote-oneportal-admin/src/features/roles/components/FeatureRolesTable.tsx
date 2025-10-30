/**
 * Feature Roles Table Component
 *
 * Displays feature-level roles for a selected user with revoke actions.
 */

import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { createFeatureRoleColumns } from "../columns/featureRoleColumns";
import { useUserFeatureRoles } from "../hooks/useUserFeatureRoles";
import { useRevokeFeatureRole } from "../hooks/useRevokeFeatureRole";
import type { UserFeatureRole } from "../../../api/types";

interface FeatureRolesTableProps {
  userIdentifier: string | undefined;
}

export function FeatureRolesTable({ userIdentifier }: FeatureRolesTableProps) {
  const { data: roles = [], isLoading } = useUserFeatureRoles(userIdentifier);
  const { mutate: revokeRole } = useRevokeFeatureRole();

  const columns = useMemo(
    () =>
      createFeatureRoleColumns({
        onRevoke: (role: UserFeatureRole) => {
          if (
            confirm(
              `Are you sure you want to revoke ${role.role.roleName} role for this feature?`,
            )
          ) {
            revokeRole({
              userIdentifier: role.userIdentifier,
              featureIdentifier: role.featureIdentifier,
            });
          }
        },
      }),
    [revokeRole],
  );

  if (!userIdentifier) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Select a user to view their feature roles
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
        No feature roles assigned
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
