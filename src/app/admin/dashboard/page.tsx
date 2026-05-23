'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getAllCards } from '@/lib/firestore'
import type { Card } from '@/types/card'

function getDesignBadge(design?: string) {
  const normalized = (design || 'clasico').toLowerCase()
  const styles: Record<string, string> = {
    tattoo: 'bg-green-900/40 text-green-400',
    vet: 'bg-teal-900/40 text-teal-400',
    travel: 'bg-amber-900/40 text-amber-400',
    clasico: 'bg-slate-800 text-slate-300',
  }

  return {
    label: normalized,
    className: styles[normalized] || 'bg-indigo-500/15 text-indigo-300',
  }
}

export default function AdminDashboard() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllCards()
      .then(setCards)
      .catch(() => setError('Error al cargar las tarjetas. Intenta recargar.'))
      .finally(() => setLoading(false))
  }, [])

  const activeCards = cards.filter(c => c.diseño)
  const totalViews = cards.reduce((sum, c) => sum + (c.views || 0), 0)
  const totalClicks = cards.reduce((sum, c) => sum + (c.clicks || 0), 0)
  const topCards = useMemo(() => [...cards].sort((a, b) => (b.views || 0) - (a.views || 0)), [cards])
  const maxViews = Math.max(1, ...cards.map(c => c.views || 0))

  const METRICS = [
    { label: 'Tarjetas activas', value: cards.length, change: `${activeCards.length} con diseño`, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Con diseño único', value: activeCards.length, change: activeCards.length > 0 ? `${Math.round((activeCards.length / cards.length) * 100)}%` : '0%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Vistas totales', value: totalViews, change: `${totalClicks} clicks en total`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Clientes', value: cards.length, change: 'tarjetas creadas', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={() => window.location.reload()} className="text-sm text-indigo-400 hover:underline">Reintentar</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-mts-muted">Resumen de tu plataforma CardLink</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRICS.map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl border border-white/5 p-5`}>
            <p className="mb-1 text-xs font-medium text-mts-muted">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="mt-1 text-xs text-mts-muted">{m.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">Vistas por tarjeta</h3>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
              Máximo: {maxViews} vistas
            </span>
          </div>

          <div className="flex h-56 items-end gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {cards.length > 0 ? (
              topCards.map((card) => {
                const views = card.views || 0
                const height = Math.max(18, Math.round((views / maxViews) * 180))

                return (
                  <div key={card.id} className="group flex min-w-20 flex-1 flex-col items-center justify-end gap-2">
                    <div className="rounded-full border border-white/10 bg-[#0F172A] px-2 py-1 text-[11px] text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
                      {views} vistas
                    </div>
                    <div
                      title={`${card.nombre}: ${views} vistas`}
                      className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-500 to-violet-400 transition-all duration-200 group-hover:from-indigo-400 group-hover:to-fuchsia-400"
                      style={{ height: `${height}px` }}
                    />
                    <div className="max-w-20 truncate text-xs text-mts-muted">{card.nombre?.split(' ')[0]}</div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <p className="mb-2 text-sm text-mts-muted">Crea tu primera tarjeta para ver el crecimiento</p>
                  <Link href="/admin/cards/new" className="text-sm text-indigo-400 hover:underline">Crear tarjeta →</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Tráfico por tarjeta</h3>
          <div className="flex h-56 items-center justify-center">
            {topCards.length > 0 ? (
              <div className="w-full space-y-3">
                {topCards.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="w-24 truncate text-xs text-mts-muted">{c.nombre}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-indigo-500/50" style={{ width: `${Math.max(8, ((c.views || 0) / maxViews) * 100)}%` }} />
                    </div>
                    <span className="font-mono text-xs text-white">{c.views || 0}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-mts-muted">Sin datos de tráfico</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Tarjetas recientes</h3>
          <Link href="/admin/cards" className="text-xs text-indigo-400 transition-colors hover:text-indigo-300">Ver todas →</Link>
        </div>
        {cards.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-3 text-sm text-mts-muted">Aún no hay tarjetas creadas</p>
            <Link href="/admin/cards/new" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500">
              Crear primera tarjeta
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map(c => {
              const badge = getDesignBadge(c.diseño)
              return (
                <div key={c.id} className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-xs font-bold text-indigo-300">
                      {c.nombre?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.nombre}</p>
                      <p className="text-xs text-mts-muted">/{c.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${badge.className}`}>{badge.label}</span>
                    <a href={`/${c.slug}`} target="_blank" className="text-xs text-mts-muted transition-colors hover:text-white">↗</a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
