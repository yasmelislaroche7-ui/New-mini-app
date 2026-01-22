import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string | number | ReactNode;
  subValue?: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function MetricCard({ label, value, subValue, icon, isLoading }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur border border-primary/20 p-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000 pointer-events-none" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</h3>
          
          {isLoading ? (
             <div className="h-8 w-24 bg-primary/10 animate-pulse rounded mt-2" />
          ) : (
            <div className="text-2xl font-bold font-mono text-primary glow-text tracking-tighter">
              {value}
            </div>
          )}
          
          {subValue && (
            <p className="text-xs text-primary/60 font-mono mt-1">{subValue}</p>
          )}
        </div>
        
        {icon && (
          <div className="text-primary/40 group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
