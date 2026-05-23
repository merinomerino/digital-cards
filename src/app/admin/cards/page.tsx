'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getAllCards, deleteCard } from '@/lib/firestore'
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

export default function AdminCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    getAllCards().then(setCards).catch(() => toast.error('Error al cargar tarjetas')).finally(() => setLoading(false))

    const flash = window.sessionStorage.getItem('cardlink-admin-flash')
    if (flash) {
      toast.success(flash)
      window.sessionStorage.removeItem('cardlink-admin-flash')
    }
  }, [])

  const confirmDelete = async () => {
    if (!cardToDelete) return

    setIsDeleting(true)
    try {
      await deleteCard(cardToDelete.id)
      setCards((prev) => prev.filter((item) => item.id !== cardToDelete.id))
      toast.success('Tarjeta eliminada')
      setCardToDelete(null)
    } catch (err) {
      console.error('deleteCard error:', err)
      toast.error('Error al eliminar la tarjeta')
    } finally {
      setIsDeleting(false)
    }
  }

  const totalViews = cards.reduce((sum, card) => sum + (card.views || 0), 0)
  const totalClicks = cards.reduce((sum, card) => sum + (card.clicks || 0), 0)

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" /></div>
  }

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/5 bg-[#13131A] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tarjetas</h1>
            <p className="mt-1 text-sm text-mts-muted">{cards.length} tarjetas · {totalViews} vistas · {totalClicks} clicks acumulados</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/seed" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-mts-muted transition hover:border-indigo-400/30 hover:text-white">
              Seed demo
            </Link>
            <Link href="/admin/cards/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
              + Nueva tarjeta
            </Link>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-[28px] border border-white/5 bg-[#13131A] p-12 text-center">
            <p className="text-mts-muted">No hay tarjetas. Crea una manualmente o carga las showcase desde seed.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link href="/admin/cards/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">Crear tarjeta</Link>
              <Link href="/seed" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-mts-muted transition hover:text-white">Abrir seed</Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#13131A]">
            <div className="hidden grid-cols-[minmax(0,2fr)_120px_160px_220px] gap-4 border-b border-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-mts-muted md:grid">
              <span>Tarjeta</span>
              <span>Diseño</span>
              <span>Estadísticas</span>
              <span>Acciones</span>
            </div>

            <div className="divide-y divide-white/5">
              {cards.map((card) => {
                const badge = getDesignBadge(card.diseño)

                return (
                  <div key={card.id} className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,2fr)_120px_160px_220px] md:items-center">
                    <div className="flex min-w-0 items-center gap-3">
                      {card.fotoUrl ? (
                        <Image src={card.fotoUrl} alt={card.nombre} width={48} height={48} className="h-12 w-12 flex-shrink-0 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-sm font-bold text-indigo-300">
                          {card.nombre?.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{card.nombre}</p>
                        <p className="truncate text-xs text-mts-muted">/{card.slug} · {card.tituloProfesional}</p>
                        {card.tagline && <p className="mt-1 truncate text-xs italic text-slate-400">{card.tagline}</p>}
                      </div>
                    </div>

                    <div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 md:border-0 md:bg-transparent md:p-0">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-mts-muted">Vistas</p>
                        <p className="mt-1 text-sm font-semibold text-white">{card.views || 0}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-mts-muted">Clicks</p>
                        <p className="mt-1 text-sm font-semibold text-white">{card.clicks || 0}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`/${card.slug}`} target="_blank" className="rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10">Ver</a>
                      <Link href={`/admin/cards/${card.id}/edit`} className="rounded-lg bg-indigo-500/20 px-3 py-2 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/30">Editar</Link>
                      <button onClick={() => setCardToDelete(card)} className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/30">Eliminar</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#13131A] p-6 shadow-2xl shadow-black/40 animate-scale-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4m0 4h.01" />
              </svg>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-white">Eliminar tarjeta</h2>
              <p className="mt-2 text-sm text-slate-400">
                Vas a eliminar permanentemente esta tarjeta del panel.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{cardToDelete.nombre}</p>
              <p className="mt-1 text-xs text-slate-400">Slug: /{cardToDelete.slug}</p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => !isDeleting && setCardToDelete(null)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-60"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
