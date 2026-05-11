import { useState } from "react";
import { motion } from "motion/react";
import { AssetCard } from "../components/AssetCard";
import { PortfolioChart } from "../components/PortfolioChart";
import { ArrowUpDown } from "lucide-react";
import { useCryptoData } from "../hooks/useCryptoData";
import { LoadingState } from "../components/LoadingState";
import { CoinDetailModal } from "../components/CoinDetailModal";
import { useCurrency } from "../context/CurrencyContext";

type SortOption = 'value' | 'profitLoss' | 'change24h' | 'name';

export function Portfolio() {
  const { assets, loading } = useCryptoData();
  const { symbol } = useCurrency();
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCoin, setSelectedCoin] = useState<any>(null);

  if (loading) {
    return <LoadingState />;
  }

  const sortedAssets = [...assets].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'value':
        comparison = a.totalValue - b.totalValue;
        break;
      case 'profitLoss':
        comparison = a.profitLoss - b.profitLoss;
        break;
      case 'change24h':
        comparison = a.change24h - b.change24h;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const handleCoinSelect = (coin: any) => {
    setSelectedCoin({
      id: coin.symbol, // Now using symbol for charting
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image || coin.icon,
      current_price: coin.current_price || coin.currentPrice,
      price_change_percentage_24h: coin.price_change_percentage_24h || coin.change24h
    });
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.totalValue, 0);
  const totalProfitLoss = assets.reduce((sum, asset) => sum + asset.profitLoss, 0);
  const totalProfitLossPercent = (totalProfitLoss / (totalValue - totalProfitLoss || 1)) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Overview</h1>
          <p className="text-muted-foreground">Detailed view of all your crypto holdings</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Total Portfolio Value</div>
          <div className="text-3xl font-bold text-foreground">
            {symbol}{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-semibold ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{symbol}{totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
          </div>
        </div>
      </motion.div>

      {/* Performance Chart */}
      <PortfolioChart />

      {/* Sort Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 bg-card border border-border rounded-xl p-4"
      >
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Sort by:
        </span>
        <div className="flex gap-2">
          {[
            { value: 'value' as SortOption, label: 'Total Value' },
            { value: 'profitLoss' as SortOption, label: 'Profit/Loss' },
            { value: 'change24h' as SortOption, label: '24h Change' },
            { value: 'name' as SortOption, label: 'Name' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => toggleSort(option.value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                sortBy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {option.label}
              {sortBy === option.value && (
                <span className="ml-2">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAssets.map((asset, index) => (
          <AssetCard 
            key={asset.id} 
            asset={asset} 
            index={index} 
            onClick={() => handleCoinSelect(asset)}
          />
        ))}
      </div>

      {/* Portfolio Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">Portfolio Distribution</h2>
        <div className="space-y-4">
          {assets.map((asset, index) => {
            const percentage = (asset.totalValue / totalValue) * 100;
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="cursor-pointer group"
                onClick={() => handleCoinSelect(asset)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center text-sm overflow-hidden group-hover:border-primary/50 border border-transparent transition-all">
                      {asset.icon.startsWith('http') ? (
                        <img src={asset.icon} alt={asset.name} className="w-5 h-5 object-contain" />
                      ) : (
                        asset.icon
                      )}
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{asset.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{percentage.toFixed(2)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.05 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Coin Insight Modal */}
      <CoinDetailModal 
        coin={selectedCoin} 
        onClose={() => setSelectedCoin(null)} 
      />
    </div>
  );
}
