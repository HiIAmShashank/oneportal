/**
 * Roles Management Page Component
 *
 * Main page for managing user roles at application and feature levels.
 * Includes user selector and two tables for application and feature roles.
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@one-portal/ui";
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
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage user access to applications and features
          </p>
        </div>
        <Shield className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* User Selector Card */}
      <Card>
        <CardHeader>
          <CardTitle>Select User</CardTitle>
          <CardDescription>
            Choose a user to view and manage their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Application Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Application Roles</CardTitle>
          <CardDescription>
            Application-level role assignments for the selected user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationRolesTable userIdentifier={selectedUserId} />
        </CardContent>
      </Card>

      {/* Feature Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Roles</CardTitle>
          <CardDescription>
            Feature-level role assignments for the selected user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureRolesTable userIdentifier={selectedUserId} />
        </CardContent>
      </Card>

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
