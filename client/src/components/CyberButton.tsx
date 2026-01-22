import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'destructive' | 'outline';
  isLoading?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', children, isLoading, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-black hover:bg-primary/90 border border-primary",
      destructive: "bg-destructive text-black hover:bg-destructive/90 border border-destructive",
      outline: "bg-transparent text-primary border border-primary hover:bg-primary/10",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "clip-path-polygon-[0_0,100%_0,100%_100%,0_100%]", // Can add custom shapes here later
          variants[variant],
          className
        )}
        {...props}
      >
        {/* Decorators */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
        
        <div className="flex items-center justify-center gap-2">
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {children}
        </div>
      </motion.button>
    );
  }
);

CyberButton.displayName = 'CyberButton';
