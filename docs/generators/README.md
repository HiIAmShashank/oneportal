# OnePortal Remote App Generator

Generate new remote micro-frontend applications for the OnePortal platform with a single command.

## Quick Start

```bash
pnpm turbo gen remote-app
```

Follow the interactive prompts to configure your new application.

## What Gets Generated

The generator creates a complete remote application with:

### Core Structure

- **Module Federation setup** - Vite configuration with proper shared dependencies
- **Authentication** - MSAL integration using factory pattern
- **Routing** - TanStack Router with protected routes
- **Layout system** - Responsive sidebar, breadcrumb, header
- **Type safety** - Full TypeScript configuration with path mappings
- **Tailwind CSS v4** - Centralized styling from `@one-portal/ui`

### Files Created

```
apps/remote-{name}/
├── src/
│   ├── App.tsx                    # Router and QueryClient setup
│   ├── bootstrap.tsx              # Module Federation entry point
│   ├── main.tsx                   # Standalone development entry
│   ├── auth/
│   │   └── msalInstance.ts        # MSAL factory configuration
│   ├── components/
│   │   ├── AppLayout.tsx          # Main layout wrapper
│   │   ├── AppSidebar.tsx         # Navigation sidebar
│   │   └── AppBreadcrumb.tsx      # Breadcrumb navigation
│   ├── config/
│   │   ├── menu.ts                # Menu configuration (mode-specific)
│   │   └── routes.ts              # Public routes definition
│   ├── types/
│   │   └── menu.ts                # TypeScript types
│   ├── routes/
│   │   ├── __root.tsx             # Root route with auth guard
│   │   ├── index.tsx              # Home page (mode-specific content)
│   │   ├── sign-in.tsx            # Sign-in page
│   │   └── auth/
│   │       └── callback.tsx       # OAuth callback handler
│   ├── debug/
│   │   └── authDebug.ts           # Development auth debugging
│   └── vite-env.d.ts              # Environment variable types
├── .env.local.example             # Environment template
├── .gitignore                     # Git ignore patterns
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite + Module Federation config
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # Node TypeScript config
├── eslint.config.js               # ESLint configuration
└── index.html                     # HTML entry point
```

### Shell Integration

The generator automatically updates:

- `scripts/combine-builds.js` - Adds app to deployment script
- `apps/shell/src/routes/__root.tsx` - Adds app to navigation
- `apps/shell/src/routes/apps.$appId.tsx` - Adds app to route loader

## Generation Modes

The generator supports three modes based on your selections:

### 1. Documentation Mode

Select **"Include OnePortal documentation routes"** to create an app that explains the OnePortal architecture.

**Generated menu structure:**

- Home (OnePortal introduction)
- Getting Started (quick start guide)
- Repository (monorepo structure)
- Tech Stack (technologies overview)
- UI Components (component library)
- DataTable (DataTable guide)
- Routing (TanStack Router patterns)
- Styling (Tailwind CSS usage)

**Use case:** Creating documentation or onboarding apps

**Note:** The menu structure is generated. To add the actual route content, copy from `apps/remote-domino/src/routes/` as needed.

### 2. Dashboard Mode

Select **"Include example dashboard with nested routes"** to create an app with a dashboard layout.

**Generated menu structure:**

- Dashboard
  - Overview
  - Events
  - Tasks
  - Workflows
- Settings

**Use case:** Business applications with multiple sections

**Note:** Basic dashboard structure is generated. Enhance with your specific business logic.

### 3. Minimal Mode

Don't select any options to create a minimal starter app.

**Generated menu structure:**

- Home
- About

**Use case:** Starting fresh with your own structure

## Prompts Explained

### App Name

- **Format:** lowercase, letters/numbers/hyphens only
- **Example:** `analytics`, `billing-portal`, `user-management`
- **Used for:** Directory name, package name, routes

### Display Name

- **Format:** Any readable text
- **Example:** `Analytics Dashboard`, `Billing Portal`
- **Used for:** UI labels, sidebar branding

### Description

- **Format:** Short text description
- **Example:** `Analytics and reporting dashboard`
- **Used for:** package.json, metadata

### Display Order

- **Format:** Number (1, 2, 3, ...)
- **Example:** `3`
- **Used for:** Shell navigation menu ordering

### Include OnePortal Documentation Routes

- **Default:** No
- **Effect:** Generates documentation-focused menu and content
- **When to use:** Building documentation or example apps

### Include Example Dashboard

- **Default:** No
- **Effect:** Generates dashboard with nested routes
- **When to use:** Building business applications with multiple sections

## After Generation

### 1. Configure Environment Variables

```bash
cd apps/remote-{name}
cp .env.local.example .env.local
```

Edit `.env.local` with your Azure AD app registration details:

```env
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_AZURE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_AUTH_SCOPES=openid profile email User.Read
VITE_APP_NAME=AR-OP-UAT-REMOTE-{APPNAME}
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Test Standalone Mode

```bash
pnpm dev
```

Visit http://localhost:5173 to test the app in standalone mode.

### 4. Build and Test Integration

```bash
# Build all apps
cd ../..
pnpm build

# Prepare deployment
node scripts/combine-builds.js

# Test in Shell
pnpm swa:start
```

Visit http://localhost:4280/apps/{name} to test integrated mode.

## Customization

### Adding Routes

Create new route files in `src/routes/`:

```typescript
// src/routes/settings.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return <div>Settings</div>;
}
```

### Updating Menu

Edit `src/config/menu.ts`:

```typescript
export const menuItems: MenuItem[] = [
  // ... existing items
  {
    name: "Settings",
    path: "/settings",
    icon: "Settings",
    order: 10,
    description: "Application settings",
  },
];
```

### Adding Components

Use components from `@one-portal/ui`:

```typescript
import { Button, Card, DataTable } from "@one-portal/ui";
```

Or add new shadcn/ui components:

```bash
cd packages/ui
pnpm dlx shadcn@latest add dialog
```

### Customizing Layout

Edit `src/components/AppLayout.tsx` to modify the layout structure.

### Adding API Integration

Use TanStack Query with auth-aware retry:

```typescript
import { useQuery } from "@tanstack/react-query";

function MyComponent() {
  const { data } = useQuery({
    queryKey: ["my-data"],
    queryFn: async () => {
      // QueryClient automatically handles auth errors
      const response = await fetch("/api/data");
      return response.json();
    },
  });
}
```

## Development Tips

### Debug Authentication

In development, access auth debug helpers in the browser console:

```javascript
window.__YOURAPP_AUTH_DEBUG__.getMsalAccounts();
window.__YOURAPP_AUTH_DEBUG__.getActiveAccount();
window.__YOURAPP_AUTH_DEBUG__.acquireToken(["User.Read"]);
```

### Route Tree Generation

TanStack Router automatically generates `routeTree.gen.ts` when you run `pnpm dev`. Don't edit this file manually.

### CSS Styling

- CSS is provided by `@one-portal/ui` package (centralized)
- Remote apps don't need their own Tailwind config
- Use Tailwind utility classes directly
- See [Tailwind CSS v4 docs](https://tailwindcss.com/) for available classes

### Module Federation

Your app shares these dependencies with the Shell:

- `react` and `react-dom`
- `@tanstack/react-query`
- `@tanstack/react-router`
- `lucide-react`

This reduces bundle size by ~50-60%.

## Troubleshooting

### "Container element not found" error

**Cause:** Mismatch between container ID in bootstrap and Shell configuration

**Fix:** Verify `mount()` function in `src/bootstrap.tsx` uses the correct container ID

### Routes not working in Shell

**Cause:** Route tree not generated or incorrect basepath

**Fix:**

1. Run `pnpm dev` to generate route tree
2. Verify `basepath` in `src/App.tsx` matches Shell configuration

### Authentication not working

**Cause:** Environment variables not configured or MSAL instance issues

**Fix:**

1. Check `.env.local` has all required variables
2. Verify redirect URIs match Azure AD app registration
3. Check browser console for auth debug messages

### Styles not applying

**Cause:** CSS not loaded from Shell or import issues

**Fix:**

1. In standalone mode, verify `@one-portal/ui/styles.css` imports correctly in `main.tsx`
2. In Shell mode, CSS should come from Shell automatically

### TypeScript errors after generation

**Cause:** Dependencies not installed or route tree not generated

**Fix:**

```bash
pnpm install
pnpm dev  # Generates route tree
pnpm typecheck
```

## Best Practices

1. **Always test both standalone and integrated modes** before deploying
2. **Use TypeScript strictly** - the generator enforces `strict: true`
3. **Follow the menu structure pattern** - consistent navigation UX
4. **Reuse components from @one-portal/ui** - maintain consistency
5. **Handle auth errors gracefully** - QueryClient does this automatically
6. **Keep routes focused** - one responsibility per route
7. **Document your APIs** - future developers will thank you
8. **Test with different user roles** - if using role-based access control

## Advanced Usage

### Copying Routes from remote-domino

To add documentation or dashboard routes to your app:

```bash
# Copy documentation routes
cp -r apps/remote-domino/src/routes/getting-started.tsx apps/remote-{name}/src/routes/
cp -r apps/remote-domino/src/routes/repository.tsx apps/remote-{name}/src/routes/
# ... copy other routes as needed

# Update menu.ts to include copied routes
```

### Modifying the Generator

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for detailed information on how to modify the generator templates.

### Creating Custom Generators

You can create additional generators in `turbo/generators/` following the same pattern.

## Resources

- [OnePortal Documentation](../../CLAUDE.md) - Project-wide patterns and conventions
- [Module Federation Guide](https://module-federation.io/) - Module Federation concepts
- [TanStack Router](https://tanstack.com/router) - Routing documentation
- [TanStack Query](https://tanstack.com/query) - Data fetching patterns
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling utilities
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js) - Authentication library

## Support

For questions or issues:

1. Check [`ARCHITECTURE.md`](./ARCHITECTURE.md) for generator internals
2. See [`CLAUDE.md`](../../CLAUDE.md) for OnePortal patterns
3. Review the generated app structure
4. Examine the `apps/remote-domino` reference implementation

## License

Part of the OnePortal project.
