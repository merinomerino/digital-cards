'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getAllCards } from '@/lib/firestore'
import type { Card } from '@/types/card'
import Link from 'next/link'

export default function AdminEditor() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCards().then(setCards).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Editor de tarjetas</h1>
        <p className="text-mts-muted text-sm mt-1">Selecciona una tarjeta para personalizar su diseño</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <Link
            key={card.id}
            href={`/admin/cards/${card.id}/edit`}
            className="bg-[#13131a] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              {card.fotoUrl ? (
                <Image src={card.fotoUrl} alt="" width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">
                  {card.nombre?.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors truncate">{card.nombre}</p>
                <p className="text-mts-muted text-xs truncate">/{card.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                card.diseño === 'tattoo' ? 'bg-green-900/40 text-green-400'
                : card.diseño === 'vet' ? 'bg-teal-900/40 text-teal-400'
                : card.diseño === 'travel' ? 'bg-amber-900/40 text-amber-400'
                : 'bg-slate-800 text-slate-400'
              }`}>{card.diseño || 'clasico'}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-mts-muted">
              <span>{card.servicios?.length || 0} servicios</span>
              <span>{card.views || 0} vistas</span>
            </div>
          </Link>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-mts-muted text-sm mb-3">No hay tarjetas para editar</p>
          <Link href="/seed" className="text-indigo-400 text-sm hover:underline">Crear tarjetas demo →</Link>
        </div>
      )}

      {/* Editor info */}
      <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-2">✎ Editor visual</h3>
        <p className="text-mts-muted text-xs leading-relaxed">
          Actualmente puedes personalizar: diseño visual (4 variantes), colores, logo, servicios con precios, horario,
          enlaces a redes sociales, foto de perfil, y toda la información de contacto.
          El editor tipo IDE con Monaco Editor estará disponible en la Fase 2 del proyecto.
        </p>
      </div>
    </div>
  )
}
