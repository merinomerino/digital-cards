import type { Metadata } from 'next'
import CardPageClient from './CardPageClient'

interface Props {
  params: Promise<{ slug: string }>
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const res = await fetch(`${APP_URL}/api/cards/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) {
      return {
        title: 'Tarjeta no encontrada | CardLink',
        description: 'Esta tarjeta digital no existe o fue eliminada.',
      }
    }
    const card = await res.json()

    const title = `${card.nombre} — ${card.tituloProfesional || 'Tarjeta digital'} | CardLink`
    const description = [
      card.tituloProfesional,
      card.empresa,
      card.tagline || 'Conecta y comparte tu tarjeta digital al instante.',
    ].filter(Boolean).join(' · ')
    const image = card.headerBanner || card.fotoUrl || card.logoUrl || `${APP_URL}/og-cardlink.png`
    const url = `${APP_URL}/${slug}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: 'CardLink',
        images: [{ url: image, width: 1200, height: 630, alt: card.nombre }],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: { canonical: url },
    }
  } catch {
    return { title: 'CardLink — Tarjeta digital profesional' }
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params
  return <CardPageClient slug={slug} />
}
