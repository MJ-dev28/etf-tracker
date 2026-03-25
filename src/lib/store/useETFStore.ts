import { create } from 'zustand';
import { ETFQuote } from '@/types/etf';

interface ETFState {
  // 상태(State)
  quotes: ETFQuote[];      // 조회된 전체 목록 (기존 기능)
  currentQuote: ETFQuote | null; // 방금 조회된 단일 종목 (새 기능)
  isLoading: boolean;      // 로딩 상태 (UX 개선)
  error: string | null;    // 에러 메시지 (안정성)

  // 액션(Actions)
  fetchQuote: (symbol: string) => Promise<void>;
  clearQuotes: () => void;
}

export const useETFStore = create<ETFState>((set) => ({
  quotes: [],
  currentQuote: null,
  isLoading: false,
  error: null,

  // 15년 차 엔지니어의 팁: API 호출 로직을 스토어 내부에 캡슐화합니다.
  fetchQuote: async (symbol: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/quote?symbol=${symbol.toUpperCase()}`);
      
      if (!response.ok) {
        throw new Error('종목을 찾을 수 없거나 API 에러가 발생했습니다.');
      }

      const data: ETFQuote = await response.json();

      set((state) => ({
        currentQuote: data,
        // 기존 로직 유지: 중복은 제거하고 최상단에 추가
        quotes: [data, ...state.quotes.filter((q) => q.symbol !== data.symbol)],
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearQuotes: () => set({ quotes: [], currentQuote: null }),
}));