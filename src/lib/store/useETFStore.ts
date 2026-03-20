// 내가 조회한 ETF 목록을 기억해줘 
import { create } from 'zustand';
import { ETFQuote } from '@/types/etf';

interface ETFState {
  quotes: ETFQuote[];
  addQuote: (quote: ETFQuote) => void;
  clearQuotes: () => void;
}

export const useETFStore = create<ETFState>((set) => ({
  quotes: [],
  addQuote: (quote) => 
    set((state) => ({ 
      // 중복 종목은 제외하고 최신 데이터만 리스트에 추가합니다.
      quotes: [quote, ...state.quotes.filter(q => q.symbol !== quote.symbol)] 
    })),
  clearQuotes: () => set({ quotes: [] }),
}));