import { Spinner } from '../ui/spinner';

interface AuthLoadingSpinnerProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Provides ARIA attributes for screen readers
 */
export function AuthLoadingSpinner({
  title = 'Initializing authentication...',
  description = 'Please wait while we set up your session.',
  className = ''
}: AuthLoadingSpinnerProps) {
  return (
    <div className='flex flex-col gap-2 items-center'>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Spinner size="md" aria-label={title} aria-describedby={description} className={className} />
    </div>
  );
}
