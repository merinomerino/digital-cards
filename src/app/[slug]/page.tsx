'use client'

import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { getCardBySlug, DatabaseError } from '@/lib/firestore'
import DesignCardPreview from '@/components/DesignCardPreview'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import AdBanner from '@/components/AdBanner'
import ShareButton from '@/components/ShareButton'
import { trackCardView } from '@/lib/analytics'
import type { Card } from '@/types/card'

interface Props {
  params: Promise<{ slug: string }>
}

const DEMO_SLUGS = ['chekolettes', 'bigotes', 'viajes-merino']

export default function CardPage({ params }: Props) {
  const { slug } = use(params)
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const slugRef = useRef(slug)
  useEffect(() => {
    slugRef.current = slug
    getCardBySlug(slug).then(c => {
      if (slugRef.current !== slug) return
      if (!c) setError('not-found')
      else {
        setCard(c)
        document.title = `${c.nombre} — ${c.tituloProfesional} | CardLink`
      }
    }).catch(err => {
      if (slugRef.current !== slug) return
      if (err instanceof DatabaseError) setError(err.message)
      else setError('Ocurrió un error al cargar la tarjeta.')
    }).finally(() => {
      if (slugRef.current === slug) setLoading(false)
    })
    // Track view
    trackCardView(slug, slug)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-mts-bg flex items-center justify-center px-4">
        <div className="max-w-sm w-full space-y-4 animate-pulse">
          <div className="h-64 rounded-3xl bg-white/5" />
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl bg-white/5" />
            <div className="h-40 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    )
  }

  if (error === 'not-found') {
    if (DEMO_SLUGS.includes(slug)) {
      return (
        <div className="min-h-screen bg-mts-bg flex items-center justify-center px-4">
          <div className="max-w-sm w-full text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-mts-text">Tarjeta no encontrada</h1>
            <p className="text-mts-muted text-sm leading-relaxed">
              Esta tarjeta aún no ha sido creada en la base de datos.
              Ve al <span className="text-indigo-400 font-medium">seed</span> para crearla automáticamente.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/seed"
                className="inline-flex items-center justify-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
                Ir a Seed
              </Link>
              <Link href="/"
                className="text-mts-muted hover:text-white text-sm transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-mts-bg flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-mts-text">Tarjeta no encontrada</h1>
          <p className="text-mts-muted text-sm leading-relaxed">
            La tarjeta que buscas no existe. ¿Quieres una para tu negocio?
          </p>
          <a href="https://wa.me/5218787020221?text=Hola,%20quiero%20una%20tarjeta%20digital%20personalizada%20para%20mi%20negocio"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
            Solicitar mi tarjeta
          </a>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mts-bg flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-mts-text">Servicio no disponible</h1>
          <p className="text-mts-muted text-sm leading-relaxed">{error}</p>
          <Link href="/"
            className="inline-flex items-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!card) return null

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'}/${slug}`

  return (
    <div className="min-h-screen bg-mts-bg pt-5 px-4 pb-24">
      <div className="max-w-sm mx-auto space-y-4">
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || 'SLOT_TOP'}
          format="horizontal"
          className="rounded-xl overflow-hidden"
        />
        <DesignCardPreview card={card} />

        <div className="grid grid-cols-2 gap-3">
          <QRCodeDisplay url={cardUrl} slug={slug} />
          <div className="flex flex-col gap-3">
            <AdBanner
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || 'SLOT_BOTTOM'}
              format="rectangle"
              className="rounded-xl overflow-hidden flex-1"
            />
            <Link
              href={`/${slug}/edit`}
              className="flex items-center justify-center gap-2 bg-mts-surface/60 border border-mts-border/50 rounded-2xl p-4 text-mts-muted hover:text-white hover:border-mts-muted transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
          </div>
        </div>
      </div>

      {/* FAB flotante de compartir */}
      <ShareButton url={cardUrl} name={card.nombre} title={card.tituloProfesional} />
    </div>
  )
}
