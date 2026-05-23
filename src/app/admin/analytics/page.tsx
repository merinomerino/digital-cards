'use client'

import { useCallback, useEffect, useState } from 'react'
import { getAllCards } from '@/lib/firestore'
import type { Card } from '@/types/card'

export default function AdminAnalytics() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = useCallback(() => {
    getAllCards()
      .then(setCards)
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" /></div>
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[28px] border border-red-500/15 bg-red-500/5 px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m0 3.75h.007v.008H12v-.008zM10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">No pudimos cargar analytics</h1>
          <p className="mt-1 text-sm text-slate-400">{error}</p>
        </div>
        <button
          onClick={() => {
            setLoading(true)
            setError(null)
            loadAnalytics()
          }}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const totalViews = cards.reduce((s, c) => s + (c.views || 0), 0)
  const totalClicks = cards.reduce((s, c) => s + (c.clicks || 0), 0)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'

  const socialClicks = {
    whatsapp: cards.reduce((s, c) => s + (c.whatsappClicks || 0), 0),
    instagram: cards.reduce((s, c) => s + (c.instagramClicks || 0), 0),
    phone: cards.reduce((s, c) => s + (c.phoneClicks || 0), 0),
  }

  const topChannel = Object.entries(socialClicks).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-mts-muted">Métricas e interacciones de tus tarjetas</p>
        </div>
        <button
          onClick={() => {
            setLoading(true)
            setError(null)
            loadAnalytics()
          }}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-400/30 hover:text-white"
        >
          Actualizar datos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Vistas totales', value: totalViews, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Clicks totales', value: totalClicks, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'CTR promedio', value: `${ctr}%`, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Tarjetas', value: cards.length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl border border-white/5 p-5`}>
            <p className="mb-1 text-xs font-medium text-mts-muted">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">Redes más clickeadas</h3>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
              Top: {topChannel ? `${topChannel[0]} (${topChannel[1]})` : 'sin datos'}
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'WhatsApp', value: socialClicks.whatsapp, color: 'bg-green-500/50' },
              { label: 'Instagram', value: socialClicks.instagram, color: 'bg-pink-500/50' },
              { label: 'Teléfono', value: socialClicks.phone, color: 'bg-blue-500/50' },
            ].map(item => {
              const max = Math.max(socialClicks.whatsapp, socialClicks.instagram, socialClicks.phone, 1)
              return (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-white">{item.label}</span>
                    <span className="text-mts-muted">{item.value} clicks</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / max) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Tarjetas más visitadas</h3>
          <div className="space-y-2">
            {cards.length === 0 ? (
              <p className="text-sm text-mts-muted">Sin datos</p>
            ) : (
              [...cards].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-xs text-mts-muted">{i + 1}.</span>
                    <span className="max-w-40 truncate text-sm text-white">{c.nombre}</span>
                  </div>
                  <span className="text-xs text-mts-muted">{c.views || 0} vistas</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
        <h3 className="mb-2 text-sm font-semibold text-white">Estado del tracking</h3>
        <p className="text-xs leading-relaxed text-mts-muted">
          Los datos se consolidan desde vistas y clicks reales de las tarjetas. Usa el botón de actualizar para refrescar métricas después de campañas o cambios recientes.
        </p>
      </div>
    </div>
  )
}
