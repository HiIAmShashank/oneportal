import { Search } from "lucide-react";

interface NotFoundStateProps {
  title?: string;
  message?: string;
  identifier?: string;
}

export function NotFoundState({
  title = "Not Found",
  message,
  identifier,
}: NotFoundStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px] p-8">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 blur-3xl opacity-50" />
        <div className="relative backdrop-blur-xl bg-card/50 border border-border/50 rounded-2xl shadow-2xl p-12">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-muted/20 blur-xl rounded-full" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              {message && (
                <p className="text-sm text-muted-foreground">
                  {identifier ? (
                    <>
                      {message}{" "}
                      <span className="font-mono text-foreground">
                        "{identifier}"
                      </span>
                    </>
                  ) : (
                    message
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
