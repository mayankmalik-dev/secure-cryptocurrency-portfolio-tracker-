// High-performance Crypto Data Service using CryptoCompare & Binance
const CRYPTOCOMPARE_URL = 'https://min-api.cryptocompare.com/data';

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

export const fetchMarketData = async (symbols: string[], currency = 'USD'): Promise<MarketData[]> => {
  const fsyms = symbols.join(',').toUpperCase();
  const tsyms = currency.toUpperCase();
  
  const response = await fetch(
    `${CRYPTOCOMPARE_URL}/pricemultifull?fsyms=${fsyms}&tsyms=${tsyms}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch market data from provider');
  }
  
  const data = await response.json();
  const raw = data.RAW || {};
  
  return symbols.map((symbol, index) => {
    const coinData = raw[symbol.toUpperCase()]?.[tsyms] || {};
    return {
      id: symbol.toLowerCase(),
      symbol: symbol.toUpperCase(),
      name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : symbol === 'SOL' ? 'Solana' : symbol === 'ADA' ? 'Cardano' : symbol === 'DOT' ? 'Polkadot' : symbol === 'LINK' ? 'Chainlink' : symbol,
      image: `https://www.cryptocompare.com${coinData.IMAGEURL || ''}`,
      current_price: coinData.PRICE || 0,
      market_cap: coinData.MKTCAP || 0,
      market_cap_rank: index + 1,
      price_change_percentage_24h: coinData.CHANGEPCT24HOUR || 0,
      last_updated: new Date().toISOString()
    };
  });
};

export const fetchTopCoins = async (limit = 15, currency = 'USD'): Promise<MarketData[]> => {
  const tsym = currency.toUpperCase();
  const response = await fetch(
    `${CRYPTOCOMPARE_URL}/top/mktcapfull?limit=${limit}&tsym=${tsym}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch top coins');
  }
  
  const data = await response.json();
  return (data.Data || []).map((item: any, index: number) => {
    const raw = item.RAW?.[tsym] || {};
    return {
      id: item.CoinInfo.Name.toLowerCase(),
      symbol: item.CoinInfo.Name,
      name: item.CoinInfo.FullName,
      image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`,
      current_price: raw.PRICE || 0,
      market_cap: raw.MKTCAP || 0,
      market_cap_rank: index + 1,
      price_change_percentage_24h: raw.CHANGEPCT24HOUR || 0,
      last_updated: new Date().toISOString()
    };
  });
};

export const fetchCoinChartData = async (symbol: string, days: number, currency = 'USD'): Promise<{ prices: [number, number][] }> => {
  const tsym = currency.toUpperCase();
  const limit = days === 1 ? 24 : days === 7 ? 168 : days === 30 ? 30 : 365;
  const endpoint = days <= 7 ? 'v2/histohour' : 'v2/histoday';
  
  const response = await fetch(
    `${CRYPTOCOMPARE_URL}/${endpoint}?fsym=${symbol.toUpperCase()}&tsym=${tsym}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data for ${symbol}`);
  }
  
  const data = await response.json();
  const prices = (data.Data.Data || []).map((item: any) => [
    item.time * 1000,
    item.close
  ]);
  
  return { prices };
};
