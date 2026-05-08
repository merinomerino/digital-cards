import { notFound } from 'next/navigation'
import { getCardBySlug, FirestoreUnavailableError } from '@/lib/firestore'
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

  let card = null
  let dbError = false

  try {
    card = await getCardBySlug(slug)
  } catch (err) {
    if (err instanceof FirestoreUnavailableError) {
      dbError = true
    } else {
      throw err
    }
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Servicio no disponible</h1>
          <p className="text-slate-400 text-sm">
            No se pudo conectar a la base de datos. Intenta de nuevo en unos momentos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!card) notFound()

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'}/${slug}`

  return (
    <div className="min-h-screen bg-[#0f172a] pt-5 px-4 pb-12">
      <div className="max-w-sm mx-auto space-y-4">

        {/* Banner superior (compacto) */}
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || 'SLOT_TOP'}
          format="horizontal"
          className="rounded-xl overflow-hidden"
        />

        {/* Tarjeta principal */}
        <CardPreview card={card} />

        {/* Compartir — sección prominente */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <p className="text-slate-500 text-xs text-center mb-3 font-semibold uppercase tracking-wider">
            Compartir
          </p>
          <ShareButton
            url={cardUrl}
            name={card.nombre}
            title={card.tituloProfesional}
          />
        </div>

        {/* QR + editar en la misma fila de secciones */}
        <div className="grid grid-cols-2 gap-3">
          {/* QR compacto */}
          <QRCodeDisplay url={cardUrl} slug={slug} />

          {/* Acciones */}
          <div className="flex flex-col gap-3">
            <AdBanner
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || 'SLOT_BOTTOM'}
              format="rectangle"
              className="rounded-xl overflow-hidden flex-1"
            />
            <Link
              href={`/${slug}/edit`}
              className="flex items-center justify-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
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
    </div>
  )
}

