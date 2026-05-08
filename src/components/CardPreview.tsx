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

  const activeSocials = socialPlatforms.filter(
    ({ key }) => card.redesSociales[key as keyof Card['redesSociales']]
  )

  return (
    <div className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60"
      style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' }}
    >
      {/* Banda de acento superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

      <div className="p-6 space-y-5">
        {/* Perfil */}
        <div className="flex items-center gap-4">
          {card.fotoUrl ? (
            <img
              src={card.fotoUrl}
              alt={card.nombre}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-600/60 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border-2 border-indigo-400/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-300">
                {getInitials(card.nombre)}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white leading-tight truncate">{card.nombre}</h1>
            <p className="text-indigo-400 font-medium text-sm mt-0.5 truncate">{card.tituloProfesional}</p>
            {card.empresa && (
              <p className="text-slate-400 text-xs mt-1 truncate">{card.empresa}</p>
            )}
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-slate-700/60" />

        {/* Contacto */}
        <div className="space-y-2.5">
          {card.telefono && (
            <a
              href={`tel:${card.telefono}`}
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group"
            >
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 leading-none mb-0.5">Teléfono</p>
                <p className="text-white text-sm font-medium truncate">{card.telefono}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group"
            >
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 leading-none mb-0.5">Email</p>
                <p className="text-white text-sm font-medium truncate">{card.email}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group"
            >
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 leading-none mb-0.5">Sitio web</p>
                <p className="text-white text-sm font-medium truncate">
                  {card.website.replace(/^https?:\/\//, '')}
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>

        {/* Redes sociales */}
        {activeSocials.length > 0 && (
          <>
            <div className="border-t border-slate-700/60" />
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Redes sociales
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {activeSocials.map(({ key, label }) => {
                  const value = card.redesSociales[key as keyof Card['redesSociales']]!
                  return (
                    <a
                      key={key}
                      href={getSocialUrl(key, value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 py-3 px-2 bg-slate-800/50 hover:bg-slate-700/60 active:bg-slate-700 rounded-xl transition-colors"
                    >
                      <span className="text-lg leading-none">{getSocialIcon(key)}</span>
                      <span className="text-xs text-slate-400 font-medium">{label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Watermark */}
        <a
          href="/"
          className="flex items-center justify-center gap-1.5 text-xs text-slate-700 hover:text-slate-500 transition-colors pt-1"
        >
          <span className="text-indigo-500">◆</span>
          Creado con <span className="text-indigo-400 font-semibold ml-0.5">CardLink</span>
          <span className="text-slate-700">· Gratis</span>
        </a>
      </div>
    </div>
  )
}
