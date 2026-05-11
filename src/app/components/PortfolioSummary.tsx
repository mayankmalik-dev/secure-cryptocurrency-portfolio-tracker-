import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { cryptoAssets as mockAssets, CryptoAsset } from "../data/mockData";
import { LiveIndicator } from "./LiveIndicator";
import { useCurrency } from "../context/CurrencyContext";

interface PortfolioSummaryProps {
  assets?: CryptoAsset[];
}

export function PortfolioSummary({ assets = mockAssets }: PortfolioSummaryProps) {
  const { symbol } = useCurrency();
  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0);
  const totalProfitLoss = assets.reduce((sum, asset) => sum + asset.profitLoss, 0);
  const totalProfitLossPercent = (totalProfitLoss / (totalValue - totalProfitLoss || 1)) * 100;
  const isProfit = totalProfitLoss >= 0;

  return (
    <div>
      {/* Live Indicator */}
      <div className="flex justify-end mb-4">
        <LiveIndicator />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Balance</span>
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-foreground mb-1"
          >
            {symbol}{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>
          <div className="text-xs text-muted-foreground">USD</div>
        </motion.div>

        {/* Total Profit/Loss */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`border rounded-xl p-6 backdrop-blur-sm ${
            isProfit 
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30' 
              : 'bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Profit/Loss</span>
            <div className={`p-2 rounded-lg ${isProfit ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {isProfit ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            className={`text-3xl font-bold mb-1 ${
              isProfit ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isProfit ? '+' : ''}{symbol}{totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>
          <div className={`text-xs ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
          </div>
        </motion.div>

        {/* 24h Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <div className="p-2 bg-secondary rounded-lg">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
            className="text-3xl font-bold text-emerald-400 mb-1"
          >
            +2.34%
          </motion.div>
          <div className="text-xs text-muted-foreground">
            +{symbol}1,542.67
          </div>
        </motion.div>
      </div>
    </div>
  );
}