// ETF 데이터의 표준 규격입니다.
export interface ETFQuote {
  symbol: string;         // 종목 코드 (예: SPY, QQQ)
  price: number;          // 현재 가격
  currency: string;       // 통화 (USD, KRW 등)
  change: number;         // 변동 금액
  changePercent: number;  // 변동률 (%)
  lastUpdated: string;    // 마지막 업데이트 시간
}