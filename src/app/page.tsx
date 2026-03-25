'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 아까 만든 공통 설정 파일
import { useETFStore } from '@/lib/store/useETFStore'; // Zustand 스토어

export default function Home() {
  const [inputSymbol, setInputSymbol] = useState('');
  
  // Zustand에서 상태와 액션을 가져옵니다.
  const { quotes, fetchQuote, isLoading, error: apiError } = useETFStore();

  // 초기 데이터를 불러오는 함수
  const loadPortfolio = async () => {
    // 1. Supabase에서 저장된 종목 목록만 가져옵니다.
    const { data, error: sbError } = await supabase
      .from('user_assets')
      .select('symbol');
    
    if (sbError) {
      console.error('Supabase 에러:', sbError.message);
      return;
    }

    if (data && data.length > 0) {
      // 2. 각 종목의 실시간 가격을 API를 통해 순차적으로 업데이트합니다.
      for (const item of data) {
        await fetchQuote(item.symbol);
      }
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleAddAsset = async () => {
    if (!inputSymbol) return;
    const upperSymbol = inputSymbol.toUpperCase();
    
    // DB 저장 로직 (중복 체크는 Supabase RLS나 Unique 제약조건에 맡깁니다)
    const { error: insertError } = await supabase
      .from('user_assets')
      .insert([{ symbol: upperSymbol }]);

    if (insertError) {
      alert('이미 등록되었거나 저장 중 오류가 발생했습니다.');
    } else {
      // 성공 시 실시간 가격 조회 및 목록 반영
      await fetchQuote(upperSymbol);
      setInputSymbol('');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        {/* 헤더 섹션 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            📊 ETF TRACKER
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">실시간 자산 가치 확인</p>
        </div>

        {/* 입력창 (Standard HTML + Tailwind) */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAsset()}
            placeholder="예: QQQ, SPY"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <button 
            onClick={handleAddAsset}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors text-sm"
          >
            {isLoading ? '...' : '추가'}
          </button>
        </div>

        {/* 리스트 섹션 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-gray-800 text-sm">보유 종목</h3>
            <button 
              onClick={loadPortfolio}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              새로고침
            </button>
          </div>

          {/* 에러 발생 시 알림 */}
          {apiError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
              ⚠️ {apiError}
            </div>
          )}

          {/* 데이터 리스트 */}
          <div className="grid gap-3">
            {quotes.map((item) => (
              <div 
                key={item.symbol} 
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
              >
                <div>
                  <div className="font-bold text-gray-900">{item.symbol}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.currency}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-lg text-emerald-600">
                    ${typeof item.price === 'number' ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
            
            {/* 데이터가 없을 때 */}
            {quotes.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">등록된 종목이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}