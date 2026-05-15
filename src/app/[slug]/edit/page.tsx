'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import PinModal from '@/components/PinModal'
import CardForm, { CardFormData } from '@/components/CardForm'
import { getCardBySlug, updateCard } from '@/lib/firestore'
import { Card } from '@/types/card'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const [card, setCard] = useState<Card | null>(null)
  const [pinVerified, setPinVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCardBySlug(slug).then(c => {
      if (!c) router.replace('/')
      else { setCard(c); setLoading(false) }
    })
  }, [slug, router])

  const handleUpdate = async (data: CardFormData) => {
    if (!card) return
    try {
      await updateCard(card.id, {
        nombre: data.nombre,
        tituloProfesional: data.tituloProfesional,
        empresa: data.empresa,
        telefono: data.telefono,
        email: data.email,
        website: data.website,
        fotoUrl: data.fotoUrl,
        diseño: data.diseño,
        tagline: data.tagline,
        customFont: data.customFont,
        customColors: data.customColors,
        servicios: data.servicios,
        horario: data.horario,
        redesSociales: data.redesSociales,
      })
      toast.success('¡Tarjeta actualizada!')
      router.push(`/${slug}`)
    } catch {
      toast.error('Error al actualizar. Intenta de nuevo.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] py-8 px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }} />

      <PinModal
        isOpen={!pinVerified}
        onClose={() => router.push(`/${slug}`)}
        onSuccess={() => setPinVerified(true)}
        cardId={slug}
      />

      {pinVerified && card && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Editar tarjeta</h1>
            <button
              onClick={() => router.push(`/${slug}`)}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← Ver tarjeta
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
            <CardForm initialData={card} onSubmit={handleUpdate} isEditing />
          </div>
        </div>
      )}
    </div>
  )
}
