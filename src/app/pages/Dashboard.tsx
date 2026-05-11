import { useState } from "react";
import { PortfolioSummary } from "../components/PortfolioSummary";
import { AssetCard } from "../components/AssetCard";
import { PortfolioChart } from "../components/PortfolioChart";
import { NewsCard } from "../components/NewsCard";
import { LoadingState } from "../components/LoadingState";
import { MarketTable } from "../components/MarketTable";
import { CoinDetailModal } from "../components/CoinDetailModal";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { newsItems } from "../data/mockData";
import { motion } from "motion/react";
import { useCryptoData } from "../hooks/useCryptoData";

export function Dashboard() {
  const { assets, loading, error } = useCryptoData();
  const [selectedCoin, setSelectedCoin] = useState<any>(null);

  if (loading) {
    return <LoadingState />;
  }

  if (error && assets.length === 0) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  const userCoins = assets.map(asset => asset.symbol);
  const relevantNews = newsItems.filter(news => 
    news.relatedCoins.some(coin => userCoins.includes(coin))
  );

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Portfolio Summary */}
      <PortfolioSummary assets={assets} />

      {/* Chart */}
      <PortfolioChart />

      {/* Assets Grid */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Assets</h2>
          <p className="text-muted-foreground">Monitor your cryptocurrency holdings</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset, index) => (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              index={index} 
              onClick={() => handleCoinSelect(asset)}
            />
          ))}
        </div>
      </div>

      {/* Market Discovery Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <MarketTable onCoinClick={handleCoinSelect} />
      </motion.div>

      {/* Relevant News */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Relevant News</h2>
          <p className="text-muted-foreground">Latest updates about your portfolio coins</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relevantNews.slice(0, 4).map((news, index) => (
            <NewsCard key={news.id} news={news} index={index} />
          ))}
        </div>
      </div>

      {/* Coin Insight Modal */}
      <CoinDetailModal 
        coin={selectedCoin} 
        onClose={() => setSelectedCoin(null)} 
      />
    </motion.div>
  );
}