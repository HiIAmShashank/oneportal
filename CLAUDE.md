# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OnePortal is a micro-frontend portal built with Module Federation, Turborepo, React 19, and Tailwind CSS v4. The architecture uses a **Shell application** that dynamically loads **Remote applications** (micro-frontends) at runtime. Authentication is handled via Azure AD/MSAL with SSO across all apps.

**Key Technologies:**

- Turborepo monorepo with pnpm workspaces
- Vite with @originjs/vite-plugin-federation for Module Federation
- React 19 with @tanstack/react-router
- Tailwind CSS v4 with centralized design system
- Azure AD authentication with @azure/msal-browser
- Deployed to Azure Static Web Apps

## Essential Commands

### Development

```bash
# Start all apps in development
pnpm dev

# Start specific app only
pnpm --filter @one-portal/shell dev
pnpm --filter @one-portal/remote-domino dev

# Start with Azure SWA emulator (after build)
pnpm swa:start

# Build all apps and packages
pnpm build

# Build and prepare for deployment
pnpm build:deploy
```

### Testing & Quality

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Dead code analysis with Knip
pnpm deadcode

# Format code
pnpm format
```

### Generate New Remote App

```bash
# Use Turborepo generator to scaffold new remote app
pnpm turbo gen remote-app

# Follow prompts for app name, display name, description, display order
# Generator creates app structure and updates combine-builds.js
# Shell navigation is automatic via /applications API endpoint
```

### Docker

```bash
# Build and start with Docker
pnpm docker:up

# View logs
pnpm docker:logs

# Stop containers
pnpm docker:down
```

### Storybook (Component Documentation)

```bash
# Start Storybook dev server
pnpm storybook

# Build static Storybook
pnpm build-storybook

# Storybook runs at http://localhost:6006
```

**Important:** Storybook is located at `apps/storybook/` and is **excluded from deployment** builds. It's for development and documentation only.

## Architecture Deep Dive

### Module Federation Flow

**Shell (Host) Behavior:**

1. Shell app runs at `http://localhost:5000` in dev, port 4280 with SWA emulator
2. Vite config defines remotes in `apps/shell/vite.config.ts`:
   - Dev: `http://localhost:5173/assets/remoteEntry.js`
   - Prod: `/domino/assets/remoteEntry.js`
3. Shell uses `remoteLoader.ts` service to load/mount/unmount remotes dynamically
4. Remotes are mounted via their `bootstrap.tsx` export

**Remote (Micro-frontend) Behavior:**

1. Each remote exposes `./App` and `./bootstrap` via Module Federation
2. `bootstrap.tsx` exports `mount()` and `unmount()` functions
3. Remote runs standalone at `http://localhost:5173` for isolated development
4. In production, remote builds to `/domino/` with `remoteEntry.js` in assets folder

**Critical: Shared Dependencies**
Shell and remotes must share these as singletons to prevent duplication:

- `react` and `react-dom` (version ^19.2.0)
- `@tanstack/react-query` - Shared query cache across apps
- `@tanstack/react-router` - Shared router utilities
- `lucide-react` - Icon library (~158 kB gzipped when shared)
- `zustand` - State management (shell only)

**Note:** Proper shared dependency configuration reduces bundle sizes by ~50-60%. All remote apps inherit these from the shell in production.

### Authentication Architecture

The `@one-portal/auth` package provides unified authentication for all apps.

**Host Mode (Shell):**

- Uses `UnifiedAuthProvider` with `mode="host"`
- Handles OAuth redirect flow
- Publishes authentication events via BroadcastChannel
- Shows loading spinner during initial auth

**Remote Mode (Micro-frontends):**

- Uses `UnifiedAuthProvider` with `mode="remote"`
- Performs SSO silent authentication
- Subscribes to Shell's authentication events
- Detects embedded vs standalone mode

**Key Files:**

- Each app has `src/auth/msalInstance.ts` using `createMsalInstanceWithConfig(appName)`
- Provider wraps app in `main.tsx` (host) or `bootstrap.tsx` (remote)
- Route guards use `createRouteGuard()` from `@one-portal/auth`

### CSS Architecture - Critical Understanding

OnePortal uses a **centralized CSS system** that eliminates duplication:

**Structure:**

```
packages/ui/
├── src/index.css          # CSS entry (@import "tailwindcss")
├── src/theme.css          # Light/dark mode CSS variables
└── dist/styles.css        # Compiled output (exported)

apps/shell/src/main.tsx    # import '@one-portal/ui/styles.css' (unconditional)
apps/remote-*/src/main.tsx # import '@one-portal/ui/styles.css' (conditional: only in dev/preview)
```

**How it works:**

1. UI package compiles Tailwind CSS once to `dist/styles.css`
2. Shell imports compiled CSS unconditionally
3. Remote apps import conditionally (only for standalone dev mode)
4. In production, remotes inherit CSS from shell (no duplication)

**Important:** Remote apps DO NOT need:

- Their own `tailwind.config.ts`
- Individual CSS files
- Separate Tailwind build process

**To add new shadcn/ui components:**

```bash
cd packages/ui
pnpm dlx shadcn@latest add button card dialog
```

### Deployment Build Process

The `scripts/combine-builds.js` script prepares deployment:

1. Clears `dist-deploy/` directory
2. Copies shell build to root of `dist-deploy/`
3. Copies each remote build to `dist-deploy/{remoteName}/`
4. Verifies `remoteEntry.js` files exist
5. Copies `staticwebapp.config.json`

**Result structure:**

```
dist-deploy/
├── index.html              # Shell
├── assets/                 # Shell assets
├── domino/
│   └── assets/
│       └── remoteEntry.js  # Domino remote
└── staticwebapp.config.json
```

## TypeScript Configuration

OnePortal uses a unified TypeScript configuration across all workspaces:

**Strict Mode Enabled:**

- `strict: true` - All strict type-checking enabled
- `noUncheckedIndexedAccess: true` - Array access returns `T | undefined`
- `noImplicitAny: true` - No implicit any types

**Path Mappings:**
All apps include wildcard path mappings for workspace packages:

```json
{
  "paths": {
    "@one-portal/auth/*": ["../../packages/auth/src/*"],
    "@one-portal/config/*": ["../../packages/config/src/*"],
    "@one-portal/types/*": ["../../packages/types/src/*"],
    "@one-portal/ui/*": ["../../packages/ui/src/*"]
  }
}
```

This enables proper subpath imports like:

```typescript
import { isAuthError } from "@one-portal/auth/utils";
import { createQueryClient } from "@one-portal/config";
```

**Important:** Always use `unknown` instead of `any` for error types and external data. Use type guards to narrow types.

## Turborepo Task Pipeline

Turborepo manages build orchestration with caching:

**Task Dependencies:**

- `build` depends on `^build` (build dependencies first)
- `typecheck` depends on `^build` (needs type declarations)
- `test` depends on `^build` (needs compiled packages)
- `preview` depends on `build` (needs production build)

**Persistent Tasks:**

- `dev` - Never cached, runs continuously
- `test:watch` - Never cached, runs continuously

**Cached Tasks:**

- `build`, `lint`, `typecheck`, `test` - Fully cached based on inputs

**Outputs:**

- Build outputs to `dist/**` in each package/app
- Type declarations in `dist/` folders
- Test coverage in `coverage/`

## Package Structure & Responsibilities

### `packages/auth`

Unified authentication package with MSAL integration:

- `UnifiedAuthProvider` - Single provider for host and remote modes
- `AuthErrorHandler` - Centralized error handling with toast notifications
- `createMsalInstanceWithConfig()` - Factory for MSAL instance creation with config loading
- Event system for cross-app auth communication
- Route guards for protected routes

**Key Exports:**

```typescript
import { UnifiedAuthProvider } from "@one-portal/auth";
import { AuthErrorHandler } from "@one-portal/auth";
import { createMsalInstanceWithConfig } from "@one-portal/auth";
import {
  publishAuthEvent,
  subscribeToAuthEvents,
} from "@one-portal/auth/events";
import {
  createProtectedRouteGuard,
  createCallbackRouteGuard,
} from "@one-portal/auth";
```

**Note:** The auth package has been simplified - deprecated error handling functions and thin wrapper utilities have been removed. Always use `AuthErrorHandler` class for error handling, and `createMsalInstanceWithConfig()` as the single factory function.

### `packages/ui`

Shared UI component library:

- Exports React components AND compiled CSS
- Built with shadcn/ui components
- Uses Tailwind CSS v4 with `@theme` directive
- Includes DataTable, Button, Card, Dialog, etc.

**Key Exports:**

```typescript
import { Button, Card, DataTable } from "@one-portal/ui";
import "@one-portal/ui/styles.css"; // Compiled CSS
```

### `packages/types`

Shared TypeScript types and validators:

- Config types (`ShellConfig`, `RemoteAppConfig`)
- Storage keys constants
- Zod validators for runtime validation

### `packages/config`

Shared configuration and utilities:

- **ESLint configuration** - Shared linting rules across workspace
- **React Query client factory** - `createQueryClient()` with auth-aware retry logic
- **Environment validators** - Zod schemas for environment variables

**Key Exports:**

```typescript
import { createQueryClient } from "@one-portal/config";
import { validateShellEnv } from "@one-portal/config";

// Create QueryClient with auth error handling
const queryClient = createQueryClient({
  shouldSkipRetry: isAuthError,
});
```

### localStorage Key Conventions

OnePortal uses a consistent namespace pattern for all localStorage keys:

**Pattern:** `oneportal:{module}:{identifier}:{property}`

**Examples:**

- `oneportal:auth:returnUrl` - Auth redirect URL
- `oneportal:datatable:users-table:state` - DataTable column preferences
- `oneportal:datatable:users-table:density` - DataTable UI density
- `oneportal:datatable:users-table:filterMode` - DataTable filter mode

**Important:** Always use the provided storage utilities from `@one-portal/auth` or `@one-portal/ui` to maintain consistency. Direct `localStorage` calls should follow this naming convention.

## Working with Remote Apps

### Creating New Remote App

1. **Run generator:**

   ```bash
   pnpm turbo gen remote-app
   ```

2. **What gets created:**
   - New app in `apps/remote-{name}/`
   - `src/App.tsx` - Main component
   - `src/bootstrap.tsx` - Module Federation mount/unmount
   - `src/main.tsx` - Standalone entry point
   - `vite.config.ts` - Federation config exposing `./App` and `./bootstrap`
   - `package.json` with workspace dependencies

3. **What gets updated:**
   - `scripts/combine-builds.js` - Adds remote to deployment

**Note:** Shell navigation is automatic via `/applications` API endpoint. Apps appear in navigation when the API returns them.

4. **DON'T add:**
   - Tailwind config files
   - CSS imports beyond conditional `@one-portal/ui/styles.css`
   - Duplicate Tailwind dependencies

### Remote App Bootstrap Pattern

Every remote must export `mount()` and `unmount()`:

```typescript
// apps/remote-{name}/src/bootstrap.tsx
export async function mount(containerId: string): Promise<Root> {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container "${containerId}" not found`);

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <UnifiedAuthProvider
        msalInstance={msalInstance}
        mode="remote"
        appName="{name}"
        getAuthConfig={getAuthConfig}
      >
        <App />
      </UnifiedAuthProvider>
    </StrictMode>
  );
  return root;
}

export function unmount(root: Root): void {
  root.unmount();
}
```

### Shell Remote Loading

Shell uses `remoteLoader.ts` service:

```typescript
import { loadAndMountRemote, unmountRemote } from "@/services/remoteLoader";

// Load and mount
const root = await loadAndMountRemote(
  "/domino/assets/remoteEntry.js",
  "domino",
  "app-container",
);

// Later, unmount
unmountRemote("domino");
```

## Storybook - DataTable Component Documentation

OnePortal includes a comprehensive Storybook app at `apps/storybook/` that documents all DataTable component features.

### Running Storybook

```bash
# Start development server
pnpm storybook

# Build static site
pnpm build-storybook

# Access at http://localhost:6006
```

### Structure

```
apps/storybook/
├── .storybook/          # Storybook configuration
│   ├── main.ts          # Vite builder, addons, stories location
│   ├── preview.tsx      # Global decorators, theme provider
│   └── storybook.css    # Custom Storybook styles
├── src/
│   ├── stories/         # Story files organized by feature
│   │   ├── DataTableV2/ # DataTable V2 feature stories
│   │   └── Welcome.stories.tsx
│   └── mocks/           # Mock data infrastructure
│       ├── data-generators.ts   # Faker.js data generators
│       └── column-definitions.tsx  # Reusable column configs
├── package.json
└── tsconfig.json
```

### Mock Data Generators

Located in `src/mocks/data-generators.ts`, provides realistic test data:

- **Users**: name, email, role, status, avatar, department
- **Orders**: order number, customer, amount, status, date
- **Products**: SKU, price, stock, category, supplier
- **Transactions**: debits/credits with running balances
- **Tasks**: priorities, statuses, due dates, tags

```typescript
import { generateUsers, generateOrders } from "@/mocks/data-generators";

const users = generateUsers(50); // Generate 50 realistic users
const orders = generateOrders(100); // Generate 100 orders
```

### Column Definitions

Located in `src/mocks/column-definitions.tsx`, provides reusable column configs:

- Custom cell renderers (badges, avatars, formatted currency/dates)
- Filter configurations (select, multi-select, date-range, number-range)
- Inline editing configurations
- Aggregation functions for grouping
- Sort functions and conditional styling

```typescript
import { userColumns, orderColumns } from '@/mocks/column-definitions';

<DataTable data={users} columns={userColumns} />
```

### Story Categories

Stories are organized by feature area:

1. **Basic Features** - Sorting, filtering, pagination, search
2. **Advanced Features** - Inline editing, grouping, expanding, server-side
3. **Column Features** - Resizing, reordering, pinning, visibility
4. **Selection & Actions** - Row selection, bulk actions, per-row actions
5. **UI Variations** - Density, themes, filter modes, variants
6. **Real-World Examples** - Users, orders, products, financial data
7. **Persistence & State** - localStorage, controlled/uncontrolled modes

### Deployment Exclusion

**IMPORTANT:** Storybook is automatically excluded from production deployment:

- `scripts/combine-builds.js` does NOT include storybook
- `pnpm build:deploy` ignores storybook app
- Only used for development and documentation

### Progress Tracking

See `docs/STORYBOOK_CHECKLIST.md` for implementation progress. This file tracks:

- Completed phases and tasks
- Current implementation status
- Next steps for story development

## Common Development Patterns

### Adding New Routes

**Shell routes:**

- File-based routing with TanStack Router
- Routes in `apps/shell/src/routes/`
- Protected routes use route guards
- Generate route tree: `pnpm --filter shell dev` (auto-generates `routeTree.gen.ts`)

**Remote routes:**

- Each remote has its own TanStack Router instance
- Routes in `apps/remote-{name}/src/routes/`
- Route tree auto-generated during dev/build

### Environment Variables

**App-Specific Environment Variables:**
Each app uses **app-specific** prefixes for environment variables to avoid conflicts and enable proper Module Federation sharing.

**Key Concept:** Vite injects environment variables at **build time**, not runtime. Variables are hard-coded into the JavaScript bundle when you run `pnpm build`.

**App-Specific Patterns:**

- **Authentication:** `VITE_{APPNAME}_AUTH_*` (e.g., `VITE_SHELL_AUTH_CLIENT_ID`)
- **API URLs:** `VITE_{APPNAME}_API_BASE_URL` (e.g., `VITE_DOMINO_API_BASE_URL`)

**Shared Variables** (same for all apps):

- **App Mode:** `VITE_APP_MODE` (behavioral flag: auto, standalone, or embedded)
- **Feature Flags:** `VITE_ENABLE_ANALYTICS`, `VITE_ENABLE_DEBUG`

**Shell (.env.local):**

```bash
# Authentication (app-specific)
VITE_SHELL_AUTH_CLIENT_ID=your-shell-client-id
VITE_SHELL_AUTH_AUTHORITY=https://login.microsoftonline.com/common
VITE_SHELL_AUTH_REDIRECT_URI=http://localhost:5000/auth/callback
VITE_SHELL_AUTH_POST_LOGOUT_REDIRECT_URI=http://localhost:5000/
VITE_SHELL_AUTH_SCOPES=User.Read

# API Configuration (app-specific)
VITE_SHELL_API_BASE_URL=https://api.oneportal.com/shell
VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL=http://localhost:7071/api

# Shared variables
VITE_APP_MODE=auto
```

**Remote apps (.env.local):**

```bash
# For remote-domino
# Authentication (app-specific)
VITE_DOMINO_AUTH_CLIENT_ID=your-domino-client-id
VITE_DOMINO_AUTH_AUTHORITY=https://login.microsoftonline.com/common
VITE_DOMINO_AUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_DOMINO_AUTH_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_DOMINO_AUTH_SCOPES=User.Read

# API Configuration (app-specific)
VITE_DOMINO_API_BASE_URL=https://api.oneportal.com/domino

# Shared variables
VITE_APP_MODE=auto
```

**VITE_APP_MODE Explained:**

- `auto` (default): Detects mode based on URL path
  - If URL starts with `/apps/` → embedded mode (SSO silent auth)
  - Otherwise → standalone mode (full OAuth redirect)
- `standalone`: Always use full OAuth redirect flow
- `embedded`: Always use SSO silent authentication

**Important:**

- Each app must have its own `.env.local` with app-specific prefixes
- Use `.env.local.example` as template in each app
- The generator automatically creates `.env.local.example` with correct prefixes
- Validation script (`scripts/validate-auth-config.js`) auto-discovers and validates all apps
- Environment variables are baked into builds at compile time, not read at runtime

### Error Handling with AuthErrorHandler

```typescript
import { AuthErrorHandler } from "@one-portal/auth";

// Process and show error
const processed = AuthErrorHandler.process(error, "Sign-in");
AuthErrorHandler.show(processed, {
  severity: "error",
  showRetry: true,
  onRetry: () => handleRetry(),
});

// Or wrap promise
const token = await AuthErrorHandler.showPromise(
  acquireToken(instance, ["User.Read"]),
  { loadingMessage: "Acquiring token..." },
);
```

### Using DataTable from @one-portal/ui

The UI package includes a feature-rich DataTable component:

```typescript
import { DataTable } from '@one-portal/ui';

<DataTable
  data={items}
  columns={columnDefs}
  enableFilters
  enableSorting
  enablePagination
  enableColumnVisibility
  persistState={true}
  stateKey="my-table"
/>
```

## Testing

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Specific package
pnpm --filter @one-portal/auth test
```

### Test Configuration

- Test runner: Vitest
- Setup file: `tests/setup.ts`
- Config: `vitest.config.ts` (root level)
- Environment: jsdom for React components
- Coverage: V8 provider

### Writing Tests

Tests go in:

- `packages/{package}/src/**/*.test.ts(x)` for unit tests
- `tests/**/*.test.ts(x)` for integration tests

## Performance & Bundle Sizes

OnePortal is optimized for production performance:

**Production Build Configuration:**

- Minification enabled (esbuild)
- Shared dependencies deduplicated via Module Federation
- CSS code-split disabled for consistent styling
- Target: ESNext for modern browsers

**Current Bundle Sizes (production):**

- Shell app: ~710 kB raw (~202 kB gzipped)
- Remote apps: ~481 kB raw (~129 kB gzipped)
- Shared React Query: 45 kB (~13 kB gzipped)
- Shared React Router: 88 kB (~28 kB gzipped)
- Shared Lucide Icons: 868 kB (~158 kB gzipped)

**Performance Best Practices:**

1. Always configure shared dependencies in `vite.config.ts`
2. Use dynamic imports for code-splitting when needed
3. Leverage Turborepo caching for faster builds
4. Monitor bundle sizes with Vite's build output

## Build & Deployment Checklist

Before deploying, verify:

1. **Build succeeds:**

   ```bash
   pnpm build
   ```

2. **Type checking passes:**

   ```bash
   pnpm typecheck
   ```

3. **Linting passes:**

   ```bash
   pnpm lint
   ```

4. **Dead code check:**

   ```bash
   pnpm deadcode
   ```

5. **Combine builds:**

   ```bash
   node scripts/combine-builds.js
   ```

6. **Test with SWA emulator:**

   ```bash
   pnpm swa:start
   # Visit http://localhost:4280
   ```

7. **Verify remote apps load:**
   - Navigate to each remote app route
   - Check browser console for Module Federation errors
   - Verify authentication works across shell and remotes

## Port Allocations

- **Shell dev:** 5000
- **Remote apps dev:** 5173 (all remotes use same port when running standalone)
- **SWA emulator:** 4280
- **Shell preview:** 4173

## Common Issues & Solutions

### CSS not applying in remote app

**Cause:** Remote isn't loading styles from shell
**Fix:** Verify conditional import in remote's `main.tsx`:

```typescript
if (import.meta.env.DEV || import.meta.env.MODE === "preview") {
  await import("@one-portal/ui/styles.css");
}
```

### Remote app fails to load in shell

**Cause:** Module Federation configuration mismatch
**Fix:**

1. Check shell's `vite.config.ts` remotes config
2. Verify remote's `vite.config.ts` exposes `./bootstrap`
3. Check `scripts/combine-builds.js` includes remote
4. Verify `remoteEntry.js` exists in remote's `dist/assets/`

### Authentication flickering

**Cause:** MSAL cache check failing
**Fix:** Verify `UnifiedAuthProvider` receives `getAuthConfig` prop in both shell and remote

### Type errors after package changes

**Cause:** Stale type declarations
**Fix:**

```bash
pnpm --filter @one-portal/types build
pnpm --filter @one-portal/ui build
```

### Turbo cache issues

**Cause:** Stale cache after major changes
**Fix:**

```bash
turbo clean
pnpm build
```

## Code Generation

### Turborepo Generator

Located in `turbo/generators/`:

- `config.ts` - Generator configuration with prompts and actions
- `templates/remote-app/` - 25+ Handlebars template files for complete app structure

**Generator Creates:**

- Complete app structure with authentication (MSAL), routing (TanStack Router), and layout
- Modern patterns: UnifiedAuthProvider, createProtectedRouteGuard, factory patterns
- Three generation modes:
  1. **Documentation Mode** - Menu structure for OnePortal documentation (8 items)
  2. **Dashboard Mode** - Menu structure with nested routes (4 items)
  3. **Minimal Mode** - Basic menu (home and about)
- Shell integration: Automatically updates combine-builds.js and shell navigation

**Variables available in templates:**

- `{{appName}}` - Lowercase name (e.g., "billing")
- `{{displayName}}` - Display name (e.g., "Billing")
- `{{description}}` - App description
- `{{displayOrder}}` - Menu order number
- `{{includeDocumentation}}` - Boolean for documentation mode
- `{{includeExampleDashboard}}` - Boolean for dashboard mode (skipped if documentation=true)

**Generator Documentation:**

- `docs/generators/README.md` - User guide with usage examples and troubleshooting
- `docs/generators/ARCHITECTURE.md` - Technical guide for modifying the generator

## Specs & Documentation

**Design Specifications** (`specs/` directory):

- `001-front-end-host/` - Initial shell architecture
- `002-add-single-sign/` - SSO authentication design
- `003-monorepo-css-isolation/` - Centralized CSS architecture

**Project Documentation** (`docs/` directory):

- `docs/generators/` - Turborepo generator documentation
- `docs/DATATABLE_V2_PROGRESS.md` - DataTable V2 implementation tracking
- `docs/STORYBOOK_CHECKLIST.md` - Storybook story implementation progress
- `docs/IMPROVEMENT_SUMMARY.md` - Historical improvements and decisions
- Other technical documentation and analysis files

Reference these when making architectural changes or understanding implementation details.

## Important Notes

1. **Never manually edit `routeTree.gen.ts`** - Auto-generated by TanStack Router
2. **Always use workspace protocol** - Dependencies use `workspace:*` not version numbers
3. **CSS compiled once** - Only `packages/ui` compiles Tailwind, apps import compiled CSS
4. **Shared dependencies must match** - React, React DOM versions must be identical across all apps
5. **Remote apps are independent** - Each remote can run standalone for development
6. **Authentication events via BroadcastChannel** - Shell publishes, remotes subscribe
7. **Use Knip to prevent dead code** - Runs in CI, catches unused exports/dependencies
8. **Bootstrap pattern required** - All remotes must export `mount()` and `unmount()`
9. **Simplified auth patterns** - Use `createMsalInstanceWithConfig()` (not `createMsalInstance()`), and `AuthErrorHandler` class (not deprecated error functions)
10. **App-specific env variables** - Always use `VITE_{APPNAME}_AUTH_*` pattern for environment variables

## Recent Cleanup (October 2025)

The codebase underwent a strategic cleanup to reduce cognitive load and eliminate dead code:

**Removed Dead Code (~1,200 lines):**

- `useCreateUser` and `useUpdateUser` hooks (shell)
- `createUser()` and `updateUser()` API functions and types
- `field.tsx` component (ui package)
- Deprecated error handling files: `formatAuthError.ts`, `showAuthError.ts`, `errorHandling.ts`
- Unused constants: `API_BASE_URL`, `buildApiUrl()`

**Simplified Abstractions:**

- Factory Pattern: Consolidated to single `createMsalInstanceWithConfig()` function
- Route Guards: Removed `createPublicRouteGuard()` (no-op function), kept `createProtectedRouteGuard()` and `createCallbackRouteGuard()`
- Property Accessors: Removed thin wrappers like `getAccessToken()`
- Menu Configuration: Removed unused helpers (`fetchMenuItems`, `getMenuItemByPath`, `getAllMenuItems`)

**Standardization:**

- ESLint: All apps now use shared config from `@one-portal/config`
- Dependencies: Cleaned up 27 redundant dependencies across packages
- All validation passes: typecheck, lint, build

**Key Principle:** Favor direct, clear code over layers of abstraction. Only add abstractions when there's clear benefit across multiple use cases.

**Latest Improvements (November 2025):**

**Performance & Navigation:**

- Non-blocking prefetch: Applications load in background, navigation is instant (removed `await` in `__root.tsx`)
- Module-based routing: URLs like `/apps/analytics` instead of `/apps/{uuid}` for cleaner navigation
- Route files: Renamed `apps.$appId.tsx` → `apps.$moduleName.tsx` to match API module field
- Command palette: Added `Command.Loading` component for proper loading states

**Hydration Fix:**

- Resolved nested `<a>` tag error in Header navigation using `asChild` prop
- `NavigationMenuLink` now wraps `Link` instead of being nested inside it

**Generator Improvements:**

- Synced with remote-domino structure
- Removed 12 unused dependencies (`@azure/msal-*`, `zod`, ESLint plugins)
- ESLint now uses shared `@one-portal/config` (3 lines vs 29)
- Fixed `.gitignore` generation (renamed `gitignore.hbs` → `.gitignore.hbs`)
- Removed manual shell integration actions (apps come from API)
- Deleted user-specific `.env.local.hbs` template

**Documentation:**

- Updated README.md and CLAUDE.md with all recent changes
- Clarified API-based navigation vs manual route updates

**Latest Improvements (January 2025):**

**DataTable V2 Enhancements:**

- Default filter mode changed from "toolbar" to "inline" for better UX
- Added visual sorting indicators (↑/↓) in column headers
- Conditional footer rendering - no gray area when footer undefined
- Client-side loading/error states support (not just serverSide mode)
- Configurable position for actions column (`actions.pinRight` - defaults to right)
- Configurable position for selection column (`features.selection.pinLeft` - defaults to left)
- Automatic column pinning based on position metadata

**Performance Optimizations (TanStack Table-validated):**

- Memoized internal class objects (cellPaddingClasses, variantClasses, densityClasses)
- Optimized duplicate `getVisibleCells()` calls (2 per row → 1 per row)
- Added comprehensive consumer documentation about memoization requirements
- All optimizations verified against official TanStack Table best practices

**Dynamic Icon System:**

- Documented rationale for lucide-react wildcard import (`import * as Icons`)
- Wildcard import is intentional for database-driven icon selection
- Tree-shaking would break dynamic icon lookup functionality
- Bundle size (~158 kB gzipped) shared across all micro-frontends via Module Federation
- No duplication, optimal for dynamic icon requirements

## OnePortal Admin - SuperUser Management Interface

**Location:** `apps/remote-oneportal-admin`  
**Purpose:** Administrative micro-frontend for managing users, applications, features, and roles

### Quick Reference

**Documentation:** See `docs/ONEPORTAL_ADMIN_FEATURES.md` for comprehensive guide

**Features:**

- User management (CRUD, activate/deactivate)
- Application management (CRUD, owner assignment)
- Feature management (CRUD, application context)
- Role management (grant/revoke app and feature roles)

**Key Technologies:**

- TanStack Query v5 - Data fetching with caching
- TanStack Form - Type-safe forms with Zod validation
- DataTable V2 - Advanced tables with filtering/sorting/pagination
- ComboboxField - Reusable searchable dropdown component

### Common Patterns

**1. Form Initialization (Critical):**

```typescript
// Correct: Initialize with data
const form = useAppForm({
  defaultValues: {
    name: entity.name,
    email: entity.email,
  },
  validators: { onChange: schema },
});

// Wrong: Empty defaults with useEffect
const form = useAppForm({ defaultValues: { name: "" } });
useEffect(() => {
  form.setFieldValue("name", entity.name);
}, [entity]);
```

**2. ComboboxField Usage:**

```typescript
<form.Field name="userId">
  {(field) => (
    <ComboboxField
      value={(field.state.value as string) || ""}
      onValueChange={(value) => {
        field.handleChange(value);
        setCurrentUserId(value); // For reactive queries
      }}
      options={users.map(u => ({ value: u.id, label: u.name }))}
      disabled={!prerequisite}
    />
  )}
</form.Field>
```

**3. DataTable V2 Configuration:**

```typescript
<DataTable
  data={items}
  columns={columns}
  features={{
    filtering: { enabled: true },
    sorting: { enabled: true },
    pagination: { enabled: true, pageSize: 10 }
  }}
  persistState={true}
  stateKey="table-state-key"
/>
```

**4. State Synchronization:**

```typescript
// Sync local state when sheet opens with pre-selected value
useEffect(() => {
  if (open && selectedValue) {
    setCurrentValue(selectedValue);
  }
}, [open, selectedValue]);
```

### API Integration

**Structure:**

- `src/api/client.ts` - Authenticated API functions
- `src/api/constants.ts` - Endpoint definitions (factory functions)
- `src/api/types.ts` - Request/response TypeScript types

**Base URL:** `VITE_SHELL_ADMIN_FUNCTIONAPP_API_BASE_URL`

**Latest Changes (v1.0.1):**

- Applications include `applicationName` in all responses
- Features include `applicationName` and `featureName`
- Roles include `applicationName` and `featureName` for display
- Owner field required (no longer optional)

### Feature Structure

```
src/features/{feature}/
├── components/          # UI components (pages, sheets, tables)
├── hooks/              # TanStack Query hooks (useX, useCreateX, etc.)
├── schemas/            # Zod validation schemas
└── columns/            # DataTable column definitions
```

**Current Features:**

- `users/` - User CRUD operations
- `applications/` - Application management with owners
- `features/` - Feature management with app context
- `roles/` - Role-based access control (grant/revoke)

### Role Management Specifics

**Business Rules:**

- User must have app-level role before feature-level role
- One role per user per application/feature (replace on grant)
- Revoking app role cascades to all feature roles
- Operations are idempotent

**Prerequisite Validation:**

```typescript
const hasAppAccess = appRoles?.some(
  (role) => role.applicationIdentifier === currentAppId,
);

const showWarning = currentUserId && currentAppId && !hasAppAccess;
```

**Navigation:**

- "Roles" menu item (order: 4)
- Shield icon from Lucide React
- Route: `/dashboard/roles`

### Development Checklist

When adding new admin features:

1. Define types in `src/api/types.ts`
2. Add endpoints to `src/api/constants.ts`
3. Implement API functions in `src/api/client.ts`
4. Create Zod schemas in `features/{feature}/schemas/`
5. Create hooks in `features/{feature}/hooks/`
6. Create components in `features/{feature}/components/`
7. Create column definitions for DataTable
8. Add route in `src/routes/dashboard/{feature}.tsx`
9. Add to `src/config/menu.ts`
10. Map icon in `src/components/AppSidebar.tsx`
11. Test TypeScript compilation
12. Document reusable patterns

### Common Pitfalls

**Avoid:**

- Using `form.useStore()` (not available in TanStack Form)
- Individual `enableX` props on DataTable (use `features` object)
- Forgetting type assertions for `field.state.value`
- Initializing forms with empty values
- Displaying GUIDs instead of names in tables
- Not syncing state when sheets open with pre-selected values

**Best Practices:**

- Initialize forms with entity data
- Use ComboboxField for searchable dropdowns
- Invalidate caches after mutations
- Show confirmation dialogs for destructive actions
- Display human-readable names (not GUIDs)
- Use optimistic updates for instant feedback

## Package Manager

**Always use pnpm** (version 10.19.0 specified in package.json)

- `pnpm install` - Install dependencies
- `pnpm add {package}` - Add dependency to root
- `pnpm --filter {workspace} add {package}` - Add to specific workspace
- Turborepo tasks automatically filter to correct workspaces
