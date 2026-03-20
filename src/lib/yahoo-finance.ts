import { ETFQuote } from "@/types/etf";

// 'export' 키워드가 반드시 붙어 있어야 외부(ETFInput)에서 가져다 쓸 수 있습니다!
export async function getETFPrice(symbol: string): Promise<ETFQuote> {
  const res = await fetch(`/api/quote?symbol=${symbol}`);
  
  if (!res.ok) {
    throw new Error('데이터를 가져오는데 실패했습니다.');
  }
  
  return res.json();
}