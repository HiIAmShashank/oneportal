import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("remote-app", {
    description:
      "Generate a new remote application (micro-frontend) for OnePortal",
    prompts: [
      {
        type: "input",
        name: "appName",
        message:
          'What is the app name? (lowercase, no spaces, e.g., "analytics")',
        validate: (input: string) => {
          if (!input) return "App name is required";
          if (!/^[a-z][a-z0-9-]*$/.test(input))
            return "App name must start with a letter and contain only lowercase letters, numbers, and hyphens";
          return true;
        },
      },
      {
        type: "input",
        name: "displayName",
        message: 'Display name for the app? (e.g., "Analytics Dashboard")',
        validate: (input: string) => {
          if (!input) return "Display name is required";
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Short description of the app?",
        default: "A remote micro-frontend application",
      },
      {
        type: "number",
        name: "displayOrder",
        message: "Display order in navigation? (1, 2, 3...)",
        default: 3,
      },
      // Optional Features
      {
        type: "confirm",
        name: "includeDocumentation",
        message:
          "Include OnePortal documentation routes? (Explains OnePortal architecture)",
        default: false,
      },
      {
        type: "confirm",
        name: "includeExampleDashboard",
        message:
          "Include example dashboard with nested routes? (Events, Tasks, Workflows)",
        default: false,
        when: (answers: Record<string, unknown>) =>
          !answers.includeDocumentation,
      },
    ],
    actions: [
      // Create the app directory and files from template
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/apps/remote-{{ appName }}",
        base: "templates/remote-app",
        templateFiles: "templates/remote-app/**/*",
        globOptions: {
          dot: true, // Include dotfiles like .env.local.example, .gitignore.hbs
        },
        skipIfExists: false,
      },
      // Custom action to display next steps
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function (answers: Record<string, any>) {
        const appName = answers.appName || "unknown";
        const includeDocumentation = answers.includeDocumentation || false;
        const includeExampleDashboard =
          answers.includeExampleDashboard || false;

        // eslint-disable-next-line no-console
        console.log("\nRemote app created successfully!\n");
        // eslint-disable-next-line no-console
        console.log("Location:", `apps/remote-${appName}`);
        // eslint-disable-next-line no-console
        console.log("\nFiles generated:");
        // eslint-disable-next-line no-console
        console.log(
          "   - Core app structure (App.tsx, bootstrap.tsx, main.tsx)",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   - Authentication setup (msalInstance with factory pattern)",
        );
        // eslint-disable-next-line no-console
        console.log("   - Protected routing (__root.tsx with route guards)");
        // eslint-disable-next-line no-console
        console.log(
          "   - Layout system (AppLayout, AppSidebar, AppBreadcrumb)",
        );
        // eslint-disable-next-line no-console
        console.log("   - Menu configuration system");

        if (includeDocumentation) {
          // eslint-disable-next-line no-console
          console.log(
            "   - Menu structure for OnePortal documentation (8 menu items)",
          );
          // eslint-disable-next-line no-console
          console.log(
            "      Note: Only menu structure created. Copy route files from apps/remote-domino/src/routes/",
          );
        } else if (includeExampleDashboard) {
          // eslint-disable-next-line no-console
          console.log(
            "   - Menu structure for dashboard example (4 menu items with nesting)",
          );
          // eslint-disable-next-line no-console
          console.log(
            "      Note: Only menu structure created. Add route files manually in src/routes/",
          );
        } else {
          // eslint-disable-next-line no-console
          console.log("   - Minimal menu (home and about)");
        }
        // eslint-disable-next-line no-console
        console.log("   - Base routes: index, sign-in, auth/callback");

        // eslint-disable-next-line no-console
        console.log(
          "   - .env.local.example with required environment variables",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   - Configuration files (package.json, vite.config.ts, tsconfig, eslint)",
        );
        // eslint-disable-next-line no-console
        console.log("\nShell integration:");
        // eslint-disable-next-line no-console
        console.log("   - Auto-discovered by scripts/combine-builds.js");
        // eslint-disable-next-line no-console
        console.log(
          "   Shell navigation is automatic via API (/applications endpoint)",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   No manual route updates needed - apps appear when API returns them",
        );
        // eslint-disable-next-line no-console
        console.log("\nNext steps:");
        // eslint-disable-next-line no-console
        console.log(`   1. cd apps/remote-${appName}`);
        // eslint-disable-next-line no-console
        console.log("   2. pnpm install");
        // eslint-disable-next-line no-console
        console.log(
          "   3. Copy .env.local.example to .env.local and configure Azure AD:",
        );
        // eslint-disable-next-line no-console
        console.log(`      cp .env.local.example .env.local`);
        // eslint-disable-next-line no-console
        console.log(
          "      # Edit .env.local with your Azure AD app registration details",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   4. pnpm dev  # Start standalone mode to generate route tree",
        );
        // eslint-disable-next-line no-console
        console.log("      # Visit http://localhost:5173");
        // eslint-disable-next-line no-console
        console.log("   5. pnpm build  # Verify production build succeeds");
        // eslint-disable-next-line no-console
        console.log("   6. cd ../..");
        // eslint-disable-next-line no-console
        console.log("   7. pnpm build  # Build all apps");
        // eslint-disable-next-line no-console
        console.log(
          "   8. node scripts/combine-builds.js  # Prepare deployment",
        );
        // eslint-disable-next-line no-console
        console.log("   9. pnpm swa:start  # Test integrated mode");
        // eslint-disable-next-line no-console
        console.log(`      # Visit http://localhost:4280/apps/${appName}`);
        // eslint-disable-next-line no-console
        console.log("\nImportant notes:");
        // eslint-disable-next-line no-console
        console.log("   - Configure Azure AD app registration before running");
        // eslint-disable-next-line no-console
        console.log("   - Add .env.local to .gitignore (already configured)");
        // eslint-disable-next-line no-console
        console.log("   - Each developer needs their own .env.local file");
        // eslint-disable-next-line no-console
        console.log(
          "   - Authentication uses UnifiedAuthProvider from @one-portal/auth",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   - App uses factory pattern: createMsalInstanceWithConfig()",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   - CSS is provided by @one-portal/ui package (centralized)",
        );
        // eslint-disable-next-line no-console
        console.log(
          "   - Module Federation shares: react, react-dom, react-query, react-router, lucide-react",
        );
        // eslint-disable-next-line no-console
        console.log("\nCustomization:");
        // eslint-disable-next-line no-console
        console.log(
          `   - Update menu: apps/remote-${appName}/src/config/menu.ts`,
        );
        // eslint-disable-next-line no-console
        console.log(`   - Add routes: apps/remote-${appName}/src/routes/`);
        // eslint-disable-next-line no-console
        console.log(
          `   - Customize layout: apps/remote-${appName}/src/components/AppLayout.tsx`,
        );

        return "Generator completed successfully!";
      },
    ],
  });
}
