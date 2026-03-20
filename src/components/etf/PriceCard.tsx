'use client';

import { ETFQuote } from '@/types/etf';

interface PriceCardProps {
  quote: ETFQuote;
  onRemove: (symbol: string) => void;
}

export default function PriceCard({ quote, onRemove }: PriceCardProps) {
  const isPositive = quote.change >= 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-gray-800">{quote.symbol}</h3>
          <span className="text-xs text-gray-400">{quote.lastUpdated}</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black text-gray-900">
            {quote.price.toLocaleString()}
            <span className="text-sm ml-1 font-normal">{quote.currency}</span>
          </span>
          <span className={`text-sm font-bold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(quote.change).toLocaleString()} ({quote.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      <button 
        onClick={() => onRemove(quote.symbol)}
        className="text-gray-300 hover:text-red-500 p-2 transition-colors"
      >
        삭제
      </button>
    </div>
  );
}