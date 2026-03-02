'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Euro, PoundSterling, Banknote, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const currencies = [
  { 
    code: 'USD', 
    name: 'دولار أمريكي', 
    symbol: '$',
    icon: <DollarSign className="w-4 h-4" />,
    rate: 1.00
  },
  { 
    code: 'EUR', 
    name: 'يورو', 
    symbol: '€',
    icon: <Euro className="w-4 h-4" />,
    rate: 0.92
  },
  { 
    code: 'GBP', 
    name: 'جنيه إسترليني', 
    symbol: '£',
    icon: <PoundSterling className="w-4 h-4" />,
    rate: 0.79
  },
  { 
    code: 'SAR', 
    name: 'ريال سعودي', 
    symbol: 'ر.س',
    icon: <Banknote className="w-4 h-4" />,
    rate: 3.75
  },
  { 
    code: 'AED', 
    name: 'درهم إماراتي', 
    symbol: 'د.إ',
    icon: <TrendingUp className="w-4 h-4" />,
    rate: 3.67
  },
  { 
    code: 'EGP', 
    name: 'جنيه مصري', 
    symbol: 'ج.م',
    icon: <Banknote className="w-4 h-4" />,
    rate: 30.90
  }
];

type CurrencySelectorProps = {
  className?: string;
};

export function CurrencySelector({ className = '' }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const { language, dir } = useLanguage();

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
    // Save to localStorage
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    // Trigger custom event for currency change
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 shrink-0 h-9 hover:opacity-80 ${className}`}
      >
        <span className="font-semibold">{selectedCurrency.symbol}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${dir === 'rtl' ? 'rtl' : 'ltr'}`}>
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 py-2">
                اختر العملة
              </div>
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
                    selectedCurrency.code === currency.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`p-2 rounded-full ${
                      selectedCurrency.code === currency.code ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {currency.icon}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{currency.name}</div>
                      <div className="text-xs text-gray-500">{currency.code}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{currency.symbol}</div>
                    <div className="text-xs text-gray-500">{currency.rate.toFixed(2)}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
              <div className="text-xs text-gray-600 text-center">
                العملة المحددة: {selectedCurrency.name} ({selectedCurrency.symbol})
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}