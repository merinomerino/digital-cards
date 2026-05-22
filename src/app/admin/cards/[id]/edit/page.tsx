'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import CardEditorWithPreview from '@/components/CardEditorWithPreview'
import { CardFormData } from '@/components/CardForm'
import { getCardById, updateCard, DatabaseError } from '@/lib/firestore'
import { Card } from '@/types/card'

export default function AdminEditCardPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCardById(id)
      .then((c) => {
        if (!c) {
          toast.error('Tarjeta no encontrada.')
          router.push('/admin/cards')
        } else {
          setCard(c)
        }
      })
      .catch(() => toast.error('Error al cargar la tarjeta.'))
      .finally(() => setLoading(false))
  }, [id, router])

  const handleSubmit = async (data: CardFormData) => {
    try {
      await updateCard(id, {
        slug: data.slug,
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

      window.sessionStorage.setItem('cardlink-admin-flash', `Tarjeta /${data.slug} actualizada correctamente.`)
      router.push('/admin/cards')
    } catch (error) {
      const message = error instanceof DatabaseError ? error.message : 'No se pudo actualizar la tarjeta.'
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
          <h1 className="text-2xl font-bold text-white">Editar tarjeta</h1>
          <p className="mt-1 text-sm text-mts-muted">Modifica los datos de la tarjeta directamente desde el panel admin.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-mts-muted">Cargando tarjeta…</div>
      ) : card ? (
        <div className="rounded-[28px] border border-white/5 bg-white p-6 shadow-2xl sm:p-8">
          <CardEditorWithPreview onSubmit={handleSubmit} initialData={card} isEditing />
        </div>
      ) : null}
    </div>
  )
}
