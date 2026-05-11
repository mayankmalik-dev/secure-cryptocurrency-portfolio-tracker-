import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatusBadgeProps {
  type: 'profit' | 'loss' | 'neutral';
  value: number;
  showIcon?: boolean;
}

export function StatusBadge({ type, value, showIcon = true }: StatusBadgeProps) {
  const config = {
    profit: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      icon: TrendingUp,
    },
    loss: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: TrendingDown,
    },
    neutral: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      icon: Minus,
    }
  };

  const { bg, text, icon: Icon } = config[type];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${bg} ${text}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      <span className="text-xs font-medium">
        {type === 'profit' ? '+' : type === 'loss' ? '-' : ''}{Math.abs(value).toFixed(2)}%
      </span>
    </div>
  );
}
