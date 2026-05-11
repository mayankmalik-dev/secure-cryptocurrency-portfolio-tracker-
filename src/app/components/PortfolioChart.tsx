import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { generateChartData } from "../data/mockData";
import { useCurrency } from "../context/CurrencyContext";

const timeframes = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "1Y", days: 365 },
];

export function PortfolioChart() {
  const { symbol, currency } = useCurrency();
  const [selectedTimeframe, setSelectedTimeframe] = useState(7);
  
  // Use useMemo to ensure data is stable but recalculates on timeframe/currency change
  const chartData = useMemo(() => {
    const data = generateChartData(selectedTimeframe);
    // If currency is INR, we multiply mock values for a realistic feel
    if (currency === 'inr') {
      return data.map(item => ({
        ...item,
        value: item.value * 83 // Approximate conversion for mock data
      }));
    }
    return data;
  }, [selectedTimeframe, currency]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Portfolio Analytics</h2>
          <p className="text-sm text-muted-foreground">Real-time performance tracking in {currency.toUpperCase()}</p>
        </div>
        
        {/* Time Filters */}
        <div className="flex gap-1 bg-secondary/50 border border-border/50 rounded-xl p-1 w-fit">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.label}
              onClick={() => setSelectedTimeframe(timeframe.days)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedTimeframe === timeframe.days
                  ? "bg-primary text-black shadow-lg shadow-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container with fixed height and relative position for ResponsiveContainer */}
      <div className="h-[350px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValuePortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5B700" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F5B700" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (selectedTimeframe === 1) {
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.2)"
              orientation="right"
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}k`;
                return `${symbol}${value}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0A0A0B',
                border: '1px solid rgba(245, 183, 0, 0.2)',
                borderRadius: '12px',
                color: '#E5E7EB',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Portfolio Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F5B700"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValuePortfolio)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}