# Domino - Event System Management

A remote micro-frontend application for managing OnePortal's event system, including event definitions, subscribers, and debugging tools.

## Overview

**Location:** `apps/remote-domino`  
**Module Name:** `domino`  
**Module Federation Scope:** `domino`  
**Port (dev):** 5173  
**Port (standalone):** Same as dev

Domino provides comprehensive event system management capabilities for OnePortal, including event creation, subscriber management, and real-time debugging.

## Features

### Event Management

- **Event Definitions** - Create, view, update, and delete event types
- **Event Subscribers** - Manage which applications/components subscribe to events
- **Event History** - View historical event data and payloads
- **Event Testing** - Trigger test events for debugging

### Debug Tools

- **Event Inspector** - Real-time event monitoring and inspection
- **Subscriber Status** - Check subscriber health and connectivity
- **Event Replay** - Replay historical events for testing
- **Performance Metrics** - Track event processing times

## Technology Stack

### Core Dependencies

- **React 19** - UI framework
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Server state management
- **@one-portal/auth** - Unified authentication
- **@one-portal/ui** - Shared component library

### Specialized Libraries

- **json-edit-react** - JSON editing for event payloads
- **date-fns** - Date formatting and manipulation
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

### Running the App

```bash
# Run in isolation (standalone mode)
pnpm --filter @one-portal/remote-domino dev

# Run with entire monorepo
cd ../.. && pnpm dev
```

Access at `http://localhost:5173` (standalone) or `http://localhost:4280/apps/domino` (integrated with shell).

### Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
# Authentication (app-specific prefix: VITE_DOMINO_)
VITE_DOMINO_AUTH_CLIENT_ID=your-client-id
VITE_DOMINO_AUTH_AUTHORITY=https://login.microsoftonline.com/common
VITE_DOMINO_AUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_DOMINO_AUTH_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_DOMINO_AUTH_SCOPES=User.Read

# API Configuration
VITE_DOMINO_API_BASE_URL=https://api.oneportal.com/domino

# Shared variables
VITE_APP_MODE=auto
```

**Note:** `VITE_APP_MODE=auto` automatically detects standalone vs embedded mode.

### Build for Production

```bash
# Build with type checking
pnpm --filter @one-portal/remote-domino build

# Preview production build
pnpm --filter @one-portal/remote-domino preview
```

Build output: `dist/` with Module Federation entry at `dist/assets/remoteEntry.js`

## Project Structure

```
apps/remote-domino/
├── src/
│   ├── App.tsx                 # Router and QueryClient setup
│   ├── bootstrap.tsx           # Module Federation mount/unmount
│   ├── main.tsx                # Standalone entry point
│   ├── routeTree.gen.ts        # Auto-generated routes (DO NOT EDIT)
│   ├── api/                    # API client functions
│   ├── auth/
│   │   └── msalInstance.ts     # MSAL configuration
│   ├── components/
│   │   ├── AppLayout.tsx       # Main layout wrapper
│   │   ├── AppSidebar.tsx      # Navigation sidebar
│   │   └── AppBreadcrumb.tsx   # Breadcrumb navigation
│   ├── config/
│   │   ├── menu.ts             # Sidebar menu configuration
│   │   └── routes.ts           # Public routes list
│   ├── debug/
│   │   └── authDebug.ts        # Development auth helpers
│   ├── features/               # Feature-specific components/hooks
│   ├── hooks/                  # Shared React hooks
│   ├── routes/                 # File-based routes
│   ├── styles/                 # App-specific styles
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── vite.config.ts              # Vite + Module Federation config
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── .env.local.example          # Environment template
```

## Key Patterns

### useAuthenticatedQuery Hook

Domino uses the authenticated query pattern for all API calls:

```typescript
import { useAuthenticatedQuery } from "./hooks/useAuthenticatedQuery";
import { getEvents } from "./api/events";

export function useEvents() {
  return useAuthenticatedQuery(["events"], (token) => getEvents(token));
}
```

Benefits:

- Automatic token acquisition
- Authentication state handling
- Full React Query support
- Type-safe with generics

### Module Federation Bootstrap

Required exports in `bootstrap.tsx`:

```typescript
export async function mount(containerId: string): Promise<Root> {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container "${containerId}" not found`);

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <UnifiedAuthProvider
        msalInstance={msalInstance}
        mode="remote"
        appName="domino"
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

### Authentication Modes

- **Standalone** - Full OAuth redirect flow for local development
- **Embedded** - SSO silent authentication when loaded in shell
- **Auto-detection** - `VITE_APP_MODE=auto` chooses based on URL path

### Routing

File-based routing with TanStack Router:

- `src/routes/index.tsx` - Home/landing page
- `src/routes/events/` - Event management routes
- `src/routes/subscribers/` - Subscriber management routes
- `src/routes/debug/` - Debug tools and monitoring

Protected routes use `createProtectedRouteGuard()` in `__root.tsx`.

## Menu Configuration

Menu items defined in `src/config/menu.ts`:

```typescript
export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: "LayoutDashboard",
  },
  {
    label: "Events",
    path: "/events",
    icon: "Zap",
  },
  // ... more items
];
```

Icons use Lucide React names (dynamic import).

## Event System Integration

Domino provides tools for managing OnePortal's event-driven architecture:

### Event Postman Collection

Located in `docs/EventSystemPostmanCollection.json`:

- API endpoint examples
- Sample payloads
- Testing workflows

Import into Postman for quick API testing.

### Event Types

Common event structures:

```typescript
interface Event {
  eventId: string;
  eventType: string;
  source: string;
  timestamp: Date;
  payload: Record<string, unknown>;
  metadata: EventMetadata;
}

interface EventSubscriber {
  subscriberId: string;
  eventType: string;
  endpoint: string;
  isActive: boolean;
}
```

## Common Tasks

### Adding New Routes

1. Create route file in `src/routes/`
2. Route tree auto-generates on `pnpm dev`
3. Add menu item to `src/config/menu.ts`
4. Add icon mapping to `src/components/AppSidebar.tsx`

### Adding API Functions

1. Define types in `src/api/types.ts`
2. Create API function in `src/api/` (e.g., `events.ts`)
3. Create hook in `src/hooks/` using `useAuthenticatedQuery`
4. Use hook in component

Example:

```typescript
// src/api/events.ts
export async function getEvent(token: string, id: string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

// src/hooks/useEvent.ts
export function useEvent(id: string) {
  return useAuthenticatedQuery(["events", id], (token) => getEvent(token, id));
}

// Component
function EventDetails({ id }: { id: string }) {
  const { data, isLoading, error } = useEvent(id);
  // ... render
}
```

### Debugging Authentication

Enable debug mode in `.env.local`:

```bash
VITE_DEBUG=true
```

Or use browser console utilities:

```javascript
// Load debug tools
import("./debug/authDebug");

// Check auth state
window.__DOMINO_AUTH_DEBUG__();
```

## Testing

```bash
# Run tests (when implemented)
pnpm --filter @one-portal/remote-domino test

# Type checking
pnpm --filter @one-portal/remote-domino typecheck

# Linting
pnpm --filter @one-portal/remote-domino lint
```

## Deployment

Domino is deployed as part of the OnePortal monorepo:

1. Build all apps: `pnpm build`
2. Combine builds: `node scripts/combine-builds.js`
3. Deploy to Azure SWA: `pnpm swa:start` (local) or CI/CD pipeline

Deployment structure:

```
dist-deploy/
├── index.html          # Shell
├── domino/
│   ├── index.html
│   └── assets/
│       └── remoteEntry.js  # Module Federation entry
└── staticwebapp.config.json
```

## Troubleshooting

### CSS Not Loading

Verify conditional import in `main.tsx`:

```typescript
if (import.meta.env.DEV || import.meta.env.MODE === "preview") {
  await import("@one-portal/ui/styles.css");
}
```

### Module Federation Errors

1. Check `remoteEntry.js` exists: `dist/assets/remoteEntry.js`
2. Verify exports in `vite.config.ts`:
   ```typescript
   exposes: {
     './App': './src/App.tsx',
     './bootstrap': './src/bootstrap.tsx',
   }
   ```
3. Check shell can load remote URL

### Authentication Issues

1. Verify `.env.local` has correct `VITE_DOMINO_AUTH_*` variables
2. Check MSAL instance creation in `src/auth/msalInstance.ts`
3. Enable debug logging: `VITE_DEBUG=true`
4. Clear browser storage and retry

### Route Not Found

1. Check file exists in `src/routes/`
2. Restart dev server to regenerate `routeTree.gen.ts`
3. Verify route path in menu configuration

## Contributing

Follow OnePortal contribution guidelines:

1. Use TypeScript strict mode
2. Run `pnpm typecheck` before committing
3. Run `pnpm lint` and fix issues
4. Follow established patterns (see examples in codebase)
5. Update this README if adding major features

## Related Documentation

- **OnePortal Root:** `README.md` (monorepo overview)
- **CLAUDE.md** - Detailed architecture and patterns
- **Generator Docs:** `docs/generators/README.md`
- **Auth Package:** `packages/auth/README.md`
- **UI Package:** `packages/ui/README.md`

## License

Internal use only - Part of OnePortal monorepo.
