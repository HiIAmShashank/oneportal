# @one-portal/ui

Shared UI component library for the One Portal monorepo, built with React, Tailwind CSS v4, and shadcn/ui.

## Package Exports

This package provides both React components and compiled CSS:

```json
{
  ".": "./src/index.ts",           // React components (Header, Counter, Auth, etc.)
  "./styles.css": "./dist/styles.css" // Compiled Tailwind CSS
}
```

### Component Usage

```typescript
import { Header, Counter } from '@one-portal/ui';
import { LoginButton } from '@one-portal/ui/auth';

function App() {
  return (
    <>
      <Header />
      <Counter />
      <LoginButton />
    </>
  );
}
```

### CSS Usage

Import the compiled styles in your app's entry point:

```typescript
// apps/shell/src/main.tsx
import '@one-portal/ui/styles.css';
```

## Styling Architecture

This package uses **Tailwind CSS v4** with centralized configuration from `@one-portal/tailwind-config`:

- **Design Tokens**: Colors, spacing, typography, shadows defined in `@one-portal/tailwind-config/tokens`
- **Theme Variables**: Light/dark mode CSS custom properties in `src/theme.css`
- **Compiled Output**: Single `dist/styles.css` file exported to consuming apps

### Building Styles

```bash
# Build CSS (runs automatically in CI)
pnpm --filter @one-portal/ui build

# Watch mode for development
pnpm --filter @one-portal/ui dev
```

## Adding New Components

### 1. Using shadcn/ui CLI (Recommended)

```bash
# Add a specific component (e.g., button, card, dialog)
pnpm --filter @one-portal/ui dlx shadcn@latest add button

# Add multiple components
pnpm --filter @one-portal/ui dlx shadcn@latest add button card dialog
```

Components are automatically:
- Installed to `@/components/ui/` (resolves to `packages/ui/components/ui/`)
- Configured with proper Tailwind classes
- Typed with TypeScript

### 2. Manual Component Creation

If creating custom components:

1. **Create component file** in `components/` or appropriate subdirectory
2. **Use Tailwind classes** from the centralized token system
3. **Export from index** - Add to `src/index.ts` or category index (e.g., `components/auth/index.ts`)
4. **Follow naming conventions** - PascalCase for components, descriptive names

Example:

```typescript
// components/custom-widget.tsx
export function CustomWidget() {
  return (
    <div className="rounded-lg bg-primary p-4 text-primary-foreground">
      Custom content
    </div>
  );
}

// src/index.ts
export { CustomWidget } from '../components/custom-widget';
```

### 3. Component Guidelines

- **Accessibility**: Use semantic HTML and ARIA attributes
- **Theming**: Leverage CSS custom properties for light/dark mode
- **Isolation**: Components should not depend on app-specific context
- **Testing**: Write unit tests for complex logic

## Versioning Policy

This package follows **workspace versioning**:

- Version is always `0.0.0` in package.json (development mode)
- Consuming apps use `workspace:*` protocol for dependency
- Changes are available immediately via pnpm workspace linking
- No publishing to npm - internal monorepo package only

### Making Breaking Changes

If you need to make breaking changes:

1. **Coordinate with app teams** - Check all consumers in `apps/`
2. **Update all imports** - Use global search to find usages
3. **Test all apps** - Run `pnpm run dev` from root and verify each app
4. **Document migration** - Add notes to this README if migration is complex

## Development Workflow

### Local Development

```bash
# Watch mode - rebuilds CSS on file changes
pnpm --filter @one-portal/ui dev

# Run from root to start all apps
pnpm run dev
```

### Hot Module Replacement (HMR)

Changes to components trigger HMR in consuming apps within ~2 seconds. If you modify:

- **React components** - HMR updates automatically
- **CSS/Tailwind classes** - Rebuild with `pnpm --filter @one-portal/ui build`
- **Theme tokens** - Update `@one-portal/tailwind-config`, then rebuild

### Troubleshooting

**Styles not updating?**
```bash
# Clear build cache and rebuild
rm -rf packages/ui/dist
pnpm --filter @one-portal/ui build
```

**TypeScript errors?**
```bash
# Regenerate type declarations
pnpm --filter @one-portal/ui typecheck
```

**Import errors in apps?**
```bash
# Reinstall workspace dependencies
pnpm install
```

## Architecture

```
packages/ui/
├── src/
│   ├── index.ts          # Main export file
│   ├── index.css         # CSS entry point (@import "tailwindcss")
│   └── theme.css         # Light/dark CSS custom properties
├── components/
│   ├── header.tsx        # Shared navigation header
│   ├── counter.tsx       # Example stateful component
│   └── auth/             # Authentication UI components
├── @/                    # Alias for components/ (shadcn convention)
├── dist/
│   └── styles.css        # Compiled Tailwind CSS (exported)
├── tailwind.config.js    # Extends @one-portal/tailwind-config
└── package.json          # Exports: components + CSS
```

## Dependencies

- **React 19** - UI framework
- **@one-portal/tailwind-config** - Centralized design system
- **Tailwind CSS v4** - Utility-first CSS framework
- **@tailwindcss/cli** - CSS compilation
- **shadcn/ui** - Accessible component primitives

## Related Packages

- [`@one-portal/tailwind-config`](../tailwind-config/README.md) - Design tokens and base Tailwind configuration
- [`@one-portal/auth`](../auth/README.md) - Authentication logic and hooks
- [`@one-portal/types`](../types/README.md) - Shared TypeScript types
