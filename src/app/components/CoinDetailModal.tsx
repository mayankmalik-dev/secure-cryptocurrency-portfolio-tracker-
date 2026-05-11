import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { fetchCoinChartData } from '../services/cryptoService';
import { useCurrency } from '../context/CurrencyContext';

interface CoinDetailModalProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    image?: string;
    current_price?: number;
    price_change_percentage_24h?: number;
  } | null;
  onClose: () => void;
}

export const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ coin, onClose }) => {
  const { currency, symbol } = useCurrency();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (coin) {
      const loadChart = async () => {
        setLoading(true);
        setError(false);
        try {
          const data = await fetchCoinChartData(coin.id, days, currency);
          if (data && data.prices && data.prices.length > 0) {
            const formattedData = data.prices.map(([timestamp, value]) => ({
              timestamp,
              value
            }));
            setChartData(formattedData);
          } else {
            throw new Error('Empty data');
          }
        } catch (err) {
          console.error('Chart load error:', err);
          setError(true);
          // Fallback data for visual consistency if API fails
          setChartData([]);
        } finally {
          setLoading(false);
        }
      };
      loadChart();
    }
  }, [coin, days, currency]);

  if (!coin) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-background rounded-2xl p-2 border border-border shadow-inner">
                <img src={coin.image} alt={coin.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{coin.name}</h2>
                  <span className="text-sm font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">{coin.symbol}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Live Market Analysis
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-xl transition-all text-muted-foreground hover:text-foreground active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/20 rounded-2xl p-5 border border-border/50">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Price Value</div>
                <div className="text-3xl font-bold text-foreground">
                  {symbol}{coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-secondary/20 rounded-2xl p-5 border border-border/50">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">24h Growth</div>
                <div className={`text-3xl font-bold flex items-center gap-2 ${
                  (coin.price_change_percentage_24h || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {(coin.price_change_percentage_24h || 0) >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                </div>
              </div>
              <div className="bg-secondary/20 rounded-2xl p-5 border border-border/50 flex flex-col justify-center">
                <div className="flex gap-1 bg-background/50 rounded-xl p-1.5 w-fit border border-border/30">
                  {[1, 7, 30, 365].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        days === d ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      {d === 1 ? '1D' : d === 7 ? '7D' : d === 30 ? '1M' : '1Y'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-80 w-full relative bg-secondary/5 rounded-2xl border border-border/20 p-4">
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/40 z-20 backdrop-blur-md rounded-2xl">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <span className="mt-4 text-sm font-medium text-primary animate-pulse">Syncing Market Data...</span>
                </div>
              )}

              {error && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
                  <h3 className="text-lg font-bold text-foreground">API Limit Reached</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">CoinGecko is busy. Please wait a moment or check back shortly for live charts.</p>
                </div>
              )}

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5B700" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F5B700" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    hide 
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    orientation="right"
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fontSize: 10, fontWeight: 500 }}
                    tickFormatter={(val) => `${symbol}${val.toLocaleString()}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0A0A0B', 
                      border: '1px solid rgba(245,183,0,0.3)', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: any) => [`${symbol}${value.toLocaleString()}`, 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F5B700" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 border-t border-border bg-secondary/20 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Close Insight
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
