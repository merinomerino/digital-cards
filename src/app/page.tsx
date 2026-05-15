'use client'

import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import CardForm, { CardFormData } from '@/components/CardForm'
import ExamplePhoneMockup, { ExamplePhoneMockupData } from '@/components/ExamplePhoneMockup'
import { hashPin } from '@/lib/utils'
import { createCard } from '@/lib/firestore'
import { DatabaseError } from '@/lib/firestore'

const WHATSAPP = 'https://wa.me/5218787020221?text=Hola,%20quiero%20una%20tarjeta%20digital%20personalizada%20para%20mi%20negocio'

const FEATURES = [
  {
    title: 'Diseño único',
    desc: 'Cada tarjeta se diseña desde cero con la identidad de tu marca. Colores, tipografía y estilo propios.',
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'QR + NFC',
    desc: 'Código QR descargable y chip NFC en el cartel físico. Tus clientes acceden al instante.',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    title: 'Link personalizado',
    desc: 'cardlink.mx/tu-marca. Un enlace profesional y fácil de recordar.',
    icon: (
      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: 'Redes sociales',
    desc: 'LinkedIn, WhatsApp, Instagram, TikTok, GitHub y más integrados.',
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  {
    title: 'Editable siempre',
    desc: 'Actualiza tu información cuando quieras. Tu tarjeta crece con tu negocio.',
    icon: (
      <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Físico + Digital',
    desc: 'Lleva tu identidad al mostrador con un cartel profesional acrílico con NFC.',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
]

const EXAMPLES: ExamplePhoneMockupData[] = [
  {
    variant: 'tattoo',
    logo: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=600&auto=format&fit=crop',
    name: 'CHEKOLETTES',
    subtitle: 'Tattoo Studio',
    buttons: [
      { icon: '⚡', title: 'WhatsApp', subtitle: 'Agenda tu sesión', href: 'https://wa.me/5218787020221' },
      { icon: '📸', title: 'Instagram', subtitle: 'Trabajos recientes', href: '#' },
      { icon: '💉', title: 'Cotiza tu diseño', subtitle: 'Cuéntanos tu idea', href: '#' },
      { icon: '📍', title: 'Ubicación', subtitle: 'Visita el estudio', href: '#' },
    ],
    services: [
      { name: 'Blackwork', price: '$800' },
      { name: 'Color realista', price: '$1,200' },
      { name: 'Fine line', price: '$600' },
      { name: 'Cover up', price: '$1,500' },
    ],
    schedule: 'Martes a Sábado · 11:00 AM - 8:00 PM\nDomingo · 12:00 PM - 5:00 PM',
  },
  {
    variant: 'vet',
    logo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600&auto=format&fit=crop',
    name: 'Bigotes',
    subtitle: 'Centro Veterinario',
    buttons: [
      { icon: '📞', title: 'WhatsApp', subtitle: 'Agenda tu cita', href: 'https://wa.me/5218787020221' },
      { icon: '🏥', title: 'Urgencias', subtitle: '24/7', href: 'tel:+528787020221' },
      { icon: '📋', title: 'Servicios', subtitle: 'Conoce más', href: '#' },
      { icon: '📍', title: 'Ubicación', subtitle: 'Visítanos', href: '#' },
    ],
    services: [
      { name: 'Consulta general', price: '$250' },
      { name: 'Vacunación', price: '$350' },
      { name: 'Estética canina', price: '$400' },
      { name: 'Cirugía menor', price: '$1,200' },
    ],
    schedule: 'Lunes a Viernes · 9:00 AM - 7:00 PM\nSábado · 9:00 AM - 3:00 PM',
  },
  {
    variant: 'travel',
    logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
    name: 'VIAJES MERINO',
    subtitle: 'Agencia de Viajes',
    buttons: [
      { icon: '✈️', title: 'WhatsApp', subtitle: 'Cotiza tu viaje', href: 'https://wa.me/5218787020221' },
      { icon: '🌍', title: 'Instagram', subtitle: 'Destinos increíbles', href: '#' },
      { icon: '🏨', title: 'Reservaciones', subtitle: 'Hoteles y vuelos', href: '#' },
      { icon: '📍', title: 'Oficina', subtitle: 'Visítanos', href: '#' },
    ],
    services: [
      { name: 'Paquetes nacionales', price: '$3,900' },
      { name: 'Paquetes internacionales', price: '$8,500' },
      { name: 'Vuelos redondo', price: '$2,500' },
      { name: 'Seguro de viaje', price: '$650' },
    ],
    schedule: 'Lunes a Viernes · 9:00 AM - 6:00 PM\nSábado · 10:00 AM - 2:00 PM',
  },
]

const STEPS = [
  { step: '1', title: 'Contáctanos', desc: 'Escríbenos por WhatsApp o email. Cuéntanos de tu negocio.' },
  { step: '2', title: 'Diseñamos', desc: 'Creamos tu tarjeta digital con la identidad de tu marca.' },
  { step: '3', title: 'Recibes', desc: 'Te enviamos tu link, QR, y si aplica, el cartel físico con NFC.' },
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
        diseño: data.diseño,
        tagline: data.tagline,
        customFont: data.customFont,
        customColors: data.customColors,
        servicios: data.servicios,
        horario: data.horario,
        redesSociales: data.redesSociales,
      })
      toast.success('¡Tarjeta creada exitosamente!')
      router.push(`/${data.slug}`)
    } catch (err) {
      if (err instanceof DatabaseError) {
        toast.error(err.message, { duration: 5000 })
      } else {
        toast.error('Error al crear la tarjeta. Intenta de nuevo.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-mts-bg">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#13131a', color: '#f1f5f9', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '14px' },
        }}
      />

      {/* ───── Navigation ───── */}
      <nav className="sticky top-0 z-40 glass border-b border-mts-border/50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-white tracking-tight">
            Card<span className="text-mts-primary">Link</span>
          </span>
          <div className="flex items-center gap-4 text-sm">
            <a href="#servicios" className="text-mts-muted hover:text-white transition-colors">Servicios</a>
            <a href="#ejemplos" className="text-mts-muted hover:text-white transition-colors">Ejemplos</a>
            <a href="#proceso" className="text-mts-muted hover:text-white transition-colors">Proceso</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="bg-mts-primary hover:bg-mts-primary-hover text-white px-4 py-1.5 rounded-lg transition-colors">
              Cotizar
            </a>
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Diseñamos tarjetas digitales personalizadas para tu negocio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Tu identidad profesional,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              diseñada a tu medida
            </span>
          </h1>
          <p className="mt-5 text-lg text-mts-muted max-w-2xl mx-auto leading-relaxed">
            Olvídate de plantillas genéricas. Creamos tarjetas digitales profesionales con la identidad
            de tu marca, más la opción de cartel físico con QR y NFC para tu negocio.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Solicitar presupuesto
            </a>
            <a href="#ejemplos"
              className="inline-flex items-center gap-2 glass text-white font-medium px-8 py-3 rounded-xl transition-all hover:bg-white/5">
              Ver ejemplos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ───── Servicios ───── */}
      <section id="servicios" className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-3">Servicios</h2>
        <p className="text-mts-muted text-center mb-12 max-w-xl mx-auto">
          Te ofrecemos la combinación perfecta de identidad digital y presencia física.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8 border border-indigo-500/20">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tarjeta Digital Personalizada</h3>
            <p className="text-mts-muted text-sm mb-4">Diseñamos tu tarjeta desde cero con los colores, logo y estilo de tu marca.</p>
            <ul className="space-y-2 text-sm text-mts-muted">
              {['Diseño profesional único (sin plantillas)', 'Código QR descargable', 'Link personalizado cardlink.mx/tu-marca', 'Redes sociales integradas', 'Edición y actualización sin costo'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-8 border border-violet-500/20">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cartel Físico QR + NFC</h3>
            <p className="text-mts-muted text-sm mb-4">Lleva tu tarjeta digital al mundo físico. Ideal para mostradores y oficinas.</p>
            <ul className="space-y-2 text-sm text-mts-muted">
              {['Materiales: vinil adhesivo o acrílico premium', 'Código QR grabado en alta resolución', 'Chip NFC integrado (acercan y ven tu perfil)', 'Diseño coordinado con tu tarjeta digital', 'Envío a domicilio'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── Características ───── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">¿Por qué CardLink?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`animate-fade-in stagger-${i + 1}`}>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-mts-muted text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Ejemplos / Portafolio ───── */}
      <section id="ejemplos" className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-3">Casos recientes</h2>
        <p className="text-mts-muted text-center mb-10 max-w-md mx-auto">Cada tarjeta es única, diseñada desde cero para cada cliente. Desliza para ver más.</p>
        <div className="grid md:grid-cols-3 gap-6 justify-items-center">
          {EXAMPLES.map((ex, i) => (
            <div key={ex.name} className={`animate-fade-in stagger-${i + 1} overflow-hidden`}>
              <ExamplePhoneMockup data={ex} />
            </div>
          ))}
        </div>
      </section>

      {/* ───── Proceso ───── */}
      <section id="proceso" className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Cómo trabajamos</h2>
        <p className="text-mts-muted mb-10 max-w-md mx-auto">De la idea a tu tarjeta lista en 3 pasos.</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {STEPS.map(item => (
            <div key={item.step} className="flex-1 glass rounded-xl p-6 animate-fade-in">
              <div className="w-10 h-10 bg-mts-primary rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg shadow-indigo-500/20">
                {item.step}
              </div>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-mts-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Empezar mi proyecto
        </a>
      </section>

      {/* ───── Cartel Físico - Pricing ───── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="glass rounded-2xl p-8 md:p-12 border border-violet-500/10">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Cartel Físico</h2>
          <p className="text-mts-muted text-center mb-10 max-w-md mx-auto">Agrega un cartel profesional a tu tarjeta digital. Precios en MXN.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Vinil Adhesivo', price: '$249', desc: 'Perfecto para vidrieras y superficies lisas. Resistente al agua.', size: '15×10 cm' },
              { name: 'Acrílico Delgado', price: '$349', desc: 'Base acrílica de 3mm con impresión UV. Ideal para escritorio.', size: '20×15 cm' },
              { name: 'Acrílico Premium', price: '$499', desc: 'Acrílico de 5mm con bordes pulidos + soporte. Alta calidad.', size: '25×18 cm' },
            ].map(item => (
              <div key={item.name} className="glass rounded-xl p-5 text-center">
                <h4 className="text-white font-semibold mb-1">{item.name}</h4>
                <p className="text-mts-muted text-xs mb-3">{item.desc}</p>
                <p className="text-2xl font-bold text-white mb-1">{item.price}<span className="text-sm text-mts-muted font-normal"> MXN</span></p>
                <p className="text-xs text-mts-muted mb-4">{item.size}</p>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white text-sm font-medium py-2 rounded-xl transition-colors">
                  Solicitar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Contacto ───── */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="glass rounded-2xl p-8 md:p-12 border border-indigo-500/10">
          <h2 className="text-2xl font-bold text-white mb-3">¿Listo para tu tarjeta digital personalizada?</h2>
          <p className="text-mts-muted mb-8 max-w-lg mx-auto">
            Contáctanos hoy y recibe una cotización sin compromiso. Te responderemos en máximo 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-green-500/25">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir por WhatsApp
            </a>
            <a href="mailto:contacto@merinotechsystems.com"
              className="inline-flex items-center justify-center gap-2 glass hover:bg-white/5 text-white font-medium px-8 py-3 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contacto@merinotechsystems.com
            </a>
          </div>
        </div>
      </section>

      {/* ───── Formulario para clientes existentes ───── */}
      <section id="crear" className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">¿Ya tienes tu tarjeta CardLink?</h2>
            <p className="text-mts-muted text-sm mt-1">Crea o administra tu tarjeta si ya contrataste el servicio.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
            <CardForm onSubmit={handleSubmit} />
          </div>
        </div>
      </section>

    </div>
  )
}
