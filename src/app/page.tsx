'use client'

import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import CardForm, { CardFormData } from '@/components/CardForm'
import { hashPin } from '@/lib/utils'
import { createCard } from '@/lib/firestore'

export default function HomePage() {
  const router = useRouter()

  const handleSubmit = async (data: CardFormData) => {
    try {
      const pinHash = hashPin(data.pin)
      await createCard({
        slug: data.slug,
        pinHash,
        nombre: data.nombre,
        tituloProfesional: data.tituloProfesional,
        empresa: data.empresa,
        telefono: data.telefono,
        email: data.email,
        website: data.website,
        fotoUrl: data.fotoUrl,
        redesSociales: data.redesSociales,
      })
      toast.success('¡Tarjeta creada!')
      router.push(`/${data.slug}`)
    } catch {
      toast.error('Error al crear la tarjeta. Intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }} />

      <section className="flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-6">
          ✨ Gratis · Sin registro · QR incluido
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Tu tarjeta de presentación{' '}
          <span className="text-indigo-400">digital</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-xl">
          Crea tu tarjeta profesional en segundos. Compártela con un QR o enlace.
          Actualízala cuando quieras con tu PIN.
        </p>
      </section>

      <section className="flex justify-center px-4 pb-20">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Crear mi tarjeta</h2>
          <CardForm onSubmit={handleSubmit} />
        </div>
      </section>
    </div>
  )
}
