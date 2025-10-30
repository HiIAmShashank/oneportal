import { useEffect, useState } from 'react';
import { Spinner } from '@one-portal/ui';

interface LoadingIndicatorProps {
  delay?: number;
  className?: string;
  message?: string;
}

export function LoadingIndicator({
  delay = 200,
  className = '',
  message = 'Loading application...',
}: LoadingIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`flex min-h-[400px] flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Spinner className="h-12 w-12" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
