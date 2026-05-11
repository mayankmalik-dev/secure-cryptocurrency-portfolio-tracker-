import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface QuickStatsProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function QuickStats({ label, value, change, icon: Icon, trend = 'neutral', delay = 0 }: QuickStatsProps) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      {change && (
        <div className={`text-sm ${trendColors[trend]}`}>
          {change}
        </div>
      )}
    </motion.div>
  );
}
