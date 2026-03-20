import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('symbol');

  if (!query) return NextResponse.json({ error: '검색어를 입력하세요.' }, { status: 400 });

  try {
    let symbol = query.toUpperCase();

    // 1. [검색 단계] 한글이거나 티커 형식이 아니면 심볼을 먼저 찾습니다.
    const isKorean = /[ㄱ-ㅎ|가-힣]/.test(query) || query.length > 6;
    
    if (isSearchRequired(query)) {
      const searchRes = await fetch(
        `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=ko-KR&quotesCount=1`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const searchData = await searchRes.json();
      symbol = searchData.quotes?.[0]?.symbol;

      if (!symbol) {
        return NextResponse.json({ error: `'${query}' 종목을 찾을 수 없습니다.` }, { status: 404 });
      }
    }

    // 2. [보정 단계] 숫자 6자리인 경우 한국 시장 접미사 추가
    if (/^\d{6}$/.test(symbol)) symbol = `${symbol}.KS`;

    // 3. [조회 단계] 실제 가격 데이터를 가져옵니다.
    const quoteRes = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    const quoteData = await quoteRes.json();
    const result = quoteData?.chart?.result?.[0];

    if (!result) {
      return NextResponse.json({ error: '가격 정보를 가져올 수 없습니다.' }, { status: 404 });
    }

    const meta = result.meta;

    // 4. [응답 단계] 클라이언트(Zustand)가 사용하는 규격으로 반환
    return NextResponse.json({
      symbol: symbol,
      price: meta.regularMarketPrice,
      currency: meta.currency,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      lastUpdated: new Date().toLocaleString('ko-KR'),
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: '서버 통신 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 한글 포함 여부 및 검색 필요성 체크 유틸리티
function isSearchRequired(text: string) {
  return /[ㄱ-ㅎ|가-힣]/.test(text) || text.length > 6 || !/^[A-Z0-9.]+$/.test(text);
}