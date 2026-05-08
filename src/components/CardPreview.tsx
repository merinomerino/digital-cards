'use client'

import { Card } from '@/types/card'
import { getSocialIcon, getSocialUrl } from '@/lib/utils'

interface CardPreviewProps {
  card: Card
}

export default function CardPreview({ card }: CardPreviewProps) {
  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const socialPlatforms = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'github', label: 'GitHub' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'tiktok', label: 'TikTok' },
  ]

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-[#0f172a] to-[#1e293b] rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          {card.fotoUrl ? (
            <img
              src={card.fotoUrl}
              alt={card.nombre}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-400/50"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-4 border-indigo-400/50 flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-400">
                {getInitials(card.nombre)}
              </span>
            </div>
          )}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-white">{card.nombre}</h1>
            <p className="text-indigo-400 font-medium">{card.tituloProfesional}</p>
            {card.empresa && <p className="text-slate-400 text-sm">{card.empresa}</p>}
          </div>
        </div>

        <div className="space-y-3">
          {card.telefono && (
            <a
              href={`tel:${card.telefono}`}
              className="flex items-center justify-center w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Llamar
            </a>
          )}
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="flex items-center justify-center w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Email
            </a>
          )}
          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Sitio Web
            </a>
          )}
        </div>

        {Object.values(card.redesSociales).some(Boolean) && (
          <div className="grid grid-cols-3 gap-3">
            {socialPlatforms.map(({ key, label }) => {
              const value = card.redesSociales[key as keyof Card['redesSociales']]
              if (!value) return null
              return (
                <a
                  key={key}
                  href={getSocialUrl(key, value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors group"
                >
                  <span className="text-xl">{getSocialIcon(key)}</span>
                  <span className="text-xs text-slate-500 mt-1">{label}</span>
                </a>
              )
            })}
          </div>
        )}

        {/* Watermark + CTA */}
        <a
          href="/"
          className="flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors group"
          title="Crea tu tarjeta gratis en CardLink"
        >
          <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Creado con <span className="text-indigo-400 font-medium group-hover:underline">CardLink</span> · Gratis</span>
        </a>
      </div>
    </div>
  )
}
