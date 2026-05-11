export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  currentPrice: number;
  holdings: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  change24h: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedCoins: string[];
  timestamp: string;
  image?: string;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export const cryptoAssets: CryptoAsset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    currentPrice: 67234.50,
    holdings: 0.5,
    totalValue: 33617.25,
    profitLoss: 4523.15,
    profitLossPercent: 15.55,
    change24h: 2.34
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    currentPrice: 3456.78,
    holdings: 5.2,
    totalValue: 17975.26,
    profitLoss: -1234.50,
    profitLossPercent: -6.42,
    change24h: -1.23
  },
  {
    id: '3',
    name: 'Cardano',
    symbol: 'ADA',
    icon: '₳',
    currentPrice: 0.67,
    holdings: 15000,
    totalValue: 10050.00,
    profitLoss: 2050.00,
    profitLossPercent: 25.63,
    change24h: 5.67
  },
  {
    id: '4',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    currentPrice: 145.23,
    holdings: 45,
    totalValue: 6535.35,
    profitLoss: 835.35,
    profitLossPercent: 14.66,
    change24h: 3.45
  },
  {
    id: '5',
    name: 'Polkadot',
    symbol: 'DOT',
    icon: '●',
    currentPrice: 7.89,
    holdings: 800,
    totalValue: 6312.00,
    profitLoss: -789.00,
    profitLossPercent: -11.11,
    change24h: -2.87
  },
  {
    id: '6',
    name: 'Chainlink',
    symbol: 'LINK',
    icon: '⬡',
    currentPrice: 14.56,
    holdings: 300,
    totalValue: 4368.00,
    profitLoss: 568.00,
    profitLossPercent: 14.94,
    change24h: 1.89
  }
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin ETF sees record inflows as institutional adoption accelerates',
    source: 'CoinDesk',
    sentiment: 'positive',
    relatedCoins: ['BTC'],
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    title: 'Ethereum developers announce major network upgrade scheduled for Q2',
    source: 'CryptoSlate',
    sentiment: 'positive',
    relatedCoins: ['ETH'],
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    title: 'Cardano partners with major African government for digital identity project',
    source: 'Decrypt',
    sentiment: 'positive',
    relatedCoins: ['ADA'],
    timestamp: '6 hours ago'
  },
  {
    id: '4',
    title: 'Regulatory concerns mount as SEC reviews DeFi protocols',
    source: 'Bloomberg Crypto',
    sentiment: 'negative',
    relatedCoins: ['ETH', 'SOL', 'DOT'],
    timestamp: '8 hours ago'
  },
  {
    id: '5',
    title: 'Solana network demonstrates 99.9% uptime following infrastructure improvements',
    source: 'The Block',
    sentiment: 'positive',
    relatedCoins: ['SOL'],
    timestamp: '10 hours ago'
  },
  {
    id: '6',
    title: 'Chainlink expands oracle services to support emerging blockchain platforms',
    source: 'CoinTelegraph',
    sentiment: 'positive',
    relatedCoins: ['LINK'],
    timestamp: '12 hours ago'
  }
];

export const generateChartData = (days: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  const dataPoints = days === 1 ? 24 : days;
  const interval = (24 * 60 * 60 * 1000) / dataPoints;
  let value = 65000;

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(now - (dataPoints - i - 1) * interval).toISOString();
    value += (Math.random() - 0.45) * 2000;
    data.push({ timestamp, value });
  }

  return data;
};