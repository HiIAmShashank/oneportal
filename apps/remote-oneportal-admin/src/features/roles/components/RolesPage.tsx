/**
 * Roles Management Page Component
 *
 * Main page for managing user roles at application and feature levels.
 * Includes user selector and two tables for application and feature roles.
 */

import { useState } from "react";
import { Button } from "@one-portal/ui";
import { UserPlus, Shield } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldControl,
} from "../../../components/forms/form";
import { ComboboxField } from "../../../components/forms/ComboboxField";
import { useUsers } from "../../users/hooks/useUsers";
import { ApplicationRolesTable } from "./ApplicationRolesTable";
import { FeatureRolesTable } from "./FeatureRolesTable";
import { GrantApplicationRoleSheet } from "./GrantApplicationRoleSheet";
import { GrantFeatureRoleSheet } from "./GrantFeatureRoleSheet";

export function RolesPage() {
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showGrantAppRole, setShowGrantAppRole] = useState(false);
  const [showGrantFeatureRole, setShowGrantFeatureRole] = useState(false);

  // Find selected user details
  const selectedUser = users.find((u) => u.userIdentifier === selectedUserId);

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Roles</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage user access to applications and features
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3">
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* User Selector */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Select User</h2>
          <p className="text-sm text-muted-foreground">
            Choose a user to view and manage their roles
          </p>
        </div>
        <Field>
          <FieldLabel>User</FieldLabel>
          <FieldControl>
            <ComboboxField
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              options={users.map((user) => ({
                value: user.userIdentifier,
                label: `${user.displayName} (${user.email})`,
              }))}
              placeholder="Select user..."
              searchPlaceholder="Search users..."
              emptyMessage="No users found."
              disabled={isLoadingUsers}
            />
          </FieldControl>
        </Field>
        {selectedUser && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedUser.displayName}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowGrantAppRole(true)}
                  disabled={!selectedUserId}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant App Role
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGrantFeatureRole(true)}
                  disabled={!selectedUserId}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant Feature Role
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Roles Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Application Roles</h2>
          <p className="text-sm text-muted-foreground">
            Application-level role assignments for the selected user
          </p>
        </div>
        <ApplicationRolesTable userIdentifier={selectedUserId} />
      </div>

      {/* Feature Roles Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Feature Roles</h2>
          <p className="text-sm text-muted-foreground">
            Feature-level role assignments for the selected user
          </p>
        </div>
        <FeatureRolesTable userIdentifier={selectedUserId} />
      </div>

      {/* Grant Role Sheets */}
      <GrantApplicationRoleSheet
        open={showGrantAppRole}
        onOpenChange={setShowGrantAppRole}
        selectedUserId={selectedUserId}
      />
      <GrantFeatureRoleSheet
        open={showGrantFeatureRole}
        onOpenChange={setShowGrantFeatureRole}
        selectedUserId={selectedUserId}
      />
    </div>
  );
}
