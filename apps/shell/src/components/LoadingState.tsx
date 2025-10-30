import { Spinner } from "@one-portal/ui";

interface LoadingStateProps {
  message?: string;
  title?: string;
}

export function LoadingState({
  title = "Loading Application",
  message = "Please wait while we fetch your application...",
}: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px] p-8">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-50 animate-pulse" />
        <div className="relative backdrop-blur-xl bg-card/50 border border-border/50 rounded-2xl shadow-2xl p-12">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Spinner size="lg" className="relative" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
