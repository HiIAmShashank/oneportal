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
  const {
    data: roles = [],
    isLoading,
    error,
  } = useUserFeatureRoles(userIdentifier);
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
          ? "Select a user to view their feature roles"
          : "No feature roles assigned",
        loadingMessage: "Loading roles...",
        errorMessage: "Failed to load feature roles",
      }}
    />
  );
}
