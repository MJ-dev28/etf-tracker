export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) return NextResponse.json({ error: 'No symbol' }, { status: 400 });

  try {
    // 라이브러리를 쓰지 않고 야후 파이낸스 API에 직접 요청을 보냅니다.
    // 이 방식은 'constructor' 에러가 절대 날 수 없습니다.
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
      { next: { revalidate: 60 } } // 1분간 결과 캐싱
    );

    const data = await response.json();
    const price = data.chart.result[0].meta.regularMarketPrice;

    return NextResponse.json({ price });
  } catch (error: any) {
    console.error('Direct Fetch Error:', error.message);
    return NextResponse.json({ 
      error: '가격 데이터를 가져올 수 없습니다.', 
      detail: '종목 코드를 확인해주세요 (예: QQQ, 005930.KS)' 
    }, { status: 500 });
  }
}