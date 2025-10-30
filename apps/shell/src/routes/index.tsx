import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@one-portal/auth/hooks";
import { Card, CardContent } from "@one-portal/ui";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { state } = useAuth();
  const { isAuthenticated, userProfile } = state;

  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <div className="flex h-[calc(100vh-70px)] justify-center bg-linear-to-br from-primary/20 via-secondary/30 to-primary/20 dark:from-primary/10 dark:via-secondary/15 dark:to-primary/10">
      <div className="flex flex-col gap-8 w-full max-w-6xl px-4 pt-5">
        {/* Hero Section */}
        <div className="flex flex-col gap-4 items-center text-center">
          {userProfile?.name && (
            <p className="text-3xl md:text-4xl font-bold">
              Hello, <span className="text-primary">{userProfile.name}</span>
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-muted-foreground">
            Welcome to{" "}
            <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              OnePortal
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Your unified hub for accessing all Mott MacDonald applications in
            one seamless experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Fast & Seamless</h3>
                <p className="text-sm text-muted-foreground">
                  Applications load instantly with our micro-frontend
                  architecture
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-4 rounded-full bg-secondary/10">
                  <svg
                    className="w-8 h-8 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Secure Access</h3>
                <p className="text-sm text-muted-foreground">
                  Single sign-on with Azure AD ensures secure authentication
                  across all apps
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Unified Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Access all your applications from one central location with
                  consistent design
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg">
          <CardContent className="flex flex-col gap-6 pt-8 pb-8 items-center">
            <h2 className="text-2xl font-bold text-center">Getting Started</h2>
            <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
              <div className="flex flex-col gap-3 items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  1
                </div>
                <h4 className="font-semibold">Browse Applications</h4>
                <p className="text-sm text-muted-foreground">
                  Use the sidebar or command palette to explore available
                  applications
                </p>
              </div>

              <div className="flex flex-col gap-3 items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground font-bold text-lg">
                  2
                </div>
                <h4 className="font-semibold">Navigate Seamlessly</h4>
                <p className="text-sm text-muted-foreground">
                  Click any application to load it instantly in this workspace
                </p>
              </div>

              <div className="flex flex-col gap-3 items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  3
                </div>
                <h4 className="font-semibold">Work Efficiently</h4>
                <p className="text-sm text-muted-foreground">
                  Switch between apps without losing your context or session
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tip */}
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <svg
            className="w-5 h-5 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            <strong>Tip:</strong> Press{" "}
            <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">
              Ctrl+K
            </kbd>{" "}
            to open the command palette
          </span>
        </div>
      </div>
    </div>
  );
}
