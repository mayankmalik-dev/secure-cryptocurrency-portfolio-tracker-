import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'usd' | 'inr';

interface CurrencyContextType {
  currency: Currency;
  symbol: string;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('preferred_currency') as Currency) || 'usd';
  });

  const symbol = currency === 'usd' ? '$' : '₹';

  useEffect(() => {
    localStorage.setItem('preferred_currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'usd' ? 'inr' : 'usd');
  };

  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
