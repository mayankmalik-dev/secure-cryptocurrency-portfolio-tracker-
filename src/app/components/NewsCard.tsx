import { motion } from "motion/react";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { NewsItem } from "../data/mockData";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export function NewsCard({ news, index }: NewsCardProps) {
  const sentimentConfig = {
    positive: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      icon: TrendingUp,
      label: 'Positive'
    },
    negative: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: TrendingDown,
      label: 'Negative'
    },
    neutral: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      icon: Minus,
      label: 'Neutral'
    }
  };

  const config = sentimentConfig[news.sentiment];
  const SentimentIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245, 183, 0, 0.1)" }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2 leading-snug">
            {news.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{news.source}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {news.timestamp}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex gap-2">
          {news.relatedCoins.map((coin) => (
            <span
              key={coin}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
            >
              {coin}
            </span>
          ))}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${config.bg} ${config.text}`}>
          <SentimentIcon className="w-3 h-3" />
          <span className="text-xs font-medium">{config.label}</span>
        </div>
      </div>
    </motion.div>
  );
}
