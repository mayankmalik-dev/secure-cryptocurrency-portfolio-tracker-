import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTopCoins, MarketData } from '../services/cryptoService';
import { ArrowUpRight, ArrowDownRight, Search as SearchIcon } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface MarketTableProps {
  onCoinClick?: (coin: MarketData) => void;
}

export const MarketTable: React.FC<MarketTableProps> = ({ onCoinClick }) => {
  const { currency, symbol } = useCurrency();
  const [coins, setCoins] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadMarket = async () => {
      try {
        const data = await fetchTopCoins(20, currency);
        setCoins(data);
      } catch (error) {
        console.error('Error loading market table:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMarket();
  }, []);

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Market Discovery</h2>
          <p className="text-sm text-muted-foreground">Access live data for top cryptocurrencies</p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search coins..." 
            className="bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary/30 text-xs text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Asset</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
              <th className="px-6 py-4 font-medium text-right">24h Change</th>
              <th className="px-6 py-4 font-medium text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-24"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-16 ml-auto"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-12 ml-auto"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-20 ml-auto"></div></td>
                </tr>
              ))
            ) : (
              filteredCoins.map((coin) => (
                <tr 
                  key={coin.id} 
                  className="hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => onCoinClick?.(coin)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <div>
                        <div className="font-semibold text-foreground text-sm">{coin.name}</div>
                        <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-sm">
                    {symbol}{coin.current_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1 text-sm font-medium ${
                      coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                    {symbol}{(coin.market_cap / 1e9).toFixed(2)}B
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
