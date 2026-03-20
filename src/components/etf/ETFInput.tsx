'use client';

import { useState } from 'react';
import { getETFPrice } from '@/lib/yahoo-finance';
import { useETFStore } from '@/lib/store/useETFStore';

export default function ETFInput() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const addQuote = useETFStore((state) => state.addQuote);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    try {
      const data = await getETFPrice(symbol.toUpperCase());
      addQuote(data); // 가져온 데이터를 스토어(기억장치)에 저장!
      setSymbol('');  // 입력창 비우기
    } catch (error) {
      alert('종목 코드를 확인해 주세요! (예: QQQ, TSLA)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md mb-8">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="종목 코드 입력 (예: QQQ)"
        className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? '조회 중...' : '조회'}
      </button>
    </form>
  );
}
