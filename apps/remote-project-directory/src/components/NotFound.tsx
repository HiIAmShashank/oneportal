import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex h-[calc(100vh-70px)] justify-center bg-linear-to-br from-primary/20 via-secondary/30 to-primary/20 dark:from-primary/10 dark:via-secondary/15 dark:to-primary/10 px-4">
      <div className="flex flex-col gap-6 items-center text-center pt-4">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-muted-foreground/30 select-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Oops! The page you're looking for seems to have wandered off into
            the digital wilderness.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-muted-foreground">
          Error Code: 404 | Page Not Found
        </p>
      </div>
    </div>
  );
}

export default NotFound;
