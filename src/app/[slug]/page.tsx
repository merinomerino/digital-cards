import { notFound } from 'next/navigation'
import { getCardBySlug } from '@/lib/firestore'
import CardPreview from '@/components/CardPreview'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import AdBanner from '@/components/AdBanner'
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
    },
  }
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params
  const card = await getCardBySlug(slug)
  if (!card) notFound()

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'}/${slug}`

  return (
    <div className="min-h-screen bg-[#0f172a] py-8 px-4">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Banner superior */}
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || 'SLOT_TOP'}
          format="horizontal"
          className="rounded-xl overflow-hidden"
        />

        <CardPreview card={card} />
        <QRCodeDisplay url={cardUrl} slug={slug} />

        {/* Banner inferior */}
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || 'SLOT_BOTTOM'}
          format="rectangle"
          className="rounded-xl overflow-hidden"
        />

        <div className="text-center">
          <Link
            href={`/${slug}/edit`}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ✏️ Editar tarjeta
          </Link>
        </div>
      </div>
    </div>
  )
}
