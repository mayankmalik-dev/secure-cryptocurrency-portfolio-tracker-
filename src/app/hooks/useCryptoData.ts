import { useState, useEffect } from 'react';
import { cryptoAssets as initialAssets, CryptoAsset } from '../data/mockData';
import { fetchMarketData } from '../services/cryptoService';
import { useCurrency } from '../context/CurrencyContext';

export const useCryptoData = () => {
  const { currency } = useCurrency();
  const [assets, setAssets] = useState<CryptoAsset[]>(initialAssets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const symbols = initialAssets.map(asset => asset.symbol);
      const marketData = await fetchMarketData(symbols, currency);
      
      const updatedAssets = initialAssets.map(asset => {
        const apiData = marketData.find(m => m.symbol.toUpperCase() === asset.symbol.toUpperCase());
        if (apiData) {
          const currentPrice = apiData.current_price;
          const totalValue = currentPrice * asset.holdings;
          
          // Calculate realistic P/L based on mock percentages but using real current value
          const profitLoss = totalValue * (asset.profitLossPercent / 100);
          
          return {
            ...asset,
            currentPrice,
            totalValue,
            profitLoss,
            change24h: apiData.price_change_percentage_24h,
            icon: apiData.image
          };
        }
        return asset;
      });

      setAssets(updatedAssets);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching high-speed data:', err);
      setError('Failed to update market prices');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Fast 30s updates
    return () => clearInterval(interval);
  }, [currency]);

  return { assets, loading, error, refetch: loadData };
};
