import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  action?: React.ReactNode;
}

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, label, action, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={cn(
              "w-full bg-black border border-primary/30 px-4 py-3",
              "text-primary font-mono placeholder:text-primary/30",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
              "transition-all duration-200",
              className
            )}
            {...props}
          />
          {action && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {action}
            </div>
          )}
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-1 h-1 bg-primary pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';
