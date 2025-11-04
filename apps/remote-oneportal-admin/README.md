# OnePortal Admin - SuperUser Management Interface

A remote micro-frontend application for managing OnePortal users, applications, features, and role-based access control (RBAC).

## Overview

**Location:** `apps/remote-oneportal-admin`  
**Module Name:** `oneportal-admin`  
**Module Federation Scope:** `oneportal-admin`  
**Port (dev):** 5173  
**Access Level:** SuperUser only

OnePortal Admin provides comprehensive administrative capabilities for managing the entire OnePortal ecosystem, including user management, application lifecycle, feature management, and role assignments.

## Features

### User Management

- **View All Users** - DataTable with filtering, sorting, pagination
- **Create Users** - Email and display name with validation
- **Update Users** - Modify user information
- **Activate/Deactivate** - Soft delete with status tracking
- **Real-time Updates** - Optimistic UI updates with cache invalidation

### Application Management

- **CRUD Operations** - Full application lifecycle management
- **Owner Assignment** - Assign application owners (required)
- **Status Management** - Activate/deactivate applications
- **Metadata Tracking** - URLs, modules, scopes, icons
- **Active + Inactive View** - See all applications regardless of status

### Feature Management

- **Feature Creation** - Create features within applications
- **Application Context** - Always shows parent application
- **Feature Metadata** - URLs, icons, descriptions
- **Lifecycle Management** - Activate/deactivate features

### Role Management (RBAC)

- **Application Roles** - Grant/revoke Reader, Editor, Admin roles at app level
- **Feature Roles** - Grant/revoke roles at feature level
- **Prerequisite Validation** - Enforces app access before feature access
- **View All Roles** - See all roles for a user across apps/features
- **Cascading Revoke** - Revoking app role removes all feature roles
- **Idempotent Operations** - Safe to retry, one role per user per app/feature

## Technology Stack

### Core Dependencies

- **React 19** - UI framework
- **TanStack Router** - File-based routing with type safety
- **TanStack Query v5** - Server state with caching and optimistic updates
- **TanStack Form** - Type-safe forms with Zod validation
- **@one-portal/auth** - Unified authentication
- **@one-portal/ui** - Shared component library (includes DataTable V2)

### Specialized Libraries

- **Zod** - Runtime validation schemas
- **date-fns** - Date formatting
- **Lucide React** - Icon library

### Build Tools

- **Vite** - Development server and bundler
- **Module Federation** - Micro-frontend architecture
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling (via @one-portal/ui)

## Development

### Prerequisites

- Node.js v20+
- pnpm v9+
- OnePortal monorepo setup
- SuperUser access to test features

### Running the App

```bash
# Run in isolation (standalone mode)
pnpm --filter @one-portal/remote-oneportal-admin dev

# Run with entire monorepo
cd ../.. && pnpm dev
```

Access at `http://localhost:5173` (standalone) or `http://localhost:4280/apps/oneportal-admin` (integrated with shell).

### Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
# Authentication (app-specific prefix: VITE_ONEPORTAL_ADMIN_)
VITE_ONEPORTAL_ADMIN_AUTH_CLIENT_ID=your-client-id
VITE_ONEPORTAL_ADMIN_AUTH_AUTHORITY=https://login.microsoftonline.com/common
VITE_ONEPORTAL_ADMIN_AUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_ONEPORTAL_ADMIN_AUTH_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_ONEPORTAL_ADMIN_AUTH_SCOPES=User.Read

# API Configuration
VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL=http://localhost:7071/api

# Shared variables
VITE_APP_MODE=auto
```

### Build for Production

```bash
# Build with type checking
pnpm --filter @one-portal/remote-oneportal-admin build

# Preview production build
pnpm --filter @one-portal/remote-oneportal-admin preview
```

## Project Structure

```
apps/remote-oneportal-admin/
├── src/
│   ├── App.tsx                   # Router and QueryClient setup
│   ├── bootstrap.tsx             # Module Federation mount/unmount
│   ├── main.tsx                  # Standalone entry point
│   ├── routeTree.gen.ts          # Auto-generated routes (DO NOT EDIT)
│   ├── api/
│   │   ├── client.ts             # Authenticated API functions
│   │   ├── constants.ts          # Endpoint definitions
│   │   └── types.ts              # Request/response types
│   ├── auth/
│   │   └── msalInstance.ts       # MSAL configuration
│   ├── components/
│   │   ├── AppLayout.tsx         # Main layout wrapper
│   │   ├── AppSidebar.tsx        # Navigation sidebar
│   │   ├── AppBreadcrumb.tsx     # Breadcrumb navigation
│   │   └── forms/
│   │       └── ComboboxField.tsx # Reusable searchable dropdown
│   ├── config/
│   │   ├── menu.ts               # Sidebar menu configuration
│   │   └── routes.ts             # Public routes list
│   ├── features/
│   │   ├── users/                # User management feature
│   │   ├── applications/         # App management feature
│   │   ├── features/             # Feature management feature
│   │   └── roles/                # Role management feature
│   ├── hooks/
│   │   └── useAuthenticatedQuery.ts  # Authenticated API calls
│   ├── routes/                   # File-based routes
│   └── types/                    # TypeScript types
├── vite.config.ts                # Vite + Module Federation config
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

### Feature Structure

Each feature follows this pattern:

```
features/{feature}/
├── components/           # UI components (pages, sheets, tables)
│   ├── {Feature}Table.tsx
│   ├── Create{Feature}Sheet.tsx
│   └── Update{Feature}Sheet.tsx
├── hooks/                # TanStack Query hooks
│   ├── use{Features}.ts
│   ├── useCreate{Feature}.ts
│   ├── useUpdate{Feature}.ts
│   └── useDelete{Feature}.ts
├── schemas/              # Zod validation schemas
│   └── {feature}Schema.ts
└── columns/              # DataTable column definitions
    └── {feature}Columns.tsx
```

## Key Patterns

### useAuthenticatedQuery Hook

All API calls use the authenticated query pattern:

```typescript
import { useAuthenticatedQuery } from "../../hooks/useAuthenticatedQuery";

export function useUsers() {
  return useAuthenticatedQuery<User[]>(
    ["users"],
    (token) => fetchUsers(token),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}
```

### Form Initialization Pattern

**✅ CORRECT - Initialize with data:**

```typescript
const form = useAppForm({
  defaultValues: {
    name: entity.name,
    email: entity.email,
  },
  validators: { onChange: schema },
});
```

**❌ WRONG - Empty defaults + useEffect:**

```typescript
const form = useAppForm({ defaultValues: { name: "" } });
useEffect(() => {
  form.setFieldValue("name", entity.name);
}, [entity]);
```

### ComboboxField Pattern

Reusable searchable dropdown integrated with TanStack Form:

```typescript
import { ComboboxField } from "@/components/forms/ComboboxField";

<form.Field name="userId">
  {(field) => (
    <ComboboxField
      value={field.state.value as string}
      onValueChange={(value) => {
        field.handleChange(value);
        setCurrentUserId(value); // For reactive queries
      }}
      options={users.map((u) => ({ value: u.id, label: u.name }))}
      placeholder="Select user..."
      searchPlaceholder="Search users..."
      disabled={!prerequisite}
    />
  )}
</form.Field>
```

### DataTable V2 Configuration

Use nested `features` object (not individual `enableX` props):

```typescript
<DataTable
  data={items}
  columns={columns}
  features={{
    filtering: { enabled: true },
    sorting: { enabled: true },
    pagination: { enabled: true, pageSize: 10 },
  }}
  persistState={true}
  stateKey="users-table"
/>
```

### State Synchronization

Sync local state when sheets open with pre-selected values:

```typescript
useEffect(() => {
  if (open && selectedValue) {
    setCurrentValue(selectedValue);
  }
}, [open, selectedValue]);
```

## API Integration

### Base URL

All API calls use: `VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL`

### Endpoint Pattern

Endpoints defined as factory functions in `src/api/constants.ts`:

```typescript
export const ENDPOINTS = {
  USERS: {
    LIST: () => `${API_BASE_URL}/users`,
    GET: (id: string) => `${API_BASE_URL}/users/${id}`,
    CREATE: () => `${API_BASE_URL}/users`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
};
```

### API Client Pattern

Authenticated fetch wrapper in `src/api/client.ts`:

```typescript
export async function fetchUsers(token: string): Promise<User[]> {
  const response = await fetch(ENDPOINTS.USERS.LIST(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}
```

### Latest API Changes (v1.0.1)

- Applications now return `applicationName` in all responses
- Features return both `applicationName` and `featureName`
- Roles include application/feature names for better UX
- Owner field is required (no longer optional)

See `docs/API_REFERENCE.md` (if available) for complete API documentation.

## Role Management Business Rules

### Application Roles

- One role per user per application (replace on grant)
- Three levels: Reader, Editor, Admin
- Prerequisite for feature roles

### Feature Roles

- Requires application-level role first
- One role per user per feature (replace on grant)
- Warning shown if user lacks app access
- Three levels: Reader, Editor, Admin

### Cascading Behavior

Revoking application role automatically revokes all feature roles for that application.

### Idempotency

All grant/revoke operations are idempotent - safe to retry without side effects.

## Common Tasks

### Adding New Feature

1. Create feature directory in `src/features/{feature}/`
2. Define types in `src/api/types.ts`
3. Add endpoints to `src/api/constants.ts`
4. Implement API functions in `src/api/client.ts`
5. Create Zod schemas in `features/{feature}/schemas/`
6. Create hooks in `features/{feature}/hooks/`
7. Create components in `features/{feature}/components/`
8. Create column definitions for DataTable
9. Add route in `src/routes/dashboard/{feature}.tsx`
10. Add menu item to `src/config/menu.ts`
11. Map icon in `src/components/AppSidebar.tsx`

### Adding ComboboxField to Form

```typescript
import { ComboboxField } from "@/components/forms/ComboboxField";

// In form component
<form.Field name="fieldName">
  {(field) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <ComboboxField
        value={field.state.value as string}
        onValueChange={field.handleChange}
        options={items.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Select..."
        searchPlaceholder="Search..."
      />
      <FieldInfo field={field} />
    </FormItem>
  )}
</form.Field>
```

### Using DataTable with Persistence

```typescript
import { DataTable } from "@one-portal/ui";
import { columns } from "./columns/userColumns";

<DataTable
  data={users}
  columns={columns}
  features={{
    filtering: { enabled: true },
    sorting: { enabled: true },
    pagination: { enabled: true, pageSize: 25 },
  }}
  persistState={true}
  stateKey="admin-users-table" // Unique key for persistence
/>;
```

## Anti-Patterns to Avoid

❌ **Don't** use `form.useStore()` (not available in TanStack Form)  
❌ **Don't** use individual `enableX` props on DataTable (use `features` object)  
❌ **Don't** initialize forms with empty values and update in useEffect  
❌ **Don't** forget type assertions for `field.state.value`  
❌ **Don't** display GUIDs instead of names in tables  
❌ **Don't** forget to sync state when sheets open with pre-selected values

## Best Practices

✅ **Do** initialize forms with entity data  
✅ **Do** use ComboboxField for searchable dropdowns  
✅ **Do** invalidate caches after mutations  
✅ **Do** show confirmation dialogs for destructive actions  
✅ **Do** display human-readable names (not GUIDs)  
✅ **Do** use optimistic updates for instant feedback  
✅ **Do** validate prerequisites (e.g., app access before feature roles)

## Testing

```bash
# Run tests (when implemented)
pnpm --filter @one-portal/remote-oneportal-admin test

# Type checking
pnpm --filter @one-portal/remote-oneportal-admin typecheck

# Linting
pnpm --filter @one-portal/remote-oneportal-admin lint
```

## Troubleshooting

### Form Validation Errors on Open

**Cause:** Initializing with empty values instead of entity data  
**Fix:** Initialize with data in `defaultValues`

### ComboboxField Not Updating

**Cause:** Missing state synchronization  
**Fix:** Add useEffect to sync when sheet opens

### DataTable Footer Always Showing

**Cause:** Using old API with individual props  
**Fix:** Use `features` object configuration

### Role Grant Fails

**Cause:** User doesn't have app-level access for feature role  
**Fix:** Check prerequisite validation, grant app role first

## Deployment

OnePortal Admin is deployed as part of the OnePortal monorepo:

1. Build all apps: `pnpm build`
2. Combine builds: `node scripts/combine-builds.js`
3. Deploy to Azure SWA: `pnpm swa:start` (local) or CI/CD pipeline

Deployment structure:

```
dist-deploy/
├── index.html          # Shell
├── oneportal-admin/
│   ├── index.html
│   └── assets/
│       └── remoteEntry.js  # Module Federation entry
└── staticwebapp.config.json
```

## Contributing

Follow OnePortal contribution guidelines:

1. Use TypeScript strict mode
2. Run `pnpm typecheck` before committing
3. Run `pnpm lint` and fix issues
4. Follow established patterns (see examples in features/)
5. Update this README if adding major features
6. Document reusable patterns for team reference

## Related Documentation

- **OnePortal Root:** `README.md` (monorepo overview)
- **CLAUDE.md** - Detailed architecture and patterns
- **Auth Package:** `packages/auth/README.md`
- **UI Package:** `packages/ui/README.md`
- **DataTable V2:** `packages/ui/src/data-table-v2/README.md`
- **API Reference:** `docs/API_REFERENCE.md` (if available)

## License

Internal use only - Part of OnePortal monorepo.
