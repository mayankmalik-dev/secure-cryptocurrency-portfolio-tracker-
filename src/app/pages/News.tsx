import { useState } from "react";
import { motion } from "motion/react";
import { NewsCard } from "../components/NewsCard";
import { newsItems, cryptoAssets } from "../data/mockData";
import { Filter, Search } from "lucide-react";

type SentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

export function News() {
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');
  const [coinFilter, setCoinFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userCoins = ['all', ...cryptoAssets.map(asset => asset.symbol)];

  const filteredNews = newsItems.filter(news => {
    // Sentiment filter
    if (sentimentFilter !== 'all' && news.sentiment !== sentimentFilter) {
      return false;
    }

    // Coin filter
    if (coinFilter !== 'all' && !news.relatedCoins.includes(coinFilter)) {
      return false;
    }

    // Search filter
    if (searchQuery && !news.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Crypto News Feed</h1>
        <p className="text-muted-foreground">Stay updated with the latest news about your portfolio coins</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Sentiment Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sentiment:</span>
            <div className="flex gap-2">
              {(['all', 'positive', 'negative', 'neutral'] as SentimentFilter[]).map((sentiment) => (
                <button
                  key={sentiment}
                  onClick={() => setSentimentFilter(sentiment)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${
                    sentimentFilter === sentiment
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {sentiment}
                </button>
              ))}
            </div>
          </div>

          {/* Coin Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Coin:</span>
            <div className="flex gap-2 flex-wrap">
              {userCoins.map((coin) => (
                <button
                  key={coin}
                  onClick={() => setCoinFilter(coin)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    coinFilter === coin
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {coin === 'all' ? 'All Coins' : coin}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground pt-4 border-t border-border">
          Showing {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
        </div>
      </motion.div>

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((news, index) => (
            <NewsCard key={news.id} news={news} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No news found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </motion.div>
      )}
    </div>
  );
}
