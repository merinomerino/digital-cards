'use client'

import { use, useEffect, useRef, useState } from 'react'
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

function upsertMetaTag(selector: string, attributes: Record<string, string>, content: string) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value))
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setPageMetadata(card: Card, url: string) {
  const title = `${card.nombre} — ${card.tituloProfesional || 'Tarjeta digital'} | CardLink`
  const description = [
    card.tituloProfesional,
    card.empresa,
    card.tagline || 'Conecta y comparte tu tarjeta digital al instante.',
  ].filter(Boolean).join(' · ')
  const image = card.headerBanner || card.fotoUrl || card.logoUrl || `${window.location.origin}/og-cardlink.png`

  document.title = title
  upsertMetaTag('meta[name="description"]', { name: 'description' }, description)
  upsertMetaTag('meta[property="og:title"]', { property: 'og:title' }, title)
  upsertMetaTag('meta[property="og:description"]', { property: 'og:description' }, description)
  upsertMetaTag('meta[property="og:image"]', { property: 'og:image' }, image)
  upsertMetaTag('meta[property="og:url"]', { property: 'og:url' }, url)
  upsertMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
  upsertMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
  upsertMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
  upsertMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, image)
}

function getWhatsAppHref(card: Card) {
  const value = card.redesSociales?.whatsapp || card.telefono
  if (!value) return null
  if (value.startsWith('http')) return value

  const digits = value.replace(/\D/g, '')
  if (!digits) return null

  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hola ${card.nombre}, vi tu tarjeta en CardLink.`)}`
}

function getWebsiteHref(website: string) {
  if (!website) return null
  return website.startsWith('http') ? website : `https://${website}`
}

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
      if (!c) {
        setError('not-found')
        return
      }

      const currentUrl = `${window.location.origin}/${slug}`
      setCard(c)
      setPageMetadata(c, currentUrl)
      trackCardView(slug, c.nombre)
    }).catch(err => {
      if (slugRef.current !== slug) return
      if (err instanceof DatabaseError) setError(err.message)
      else setError('Ocurrió un error al cargar la tarjeta.')
    }).finally(() => {
      if (slugRef.current === slug) setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mts-bg px-4">
        <div className="w-full max-w-sm space-y-4 animate-pulse">
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
        <div className="flex min-h-screen items-center justify-center bg-mts-bg px-4">
          <div className="w-full max-w-sm space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
              <svg className="h-8 w-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-mts-text">Tarjeta no encontrada</h1>
            <p className="text-sm leading-relaxed text-mts-muted">
              Esta tarjeta aún no ha sido creada en la base de datos. Ve al <span className="font-medium text-indigo-400">seed</span> para crearla automáticamente.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/seed"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-mts-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mts-primary-hover">
                Ir a Seed
              </Link>
              <Link href="/"
                className="text-sm text-mts-muted transition-colors hover:text-white">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-mts-bg px-4">
        <div className="w-full max-w-sm space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
            <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-mts-text">Tarjeta no encontrada</h1>
          <p className="text-sm leading-relaxed text-mts-muted">
            La tarjeta que buscas no existe. ¿Quieres una para tu negocio?
          </p>
          <a href="https://wa.me/5218787020221?text=Hola,%20quiero%20una%20tarjeta%20digital%20personalizada%20para%20mi%20negocio"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-mts-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mts-primary-hover">
            Solicitar mi tarjeta
          </a>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mts-bg px-4">
        <div className="w-full max-w-sm space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
            <svg className="h-8 w-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-mts-text">Servicio no disponible</h1>
          <p className="text-sm leading-relaxed text-mts-muted">{error}</p>
          <Link href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-mts-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mts-primary-hover">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!card) return null

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'}/${slug}`
  const contactActions = [
    card.telefono ? { label: 'Llamar ahora', href: `tel:${card.telefono}`, tone: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20' } : null,
    getWhatsAppHref(card) ? { label: 'WhatsApp', href: getWhatsAppHref(card)!, tone: 'bg-green-500/12 text-green-300 border-green-500/20' } : null,
    card.email ? { label: 'Enviar correo', href: `mailto:${card.email}`, tone: 'bg-indigo-500/12 text-indigo-300 border-indigo-500/20' } : null,
    getWebsiteHref(card.website) ? { label: 'Visitar sitio', href: getWebsiteHref(card.website)!, tone: 'bg-amber-500/12 text-amber-300 border-amber-500/20' } : null,
  ].filter(Boolean) as Array<{ label: string; href: string; tone: string }>

  return (
    <div className="min-h-screen bg-mts-bg px-4 pb-24 pt-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/5 bg-white/[0.03] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300/80">CardLink</p>
            <h1 className="mt-1 text-xl font-semibold text-white">{card.nombre}</h1>
            <p className="mt-1 text-sm text-slate-400">{card.tituloProfesional || 'Tarjeta digital profesional'}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            /{slug}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-4">
            <div className="rounded-[32px] border border-white/5 bg-white/[0.02] p-3 shadow-2xl shadow-black/20">
              <DesignCardPreview card={card} />
            </div>

            <div className="rounded-[28px] border border-white/5 bg-[#13131A] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">¿Es tu tarjeta?</p>
                  <p className="text-xs text-slate-400">Edita tu información, colores y enlaces en minutos.</p>
                </div>
                <Link
                  href={`/${slug}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10"
                >
                  Editar
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-6">
            <QRCodeDisplay url={cardUrl} slug={slug} />

            {contactActions.length > 0 && (
              <div className="rounded-[28px] border border-white/10 bg-[#13131A] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300/80">Contacto directo</p>
                <h2 className="mt-2 text-lg font-semibold text-white">Habla con {card.nombre.split(' ')[0]}</h2>
                <p className="mt-1 text-sm text-slate-400">Convierte la visita en contacto con acciones rápidas.</p>

                <div className="mt-4 grid gap-3">
                  {contactActions.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      target={action.href.startsWith('http') ? '_blank' : undefined}
                      rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 ${action.tone}`}
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/5 bg-[#13131A] p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Patrocinado</p>
            <AdBanner
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || 'SLOT_TOP'}
              format="horizontal"
              className="overflow-hidden rounded-xl"
            />
          </div>
          <div className="rounded-[28px] border border-white/5 bg-[#13131A] p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Más visibilidad</p>
            <AdBanner
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || 'SLOT_BOTTOM'}
              format="rectangle"
              className="overflow-hidden rounded-xl"
            />
          </div>
        </div>
      </div>

      <ShareButton url={cardUrl} name={card.nombre} title={card.tituloProfesional} />
    </div>
  )
}
