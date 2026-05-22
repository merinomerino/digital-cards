'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import CardEditorWithPreview from '@/components/CardEditorWithPreview'
import { CardFormData } from '@/components/CardForm'
import { createCard, DatabaseError } from '@/lib/firestore'
import { hashPin } from '@/lib/utils'

export default function AdminNewCardPage() {
  const router = useRouter()

  const handleSubmit = async (data: CardFormData) => {
    try {
      await createCard({
        slug: data.slug,
        pinHash: hashPin(data.pin),
        nombre: data.nombre,
        tituloProfesional: data.tituloProfesional,
        empresa: data.empresa,
        telefono: data.telefono,
        email: data.email,
        website: data.website,
        fotoUrl: data.fotoUrl,
        logoUrl: data.logoUrl || undefined,
        headerBanner: data.headerBanner || undefined,
        diseño: data.diseño,
        tagline: data.tagline,
        customFont: data.customFont,
        animation: data.animation !== 'none' ? data.animation : undefined,
        backgroundType: data.backgroundType !== 'solid' ? data.backgroundType : undefined,
        backgroundImage: data.backgroundImage || undefined,
        customGradient: data.customGradient || undefined,
        customColors: data.customColors,
        customCss: data.customCss || undefined,
        customHtml: data.customHtml || undefined,
        servicios: data.servicios,
        horario: data.horario,
        direccion: data.direccion,
        googleMapsUrl: data.googleMapsUrl,
        redesSociales: data.redesSociales,
      })

      window.sessionStorage.setItem('cardlink-admin-flash', `Tarjeta /${data.slug} creada correctamente.`)
      router.push('/admin/cards')
    } catch (error) {
      const message = error instanceof DatabaseError ? error.message : 'No se pudo crear la tarjeta.'
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#13131A',
            color: '#F1F5F9',
            border: '1px solid #1E293B',
            borderRadius: '14px',
          },
        }}
      />

      <div className="space-y-3">
        <Link href="/admin/cards" className="inline-flex items-center gap-2 text-sm text-mts-muted transition hover:text-white">
          ← Volver a tarjetas
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Nueva tarjeta</h1>
          <p className="mt-1 text-sm text-mts-muted">Crea una tarjeta con vista previa en tiempo real.</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/5 bg-white p-6 shadow-2xl sm:p-8">
        <CardEditorWithPreview onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

