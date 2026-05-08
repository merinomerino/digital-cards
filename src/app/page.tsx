'use client'

import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import CardForm, { CardFormData } from '@/components/CardForm'
import { hashPin } from '@/lib/utils'
import { createCard, FirestoreUnavailableError } from '@/lib/firestore'

const FEATURES = [
  { icon: '⚡', title: 'En segundos', desc: 'Crea tu tarjeta sin registro ni contraseñas.' },
  { icon: '📱', title: 'QR incluido', desc: 'Descarga o comparte tu código QR de inmediato.' },
  { icon: '✏️', title: 'Editable', desc: 'Actualiza tu info cuando quieras con tu PIN.' },
  { icon: '🔗', title: 'Link único', desc: 'Tu URL personalizada lista para compartir.' },
  { icon: '🌐', title: 'Redes sociales', desc: 'LinkedIn, WhatsApp, Instagram y más.' },
  { icon: '🔒', title: 'Seguro', desc: 'Tu PIN protege cualquier cambio en tu tarjeta.' },
]

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
      toast.success('¡Tarjeta creada exitosamente!')
      router.push(`/${data.slug}`)
    } catch (err) {
      if (err instanceof FirestoreUnavailableError) {
        toast.error('No se pudo conectar al servidor. Verifica tu conexión a internet e intenta de nuevo.', { duration: 5000 })
      } else {
        toast.error('Error al crear la tarjeta. Intenta de nuevo.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }}
      />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-16 pb-10 text-center text-white">
        {/* Logo mark */}
        <div className="mb-6">
          <span className="text-4xl font-extrabold tracking-tight">
            Card<span className="text-indigo-400">Link</span>
          </span>
          <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-full align-middle">
            BETA
          </span>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-1.5 rounded-full mb-6">
          ✨ 100% Gratis · Sin registro · QR incluido
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Tu tarjeta de presentación{' '}
          <span className="text-indigo-400">digital profesional</span>
        </h1>
        <p className="mt-5 text-lg text-slate-400 max-w-xl">
          Crea tu tarjeta en segundos, compártela con un QR o enlace único y actualízala
          cuando quieras. Sin apps, sin cuenta, sin costo.
        </p>

        <a
          href="#crear"
          className="mt-8 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          Crear mi tarjeta gratis →
        </a>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 pb-14 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-left"
          >
            <span className="text-2xl mb-2 block">{f.icon}</span>
            <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Form */}
      <section id="crear" className="flex justify-center px-4 pb-20">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Crear mi tarjeta digital</h2>
          <p className="text-slate-500 text-sm mb-6">
            Completa tu información. Tu tarjeta estará lista al instante.
          </p>
          <CardForm onSubmit={handleSubmit} />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center text-white">
        <h2 className="text-2xl font-bold mb-8">¿Cómo funciona?</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {[
            { step: '1', title: 'Crea tu tarjeta', desc: 'Llena tu información y elige un link único.' },
            { step: '2', title: 'Comparte tu QR', desc: 'Descarga o muestra el QR para que te agreguen.' },
            { step: '3', title: 'Actualiza cuando quieras', desc: 'Edita tu tarjeta usando tu PIN de seguridad.' },
          ].map((item) => (
            <div key={item.step} className="flex-1 bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
