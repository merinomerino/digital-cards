'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createCard, DatabaseError } from '@/lib/firestore'
import { hashPin } from '@/lib/utils'
import { checkAdminAuth, clearAdminToken, getAdminToken } from '@/lib/adminAuth'
import type { Card } from '@/types/card'

type SeedCard = Omit<Card, 'id' | 'pinHash' | 'createdAt' | 'updatedAt'> & { pin: string }

const SEED_CARDS: SeedCard[] = [
  {
    slug: 'chekolettes',
    pin: '1234',
    nombre: 'Chekolettes Tattoo',
    tituloProfesional: 'Tattoo Studio',
    empresa: 'Chekolettes Ink',
    telefono: '+52 878 702 0221',
    email: 'chekolettes@merinotechsystems.com',
    website: 'www.instagram.com/chekolettes',
    fotoUrl: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=600&auto=format&fit=crop',
    diseño: 'tattoo',
    tagline: 'Arte permanente · Tu historia en piel',
    customFont: 'montserrat',
    customColors: { primary: '#39ff14', secondary: '#10161b', accent: 'rgba(57,255,20,.16)', bg: '#07070b', text: '#dcffe6' },
    servicios: [
      { name: 'Fine line personalizado', price: '$650' },
      { name: 'Blackwork sombreado', price: '$900' },
      { name: 'Color realista premium', price: '$1,250' },
      { name: 'Cover up estratégico', price: '$1,800' },
      { name: 'Diseño flash exclusivo', price: '$550' },
      { name: 'Sesión media manga', price: '$3,900' },
    ],
    horario: 'Martes a Jueves · 12:00 PM - 8:00 PM\nViernes y Sábado · 11:00 AM - 9:00 PM\nDomingo · Citas privadas de 1:00 PM - 5:00 PM',
    views: 0,
    clicks: 0,
    whatsappClicks: 0,
    instagramClicks: 0,
    phoneClicks: 0,
    ownerId: '',
    redesSociales: {
      linkedin: '',
      instagram: 'chekolettes',
      twitter: '',
      whatsapp: '5218787020221',
      github: '',
      tiktok: 'chekolettes',
    },
  },
  {
    slug: 'bigotes',
    pin: '5678',
    nombre: 'Bigotes Centro Veterinario',
    tituloProfesional: 'Medicina Veterinaria',
    empresa: 'Bigotes Vet',
    telefono: '+52 878 702 0221',
    email: 'bigotes@merinotechsystems.com',
    website: 'www.instagram.com/bigotesvet',
    fotoUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600&auto=format&fit=crop',
    diseño: 'vet',
    tagline: 'Cuidamos a quienes más amas',
    customFont: 'montserrat',
    customColors: { primary: '#14b8a6', secondary: '#fb7185', accent: 'rgba(20,184,166,.16)', bg: '#0d1f1d', text: '#e6fffb' },
    servicios: [
      { name: 'Consulta general integral', price: '$250' },
      { name: 'Vacunación y refuerzo', price: '$350' },
      { name: 'Estética canina spa', price: '$450' },
      { name: 'Cirugía menor ambulatoria', price: '$1,250' },
      { name: 'Desparasitación preventiva', price: '$180' },
      { name: 'Laboratorio express', price: '$420' },
    ],
    horario: 'Lunes a Viernes · 9:00 AM - 7:00 PM\nSábado · 9:00 AM - 3:00 PM\nUrgencias WhatsApp · 24/7 para pacientes registrados',
    views: 0,
    clicks: 0,
    whatsappClicks: 0,
    instagramClicks: 0,
    phoneClicks: 0,
    ownerId: '',
    redesSociales: {
      linkedin: '',
      instagram: 'bigotesvet',
      twitter: '',
      whatsapp: '5218787020221',
      github: '',
      tiktok: '',
    },
  },
  {
    slug: 'viajes-merino',
    pin: '9012',
    nombre: 'Viajes Merino',
    tituloProfesional: 'Agencia de Viajes',
    empresa: 'Viajes Merino',
    telefono: '+52 878 702 0221',
    email: 'viajes@merinotechsystems.com',
    website: 'www.instagram.com/viajesmerino',
    fotoUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
    diseño: 'travel',
    tagline: 'Tu mundo sin límites · Viaja con nosotros',
    customFont: 'playfair',
    customColors: { primary: '#fbbf24', secondary: '#0f172a', accent: 'rgba(251,191,36,.18)', bg: '#081120', text: '#fef3c7' },
    servicios: [
      { name: 'Paquetes nacionales boutique', price: '$3,900' },
      { name: 'Paquetes internacionales premium', price: '$8,500' },
      { name: 'Vuelos redondos flexibles', price: '$2,500' },
      { name: 'Seguro de viaje global', price: '$650' },
      { name: 'Cruceros y escapadas', price: '$5,900' },
      { name: 'Luna de miel personalizada', price: '$12,900' },
    ],
    horario: 'Lunes a Viernes · 9:00 AM - 6:30 PM\nSábado · 10:00 AM - 2:00 PM\nAtención online · Cotizaciones urgentes hasta 9:00 PM',
    views: 0,
    clicks: 0,
    whatsappClicks: 0,
    instagramClicks: 0,
    phoneClicks: 0,
    ownerId: '',
    redesSociales: {
      linkedin: '',
      instagram: 'viajesmerino',
      twitter: '',
      whatsapp: '5218787020221',
      github: '',
      tiktok: '',
    },
  },
]

type SeedStatus = 'idle' | 'creating' | 'done' | 'error'

export default function SeedPage() {
  const router = useRouter()
  const [authChecking, setAuthChecking] = useState(true)
  const [status, setStatus] = useState<SeedStatus>('idle')
  const [results, setResults] = useState<{ slug: string; ok: boolean; error?: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!checkAdminAuth()) {
        router.replace('/admin/login')
        return
      }

      const token = getAdminToken()
      if (!token) {
        router.replace('/admin/login')
        return
      }

      try {
        const response = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        })

        if (!response.ok) {
          clearAdminToken()
          router.replace('/admin/login')
          return
        }

        setAuthChecking(false)
      } catch {
        clearAdminToken()
        router.replace('/admin/login')
      }
    }

    void verifyAdmin()
  }, [router])

  const handleSeed = async () => {
    setStatus('creating')
    setError(null)
    setResults([])

    const resultsArr: { slug: string; ok: boolean; error?: string }[] = []

    for (const card of SEED_CARDS) {
      try {
        await createCard({
          slug: card.slug,
          pinHash: hashPin(card.pin),
          nombre: card.nombre,
          tituloProfesional: card.tituloProfesional,
          empresa: card.empresa,
          telefono: card.telefono,
          email: card.email,
          website: card.website,
          fotoUrl: card.fotoUrl,
          diseño: card.diseño,
          tagline: card.tagline,
          customFont: card.customFont,
          customColors: card.customColors,
          servicios: card.servicios,
          horario: card.horario,
          views: card.views,
          clicks: card.clicks,
          whatsappClicks: card.whatsappClicks,
          instagramClicks: card.instagramClicks,
          phoneClicks: card.phoneClicks,
          ownerId: card.ownerId,
          redesSociales: card.redesSociales,
        })
        resultsArr.push({ slug: card.slug, ok: true })
      } catch (err) {
        const msg = err instanceof DatabaseError ? err.message : 'Error desconocido'
        resultsArr.push({ slug: card.slug, ok: false, error: msg })
      }
    }

    setResults(resultsArr)
    setStatus('done')
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-mts-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-mts-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm">Verificando acceso admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mts-bg py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-2xl p-8 border border-mts-border/50">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Crear tarjetas showcase</h1>
              <p className="text-mts-muted text-sm">Esto creará las 3 tarjetas de referencia premium para ventas y demostraciones.</p>
            </div>
            <Link href="/admin/dashboard" className="text-sm text-mts-muted transition hover:text-white">← Volver al admin</Link>
          </div>

          <div className="space-y-4 mb-8">
            {SEED_CARDS.map((card) => (
              <div key={card.slug} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold">{card.nombre}</h3>
                    <p className="text-mts-muted text-xs mt-0.5">{card.tituloProfesional}</p>
                    <p className="text-indigo-300 text-xs mt-2 italic">{card.tagline}</p>
                    <p className="text-mts-muted text-xs mt-2">URL: <span className="text-indigo-400">/{card.slug}</span></p>
                    <p className="text-mts-muted text-[11px] mt-2">{card.servicios?.length || 0} servicios · fuente {card.customFont}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-mts-muted">PIN</span>
                    <p className="text-white font-mono text-lg font-bold">{card.pin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {status === 'idle' && (
            <button onClick={handleSeed} className="w-full py-3 bg-mts-primary hover:bg-mts-primary-hover text-white font-semibold rounded-xl transition-colors">
              Crear las 3 tarjetas
            </button>
          )}

          {status === 'creating' && (
            <div className="flex items-center justify-center gap-3 py-3">
              <div className="w-5 h-5 border-2 border-mts-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-sm">Creando tarjetas...</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="text-white font-semibold text-sm">Resultados:</h2>
              {results.map((r) => (
                <div key={r.slug} className={`rounded-xl p-4 ${r.ok ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-medium">{r.ok ? '✅' : '❌'} /{r.slug}</p>
                      {r.error && <p className="text-red-400 text-xs mt-1">{r.error}</p>}
                    </div>
                    {r.ok && (
                      <div className="flex gap-2">
                        <Link href={`/${r.slug}`} className="text-indigo-400 hover:text-indigo-300 text-sm underline">Ver tarjeta</Link>
                        <span className="text-mts-muted">·</span>
                        <Link href={`/${r.slug}/edit`} className="text-indigo-400 hover:text-indigo-300 text-sm underline">Editar</Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-amber-400 text-xs">⚠️ Si una tarjeta ya existe, la creación fallará por slug duplicado. Los PINs quedan listos arriba para compartirlos con el cliente correspondiente.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
