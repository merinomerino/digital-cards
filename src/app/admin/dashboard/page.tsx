'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
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
  return { label: normalized, className: styles[normalized] || 'bg-indigo-500/15 text-indigo-300' }
}

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b']

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { nombre: string; views: number; clicks: number } }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-2xl border border-white/10 bg-[#13131A] px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-white">{d.nombre}</p>
      <p className="mt-1 text-indigo-400">{d.views} vistas</p>
      <p className="text-slate-400">{d.clicks} clicks</p>
    </div>
  )
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
  const topCards = useMemo(
    () => [...cards].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8),
    [cards]
  )

  const chartData = topCards.map(c => ({
    nombre: c.nombre?.split(' ')[0] || 'Sin nombre',
    views: c.views || 0,
    clicks: c.clicks || 0,
  }))

  const METRICS = [
    { label: 'Tarjetas', value: cards.length, change: `${activeCards.length} con diseño`, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Con diseño', value: activeCards.length, change: cards.length > 0 ? `${Math.round((activeCards.length / cards.length) * 100)}%` : '0%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Vistas totales', value: totalViews, change: `${totalClicks} clicks`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Promedio vistas', value: cards.length > 0 ? Math.round(totalViews / cards.length) : 0, change: 'por tarjeta', color: 'text-violet-400', bg: 'bg-violet-500/10' },
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

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRICS.map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl border border-white/5 p-5`}>
            <p className="mb-1 text-xs font-medium text-mts-muted">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="mt-1 text-xs text-mts-muted">{m.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bar chart — vistas por tarjeta */}
        <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">Vistas por tarjeta</h3>
            <span className="text-[11px] text-mts-muted">Top {topCards.length}</span>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="30%">
                <XAxis
                  dataKey="nombre"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center">
              <div className="text-center">
                <p className="mb-2 text-sm text-mts-muted">Crea tu primera tarjeta para ver estadísticas</p>
                <Link href="/admin/cards/new" className="text-sm text-indigo-400 hover:underline">Crear tarjeta →</Link>
              </div>
            </div>
          )}
        </div>

        {/* Horizontal bar — tráfico relativo */}
        <div className="rounded-2xl border border-white/5 bg-[#13131a] p-6">
          <h3 className="mb-4 text-sm font-semibold text-white">Tráfico relativo</h3>
          {topCards.length > 0 ? (
            <div className="space-y-3">
              {topCards.map((c, i) => {
                const maxV = Math.max(1, topCards[0].views || 1)
                const pct = Math.max(6, Math.round(((c.views || 0) / maxV) * 100))
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="w-20 truncate text-xs text-mts-muted">{c.nombre?.split(' ')[0]}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <span className="font-mono text-xs text-white w-8 text-right">{c.views || 0}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center">
              <p className="text-sm text-mts-muted">Sin datos de tráfico</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent cards table */}
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
            {cards.slice(0, 8).map(c => {
              const badge = getDesignBadge(c.diseño)
              return (
                <div key={c.id} className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-xs font-bold text-indigo-300">
                      {c.nombre?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.nombre}</p>
                      <p className="text-xs text-mts-muted">/{c.slug} · {c.views || 0} vistas</p>
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
