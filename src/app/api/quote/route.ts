import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) return NextResponse.json({ error: 'Symbol missing' }, { status: 400 });

  try {
    const formattedSymbol = /^\d{6}$/.test(symbol) ? `${symbol}.KS` : symbol.toUpperCase();
    
    // 차단 방지를 위한 최신 User-Agent
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?interval=1m&range=1d`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 0 }
      }
    );

    const data = await response.json();
    const result = data?.chart?.result?.[0];

    return NextResponse.json({
      symbol: formattedSymbol,
      price: result?.meta?.regularMarketPrice || 0,
      currency: result?.meta?.currency || 'USD',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch error' }, { status: 500 });
  }
}