import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type RowAction, Button } from "@one-portal/ui";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { createUserColumns } from "../../features/users/columns/userColumns";
import { useUsers } from "../../features/users/hooks/useUsers";
import { CreateUserSheet } from "../../features/users/components/CreateUserSheet";
import { EditUserSheet } from "../../features/users/components/EditUserSheet";
import type { ApiUser } from "../../api/types";

export const Route = createFileRoute("/dashboard/users")({
  component: UsersPage,
});

function UsersPage() {
  // Fetch users with authentication
  const { data } = useUsers();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  // Handle edit action
  const handleEdit = (user: ApiUser) => {
    setSelectedUser(user);
    setIsEditSheetOpen(true);
  };

  // Create columns
  const dataColumns = createUserColumns({ onEdit: handleEdit });

  // Define row actions
  const rowActions: RowAction<ApiUser>[] = [
    {
      id: "edit",
      label: "Edit",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
    },
  ];
  const users = data || [];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their access levels in the system
          </p>
        </div>
        <Button onClick={() => setIsCreateSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Users DataTable */}
      <DataTable
        data={users}
        columns={dataColumns}
        actions={{
          row: rowActions,
          pinRight: true,
        }}
        features={{
          sorting: { enabled: true, multi: true },
          filtering: { enabled: true },
          pagination: {
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
          },
          columns: {
            visibility: true,
            resizing: true,
            pinning: true,
          },
        }}
        ui={{
          variant: "striped",
          showToolbar: true,
          emptyMessage: "No users found in the system",
        }}
        persistence={{
          key: "oneportal-admin-users-table",
          enabled: true,
        }}
      />

      {/* Create User Sheet */}
      <CreateUserSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
      />

      {/* Edit User Sheet */}
      <EditUserSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        user={selectedUser}
      />
    </div>
  );
}
