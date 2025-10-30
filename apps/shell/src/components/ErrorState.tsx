import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
}

export function ErrorState({
  title = "Error Loading Application",
  message = "Failed to load application data. Please try again later.",
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px] p-8">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 blur-3xl opacity-50" />
        <div className="relative backdrop-blur-xl bg-card/50 border border-destructive/20 rounded-2xl shadow-2xl p-12">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
