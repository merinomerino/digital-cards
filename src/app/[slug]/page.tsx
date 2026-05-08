import { notFound } from 'next/navigation'
import { getCardBySlug } from '@/lib/firestore'
import CardPreview from '@/components/CardPreview'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import AdBanner from '@/components/AdBanner'
import ShareButton from '@/components/ShareButton'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const card = await getCardBySlug(slug)
  if (!card) return { title: 'Tarjeta no encontrada' }
  return {
    title: `${card.nombre} — ${card.tituloProfesional}`,
    description: `${card.nombre}, ${card.tituloProfesional}${card.empresa ? ` en ${card.empresa}` : ''}`,
    openGraph: {
      title: card.nombre,
      description: card.tituloProfesional,
      images: card.fotoUrl ? [card.fotoUrl] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: card.nombre,
      description: card.tituloProfesional,
      images: card.fotoUrl ? [card.fotoUrl] : [],
    },
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params
  const card = await getCardBySlug(slug)
  if (!card) notFound()

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'}/${slug}`

  return (
    /* pb-8 extra para no quedar debajo del banner sticky en iOS */
    <div className="min-h-screen bg-[#0f172a] pt-6 px-4 pb-10">
      <div className="max-w-sm mx-auto space-y-5">

        {/* Banner superior */}
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || 'SLOT_TOP'}
          format="horizontal"
          className="rounded-xl overflow-hidden"
        />

        {/* Tarjeta */}
        <CardPreview card={card} />

        {/* Compartir — sección prominente */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <p className="text-slate-400 text-xs text-center mb-3 font-medium uppercase tracking-wider">
            Compartir tarjeta
          </p>
          <ShareButton
            url={cardUrl}
            name={card.nombre}
            title={card.tituloProfesional}
          />
        </div>

        {/* QR */}
        <QRCodeDisplay url={cardUrl} slug={slug} />

        {/* Banner inferior */}
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || 'SLOT_BOTTOM'}
          format="rectangle"
          className="rounded-xl overflow-hidden"
        />

        {/* Link editar */}
        <div className="text-center pb-2">
          <Link
            href={`/${slug}/edit`}
            className="text-slate-600 hover:text-slate-400 text-sm transition-colors"
          >
            ✏️ Editar mi tarjeta
          </Link>
        </div>

      </div>
    </div>
  )
}

