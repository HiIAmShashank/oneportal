import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn('inline-block', className)}
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full border-primary border-t-transparent',
            sizeMap[size]
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner };
