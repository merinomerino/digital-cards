'use client'

import { useState, useEffect } from 'react'
import { getAllCards } from '@/lib/firestore'
import type { Card } from '@/types/card'

export default function AdminAnalytics() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAllCards(),
    ]).then(([cardsData]) => {
      setCards(cardsData)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  const totalViews = cards.reduce((s, c) => s + (c.views || 0), 0)
  const totalClicks = cards.reduce((s, c) => s + (c.clicks || 0), 0)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'

  const socialClicks = {
    whatsapp: cards.reduce((s, c) => s + (c.whatsappClicks || 0), 0),
    instagram: cards.reduce((s, c) => s + (c.instagramClicks || 0), 0),
    phone: cards.reduce((s, c) => s + (c.phoneClicks || 0), 0),
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-mts-muted text-sm mt-1">Métricas e interacciones de tus tarjetas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vistas totales', value: totalViews, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Clicks totales', value: totalClicks, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'CTR promedio', value: `${ctr}%`, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Tarjetas', value: cards.length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(m => (
          <div key={m.label} className={`${m.bg} border border-white/5 rounded-2xl p-5`}>
            <p className="text-mts-muted text-xs font-medium mb-1">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-4">Redes más clickeadas</h3>
          <div className="space-y-3">
            {[
              { label: 'WhatsApp', value: socialClicks.whatsapp, color: 'bg-green-500/50' },
              { label: 'Instagram', value: socialClicks.instagram, color: 'bg-pink-500/50' },
              { label: 'Teléfono', value: socialClicks.phone, color: 'bg-blue-500/50' },
            ].map(item => {
              const max = Math.max(socialClicks.whatsapp, socialClicks.instagram, socialClicks.phone, 1)
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white">{item.label}</span>
                    <span className="text-mts-muted">{item.value} clicks</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / max) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-sm mb-4">Tarjetas más visitadas</h3>
          <div className="space-y-2">
            {cards.length === 0 ? (
              <p className="text-mts-muted text-sm">Sin datos</p>
            ) : (
              [...cards].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-mts-muted text-xs w-4">{i + 1}.</span>
                    <span className="text-white text-sm truncate max-w-40">{c.nombre}</span>
                  </div>
                  <span className="text-mts-muted text-xs">{c.views || 0} vistas</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-2">⚠️ Nota</h3>
        <p className="text-mts-muted text-xs leading-relaxed">
          Los datos de analytics se actualizan en tiempo real a medida que los clientes interactúan con las tarjetas.
          Para ver datos completos, asegúrate de que el tracking de eventos esté configurado en Firebase Analytics.
        </p>
      </div>
    </div>
  )
}
