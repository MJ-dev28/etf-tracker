'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [symbol, setSymbol] = useState('')
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAssets = async () => {
    setLoading(true)
    const { data } = await supabase.from('user_assets').select('*')
    if (data) {
      const assetsWithPrice = await Promise.all(
        data.map(async (asset) => {
          try {
            const res = await fetch(`/api/price?symbol=${asset.symbol}`)
            const json = await res.json()
            return { ...asset, price: json.price || 'N/A' }
          } catch {
            return { ...asset, price: 'N/A' }
          }
        })
      )
      setAssets(assetsWithPrice)
    }
    setLoading(false)
  }

  useEffect(() => { fetchAssets() }, [])

  const addAsset = async () => {
    if (!symbol) return
    await supabase.from('user_assets').insert([{ symbol: symbol.toUpperCase() }])
    setSymbol('')
    fetchAssets()
  }

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📊 My ETF Tracker
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>실시간으로 자산 가치를 확인하세요</p>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <input 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAsset()}
            placeholder="종목 코드 (예: QQQ)"
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px', outline: 'none' }}
          />
          <button onClick={addAsset} style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
            추가
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151' }}>포트폴리오</h3>
          <button onClick={fetchAssets} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px' }}>새로고침</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assets.map((asset) => (
            <div key={asset.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
              <span style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>{asset.symbol}</span>
              <span style={{ fontWeight: '700', fontSize: '16px', color: asset.price === 'N/A' ? '#9ca3af' : '#059669' }}>
                {typeof asset.price === 'number' ? `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : asset.price}
              </span>
            </div>
          ))}
          {assets.length === 0 && !loading && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>아직 등록된 종목이 없습니다.</p>}
        </div>
      </div>
    </div>
  )
}