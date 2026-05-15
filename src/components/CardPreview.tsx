'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/types/card'
import { getSocialUrl } from '@/lib/utils'

interface CardPreviewProps {
  card: Card
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  whatsapp: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
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
    <div className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 animate-scale-in"
      style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' }}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          {card.fotoUrl ? (
            <Image src={card.fotoUrl} alt={card.nombre} width={80} height={80}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-600/60 flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border-2 border-indigo-400/30 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-300">{getInitials(card.nombre)}</span>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white leading-tight truncate">{card.nombre}</h1>
            <p className="text-indigo-400 font-medium text-sm mt-0.5 truncate">{card.tituloProfesional}</p>
            {card.empresa && <p className="text-mts-muted text-xs mt-1 truncate">{card.empresa}</p>}
          </div>
        </div>

        <div className="border-t border-slate-700/60" />

        <div className="space-y-2.5">
          {card.telefono && (
            <a href={`tel:${card.telefono}`}
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group">
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-mts-muted leading-none mb-0.5">Teléfono</p>
                <p className="text-white text-sm font-medium truncate">{card.telefono}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {card.email && (
            <a href={`mailto:${card.email}`}
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group">
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-mts-muted leading-none mb-0.5">Email</p>
                <p className="text-white text-sm font-medium truncate">{card.email}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {card.website && (
            <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group">
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-mts-muted leading-none mb-0.5">Sitio web</p>
                <p className="text-white text-sm font-medium truncate">{card.website.replace(/^https?:\/\//, '')}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          {card.googleMapsUrl && (
            <a href={card.googleMapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-slate-800/70 hover:bg-slate-700/70 active:bg-slate-700 rounded-xl transition-colors group">
              <span className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-xs text-mts-muted leading-none mb-0.5">Cómo llegar</p>
                <p className="text-white text-sm font-medium truncate">{card.direccion || 'Ver en Google Maps'}</p>
              </div>
              <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>

        {activeSocials.length > 0 && (
          <>
            <div className="border-t border-slate-700/60" />
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Redes sociales</p>
              <div className="grid grid-cols-3 gap-2.5">
                {activeSocials.map(({ key, label }) => {
                  const value = card.redesSociales[key as keyof Card['redesSociales']]!
                  return (
                    <a key={key} href={getSocialUrl(key, value)}
                      target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 py-3 px-2 bg-slate-800/50 hover:bg-slate-700/60 active:bg-slate-700 rounded-xl transition-colors">
                      <span className="text-indigo-400">{SOCIAL_ICONS[key]}</span>
                      <span className="text-xs text-mts-muted font-medium">{label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </>
        )}

        <Link href="/" className="flex items-center justify-center gap-1.5 text-xs text-mts-muted hover:text-slate-500 transition-colors pt-1">
          <span className="w-2 h-2 rounded-full bg-mts-primary" />
          Creado con <span className="text-indigo-400 font-semibold">CardLink</span>
        </Link>
      </div>
    </div>
  )
}
