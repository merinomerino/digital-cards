'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllCards } from '@/lib/firestore'
import type { Card } from '@/types/card'

export default function AdminDashboard() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCards().then(setCards).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activeCards = cards.filter(c => c.diseño)
  const todayViews = cards.reduce((sum, c) => sum + (c.views || 0), 0)
  const todayClicks = cards.reduce((sum, c) => sum + (c.clicks || 0), 0)

  const METRICS = [
    { label: 'Tarjetas activas', value: cards.length, change: '+0', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Con diseño único', value: activeCards.length, change: activeCards.length > 0 ? `+${activeCards.length}` : '0', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Clientes', value: cards.length > 0 ? '3' : '0', change: '-', color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Vistas hoy', value: todayViews, change: `+${todayClicks} clicks`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-mts-muted text-sm mt-1">Resumen de tu plataforma CardLink</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(m => (
          <div key={m.label} className={`${m.bg} border border-white/5 rounded-2xl p-5`}>
            <p className="text-mts-muted text-xs font-medium mb-1">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-mts-muted text-xs mt-1">{m.change} vs ayer</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-4">Crecimiento de tarjetas</h3>
          <div className="h-48 flex items-end gap-2">
            {cards.length > 0 ? (
              <div className="w-full flex items-end gap-3 justify-center">
                {cards.map((c, i) => (
                  <div key={c.id} className="flex flex-col items-center gap-2">
                    <div className="text-xs text-mts-muted truncate max-w-20">{c.nombre?.split(' ')[0]}</div>
                    <div className="w-12 rounded-lg bg-indigo-500/30" style={{ height: `${40 + i * 20}px` }} />
                  </div>
                ))}
                {cards.length === 0 && <p className="text-mts-muted text-sm">Sin datos</p>}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-mts-muted text-sm mb-2">Crea tu primera tarjeta para ver el crecimiento</p>
                  <Link href="/seed" className="text-indigo-400 text-sm hover:underline">Ir a Seed →</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-4">Tráfico por tarjeta</h3>
          <div className="h-48 flex items-center justify-center">
            {cards.length > 0 ? (
              <div className="w-full space-y-3">
                {cards.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-xs text-mts-muted w-24 truncate">{c.nombre}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500/50 rounded-full" style={{ width: `${Math.min(100, (c.views || 0) * 10 + 10)}%` }} />
                    </div>
                    <span className="text-xs text-white font-mono">{c.views || 0}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-mts-muted text-sm">Sin datos de tráfico</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent cards */}
      <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Tarjetas recientes</h3>
          <Link href="/admin/cards" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Ver todas →</Link>
        </div>
        {cards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-mts-muted text-sm mb-3">Aún no hay tarjetas creadas</p>
            <Link href="/seed" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              Crear tarjetas demo
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {c.nombre?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{c.nombre}</p>
                    <p className="text-mts-muted text-xs">/{c.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    c.diseño === 'tattoo' ? 'bg-green-900/40 text-green-400'
                    : c.diseño === 'vet' ? 'bg-teal-900/40 text-teal-400'
                    : c.diseño === 'travel' ? 'bg-amber-900/40 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                  }`}>{c.diseño || 'clasico'}</span>
                  <a href={`/${c.slug}`} target="_blank" className="text-mts-muted hover:text-white text-xs transition-colors">↗</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
