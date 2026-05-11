import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { CryptoAsset } from "../data/mockData";
import { useCurrency } from "../context/CurrencyContext";

interface AssetCardProps {
  asset: CryptoAsset;
  index: number;
  onClick?: () => void;
}

export function AssetCard({ asset, index, onClick }: AssetCardProps) {
  const { symbol } = useCurrency();
  const isProfit = asset.profitLoss >= 0;
  const isChange24hPositive = asset.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245, 183, 0, 0.15)" }}
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center text-2xl overflow-hidden">
            {asset.icon.startsWith('http') ? (
              <img src={asset.icon} alt={asset.name} className="w-8 h-8 object-contain" />
            ) : (
              asset.icon
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{asset.name}</h3>
            <p className="text-sm text-muted-foreground">{asset.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
          isChange24hPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isChange24hPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span className="text-xs font-medium">
            {isChange24hPositive ? '+' : ''}{asset.change24h}%
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground mb-1">
          {symbol}{asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-muted-foreground">
          Holdings: {asset.holdings.toLocaleString()}
        </div>
      </div>

      {/* Value & P/L */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Total Value</div>
          <div className="font-semibold text-foreground">
            {symbol}{asset.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Profit/Loss</div>
          <div className={`font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{symbol}{Math.abs(asset.profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs ml-1">
              ({isProfit ? '+' : ''}{asset.profitLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
