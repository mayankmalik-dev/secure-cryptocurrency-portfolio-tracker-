import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTopCoins, MarketData } from '../services/cryptoService';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const LiveTicker: React.FC = () => {
  const { currency, symbol } = useCurrency();
  const [coins, setCoins] = useState<MarketData[]>([]);

  useEffect(() => {
    const loadTicker = async () => {
      try {
        const data = await fetchTopCoins(15, currency);
        setCoins(data);
      } catch (error) {
        console.error('Error loading ticker:', error);
      }
    };
    loadTicker();
    const interval = setInterval(loadTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) return null;

  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-y border-white/5 py-3 overflow-hidden select-none">
      <motion.div 
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Render twice for seamless loop */}
        {[...coins, ...coins].map((coin, i) => (
          <div key={`${coin.id}-${i}`} className="flex items-center gap-3">
            <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-white text-sm uppercase">{coin.symbol}</span>
            <span className="text-gray-300 text-sm">{symbol}{coin.current_price.toLocaleString()}</span>
            <span className={`text-xs flex items-center gap-0.5 ${
              coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {coin.price_change_percentage_24h >= 0 ? '+' : ''}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
