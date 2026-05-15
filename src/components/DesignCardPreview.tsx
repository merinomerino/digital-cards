'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Card, CardCustomColors, SocialNetwork } from '@/types/card'
import { getSocialUrl } from '@/lib/utils'
import { getTemplate } from '@/lib/templates/registry'

interface Props {
  card: Card
}

type Palette = CardCustomColors

const FALLBACK_PALETTE: Palette = {
  primary: '#6366f1',
  secondary: '#4f46e5',
  accent: 'rgba(99,102,241,.15)',
  bg: '#0f172a',
  text: '#c7d2fe',
}

const FONT_FAMILIES = {
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
  mono: '"JetBrains Mono", "SFMono-Regular", monospace',
  montserrat: 'Montserrat, Inter, ui-sans-serif, system-ui, sans-serif',
} as const

const socialPlatforms: { key: SocialNetwork; label: string }[] = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'github', label: 'GitHub' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'tiktok', label: 'TikTok' },
]

function getPalette(card: Card): Palette {
  const templateColors = getTemplate(card.diseño || 'clasico')?.colors || FALLBACK_PALETTE
  return { ...templateColors, ...(card.customColors || {}) }
}

function getFontFamily(font?: Card['customFont']): string | undefined {
  if (!font) {
    return undefined
  }

  return FONT_FAMILIES[font]
}

function getContainerStyle(card: Card): CSSProperties {
  return { fontFamily: getFontFamily(card.customFont) }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getWebsiteHref(website: string): string {
  return website.startsWith('http') ? website : `https://${website}`
}

function getCtaHref(card: Card): string {
  if (card.redesSociales.whatsapp) {
    return getSocialUrl('whatsapp', card.redesSociales.whatsapp)
  }

  if (card.redesSociales.instagram) {
    return getSocialUrl('instagram', card.redesSociales.instagram)
  }

  if (card.telefono) {
    return `tel:${card.telefono}`
  }

  return '/'
}

function SocialIcon({ network, color }: { network: SocialNetwork; color: string }) {
  const commonProps = { className: 'w-5 h-5', viewBox: '0 0 24 24', fill: 'currentColor' as const, style: { color } }

  switch (network) {
    case 'linkedin':
      return <svg {...commonProps}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
    case 'instagram':
      return <svg {...commonProps}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
    case 'twitter':
      return <svg {...commonProps}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    case 'whatsapp':
      return <svg {...commonProps}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    case 'github':
      return <svg {...commonProps}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
    case 'tiktok':
      return <svg {...commonProps}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
  }
}

function ClassicCard({ card }: { card: Card }) {
  const palette = getPalette(card)
  const activeSocials = socialPlatforms.filter(({ key }) => card.redesSociales[key])

  return (
    <div
      className="w-full overflow-hidden rounded-3xl border shadow-2xl animate-scale-in"
      style={{
        ...getContainerStyle(card),
        background: `linear-gradient(165deg, ${palette.bg} 0%, ${palette.secondary} 120%)`,
        borderColor: `${palette.primary}22`,
      }}
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary}, ${palette.primary})` }} />
      <div className="space-y-5 p-6">
        <div className="flex items-center gap-4">
          {card.fotoUrl ? (
            <Image src={card.fotoUrl} alt={card.nombre} width={80} height={80} className="h-20 w-20 rounded-2xl object-cover flex-shrink-0" style={{ border: `2px solid ${palette.primary}33` }} />
          ) : (
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold" style={{ background: palette.accent, color: palette.text, border: `2px solid ${palette.primary}33` }}>
              {getInitials(card.nombre)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-white">{card.nombre}</h1>
            <p className="truncate text-sm font-medium" style={{ color: palette.primary }}>{card.tituloProfesional}</p>
            {card.tagline && <p className="mt-1 text-sm italic" style={{ color: palette.text }}>{card.tagline}</p>}
            {card.empresa && <p className="mt-1 truncate text-xs text-mts-muted">{card.empresa}</p>}
          </div>
        </div>

        <div className="space-y-2.5">
          {card.telefono && (
            <a href={`tel:${card.telefono}`} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors" style={{ background: `${palette.accent}`, color: '#fff' }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${palette.primary}22`, color: palette.primary }}>☎</span>
              <div>
                <p className="text-xs text-mts-muted">Teléfono</p>
                <p className="text-sm font-medium text-white">{card.telefono}</p>
              </div>
            </a>
          )}
          {card.email && (
            <a href={`mailto:${card.email}`} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors" style={{ background: `${palette.accent}`, color: '#fff' }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${palette.primary}22`, color: palette.primary }}>✉</span>
              <div>
                <p className="text-xs text-mts-muted">Email</p>
                <p className="text-sm font-medium text-white">{card.email}</p>
              </div>
            </a>
          )}
          {card.website && (
            <a href={getWebsiteHref(card.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors" style={{ background: `${palette.accent}`, color: '#fff' }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${palette.primary}22`, color: palette.primary }}>↗</span>
              <div>
                <p className="text-xs text-mts-muted">Sitio web</p>
                <p className="text-sm font-medium text-white">{card.website.replace(/^https?:\/\//, '')}</p>
              </div>
            </a>
          )}
          {card.googleMapsUrl && (
            <a href={card.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors" style={{ background: `${palette.accent}`, color: '#fff' }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${palette.primary}22`, color: palette.primary }}>📍</span>
              <div className="min-w-0">
                <p className="text-xs text-mts-muted">Cómo llegar</p>
                <p className="text-sm font-medium text-white truncate">{card.direccion || 'Ver en Google Maps'}</p>
              </div>
            </a>
          )}
        </div>

        {activeSocials.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-mts-muted">Redes sociales</p>
            <div className="grid grid-cols-3 gap-2.5">
              {activeSocials.map(({ key, label }) => {
                const value = card.redesSociales[key]
                return (
                  <a key={key} href={getSocialUrl(key, value)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition-colors" style={{ background: `${palette.accent}` }}>
                    <SocialIcon network={key} color={palette.primary} />
                    <span className="text-xs font-medium text-mts-muted">{label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        <Link href="/" className="flex items-center justify-center gap-1.5 pt-1 text-xs text-mts-muted transition-colors hover:text-white">
          <span className="h-2 w-2 rounded-full" style={{ background: palette.primary }} />
          Creado con <span style={{ color: palette.primary }} className="font-semibold">CardLink</span>
        </Link>
      </div>
    </div>
  )
}

function TattooCard({ card }: { card: Card }) {
  const palette = getPalette(card)
  const services = card.servicios?.length ? card.servicios : [
    { name: 'Blackwork', price: '$800' },
    { name: 'Color realista', price: '$1,200' },
    { name: 'Fine line', price: '$600' },
    { name: 'Cover up', price: '$1,500' },
  ]
  const buttons = [
    { title: 'WhatsApp', subtitle: 'Agenda tu sesión', href: card.redesSociales.whatsapp ? getSocialUrl('whatsapp', card.redesSociales.whatsapp) : undefined, icon: '⚡' },
    { title: 'Instagram', subtitle: 'Trabajos recientes', href: card.redesSociales.instagram ? getSocialUrl('instagram', card.redesSociales.instagram) : undefined, icon: '📸' },
    { title: 'Teléfono', subtitle: 'Llama ahora', href: card.telefono ? `tel:${card.telefono}` : undefined, icon: '📞' },
    { title: 'Website', subtitle: 'Conoce el estudio', href: card.website ? getWebsiteHref(card.website) : undefined, icon: '↗' },
    { title: 'Cómo llegar', subtitle: card.direccion || 'Google Maps', href: card.googleMapsUrl || undefined, icon: '📍' },
  ].filter((button) => button.href)

  return (
    <div
      className="overflow-hidden rounded-[28px] shadow-2xl"
      style={{ ...getContainerStyle(card), background: palette.bg, border: `1px solid ${palette.primary}20` }}
    >
      <div
        className="relative px-6 pb-5 pt-8"
        style={{
          background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.secondary} 100%)`,
          borderBottom: `1px solid ${palette.primary}18`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: `radial-gradient(circle at 12% 18%, ${palette.primary} 1px, transparent 1px), linear-gradient(120deg, transparent 40%, ${palette.primary}22 40%, transparent 42%), radial-gradient(circle at 78% 42%, ${palette.primary} 1px, transparent 1px)`, backgroundSize: '24px 24px, 100% 100%, 30px 30px' }} />
        <div className="relative z-10 text-center">
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full" style={{ border: `2px solid ${palette.primary}55`, boxShadow: `0 0 32px ${palette.primary}44`, background: `${palette.primary}14` }}>
            {card.fotoUrl ? <Image src={card.fotoUrl} alt={card.nombre} fill className="object-cover" /> : <span className="text-3xl font-bold" style={{ color: palette.primary }}>{getInitials(card.nombre)}</span>}
          </div>
          <h2 className="text-[30px] font-black uppercase tracking-[0.18em] text-white sm:text-[34px]">{card.nombre}</h2>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: palette.primary }}>{card.tituloProfesional}</p>
          {card.tagline && (
            <div className="mx-auto mt-5 max-w-sm rounded-2xl px-4 py-3 text-sm italic" style={{ border: `1px solid ${palette.primary}55`, background: `${palette.primary}12`, color: palette.text, boxShadow: `0 0 24px ${palette.primary}1f` }}>
              “{card.tagline}”
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid gap-3">
          {buttons.map((button) => (
            <a key={button.title} href={button.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-full px-4 py-3 transition hover:translate-x-1" style={{ background: `${palette.primary}0e`, border: `1px solid ${palette.primary}22` }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm" style={{ background: `${palette.primary}1f`, color: palette.primary }}>{button.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white">{button.title}</div>
                <div className="text-xs text-white/55">{button.subtitle}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="rounded-[24px] p-4" style={{ background: `${palette.primary}08`, border: `1px solid ${palette.primary}18` }}>
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.35em]" style={{ color: palette.primary }}>Servicios</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.name} className="rounded-2xl px-4 py-3" style={{ background: `${palette.bg}aa`, border: `1px solid ${palette.primary}14` }}>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: palette.primary, boxShadow: `0 0 12px ${palette.primary}` }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{service.name}</p>
                    <p className="mt-1 text-sm font-bold" style={{ color: palette.primary }}>{service.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {card.horario && (
          <div className="rounded-2xl px-4 py-3 text-center" style={{ borderTop: `1px solid ${palette.primary}18`, color: 'rgba(255,255,255,0.72)' }}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.32em]" style={{ color: palette.primary }}>Horario</p>
            <div className="whitespace-pre-line text-sm leading-7">{card.horario}</div>
          </div>
        )}

        <a href={getCtaHref(card)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl px-5 py-4 text-white transition hover:opacity-95" style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
          <div>
            <p className="text-sm font-semibold">Agendar cita</p>
            <p className="text-xs text-white/75">WhatsApp o Instagram con respuesta rápida</p>
          </div>
          <span className="text-xl">↗</span>
        </a>

        {card.empresa && <p className="text-center text-[11px] uppercase tracking-[0.25em] text-white/35">{card.empresa}</p>}
      </div>
    </div>
  )
}

function VetCard({ card }: { card: Card }) {
  const palette = getPalette(card)
  const services = card.servicios?.length ? card.servicios : [
    { name: 'Consulta general', price: '$250' },
    { name: 'Vacunación', price: '$350' },
    { name: 'Estética canina', price: '$400' },
    { name: 'Cirugía menor', price: '$1,200' },
  ]
  const contactActions = [
    { title: 'WhatsApp', subtitle: 'Agenda tu cita', href: card.redesSociales.whatsapp ? getSocialUrl('whatsapp', card.redesSociales.whatsapp) : undefined, icon: '💬' },
    { title: 'Teléfono', subtitle: 'Urgencias y consultas', href: card.telefono ? `tel:${card.telefono}` : undefined, icon: '📞' },
    { title: 'Instagram', subtitle: 'Historias y pacientes', href: card.redesSociales.instagram ? getSocialUrl('instagram', card.redesSociales.instagram) : undefined, icon: '📸' },
    { title: 'Cómo llegar', subtitle: card.direccion || 'Google Maps', href: card.googleMapsUrl || undefined, icon: '📍' },
  ].filter((action) => action.href)

  return (
    <div className="overflow-hidden rounded-[28px] shadow-2xl" style={{ ...getContainerStyle(card), background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.secondary} 130%)`, border: `1px solid ${palette.primary}18` }}>
      <div className="relative px-6 pb-6 pt-8" style={{ background: `linear-gradient(160deg, ${palette.primary}22 0%, transparent 75%)` }}>
        <div className="absolute -right-8 top-0 text-[110px] opacity-[0.08]">🐾</div>
        <div className="relative z-10 flex items-center gap-4 rounded-[24px] px-4 py-4" style={{ background: `${palette.primary}10`, border: `1px solid ${palette.primary}16` }}>
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl flex-shrink-0" style={{ background: '#fff', border: `3px solid ${palette.primary}40` }}>
            {card.fotoUrl ? <Image src={card.fotoUrl} alt={card.nombre} fill className="object-cover" /> : <span className="text-2xl font-bold" style={{ color: palette.primary }}>{getInitials(card.nombre)}</span>}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-white sm:text-[30px]">{card.nombre}</h2>
            <p className="mt-1 text-sm font-semibold" style={{ color: palette.primary }}>{card.tituloProfesional}</p>
            {card.tagline && <p className="mt-3 flex items-center gap-2 text-sm italic" style={{ color: palette.text }}><span>🐾</span><span>{card.tagline}</span></p>}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {contactActions.map((action) => (
            <a key={action.title} href={action.href} target="_blank" rel="noopener noreferrer" className="rounded-2xl px-4 py-4 transition hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${palette.primary}16` }}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl text-lg" style={{ background: `${palette.primary}16` }}>{action.icon}</div>
              <p className="text-sm font-semibold text-white">{action.title}</p>
              <p className="mt-1 text-xs" style={{ color: palette.text }}>{action.subtitle}</p>
            </a>
          ))}
        </div>

        <div className="rounded-[24px] p-4" style={{ background: `${palette.primary}10`, border: `1px solid ${palette.primary}16` }}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Servicios recomendados</p>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${palette.primary}18`, color: palette.primary }}>🐶 🐱</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.name} className="rounded-2xl bg-white/[0.03] px-4 py-3" style={{ border: `1px solid ${palette.primary}12` }}>
                <p className="text-sm font-medium text-white">{service.name}</p>
                <p className="mt-1 text-sm font-bold" style={{ color: palette.primary }}>{service.price}</p>
              </div>
            ))}
          </div>
        </div>

        {card.horario && (
          <div className="rounded-[24px] px-5 py-4" style={{ background: `${palette.secondary}88`, border: `1px solid ${palette.primary}18` }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: `${palette.primary}16`, color: palette.primary }}>♥</span>
              Horario de atención
            </div>
            <div className="whitespace-pre-line text-sm leading-7" style={{ color: palette.text }}>{card.horario}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function TravelCard({ card }: { card: Card }) {
  const palette = getPalette(card)
  const services = card.servicios?.length ? card.servicios : [
    { name: 'Paquetes nacionales', price: '$3,900' },
    { name: 'Paquetes internacionales', price: '$8,500' },
    { name: 'Vuelos redondo', price: '$2,500' },
    { name: 'Seguro de viaje', price: '$650' },
  ]
  const contactHref = getCtaHref(card)

  return (
    <div className="overflow-hidden rounded-[28px] shadow-2xl" style={{ ...getContainerStyle(card), background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.secondary} 130%)`, border: `1px solid ${palette.primary}16` }}>
      <div className="relative overflow-hidden px-6 pb-7 pt-8" style={{ background: `linear-gradient(135deg, ${palette.secondary} 0%, ${palette.bg} 55%, ${palette.primary}18 100%)` }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: `radial-gradient(circle at 15% 25%, ${palette.primary} 1px, transparent 1px), radial-gradient(circle at 70% 40%, ${palette.primary} 1px, transparent 1px), linear-gradient(120deg, transparent 45%, ${palette.primary}22 45%, transparent 48%)`, backgroundSize: '60px 60px, 80px 80px, 100% 100%' }} />
        <div className="relative z-10 rounded-[24px] px-5 py-5" style={{ background: 'rgba(8,17,32,0.6)', border: `1px solid ${palette.primary}1a`, backdropFilter: 'blur(6px)' }}>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl flex-shrink-0" style={{ border: `2px solid ${palette.primary}44`, background: `${palette.primary}10` }}>
              {card.fotoUrl ? <Image src={card.fotoUrl} alt={card.nombre} fill className="object-cover" /> : <span className="text-xl font-bold" style={{ color: palette.primary }}>{getInitials(card.nombre)}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: palette.primary }}>Travel concierge</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{card.nombre}</h2>
              <p className="text-sm font-medium" style={{ color: palette.text }}>{card.tituloProfesional}</p>
            </div>
          </div>
          {card.tagline && <p className="max-w-sm text-base font-semibold italic" style={{ color: palette.primary }}>“{card.tagline}”</p>}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <a href={contactHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-[22px] px-5 py-4 text-white transition hover:opacity-95" style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
          <div>
            <p className="text-sm font-semibold">Cotiza tu próximo viaje</p>
            <p className="text-xs text-white/75">Atención personalizada por WhatsApp o llamada</p>
          </div>
          <span className="text-xl">✈</span>
        </a>

        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between gap-4 rounded-2xl px-4 py-4" style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${palette.primary}18` }}>
              <div>
                <p className="text-sm font-semibold text-white">{service.name}</p>
                <p className="mt-1 text-xs" style={{ color: palette.text }}>Paquete diseñado para maximizar experiencia y valor.</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: `${palette.primary}16`, color: palette.primary }}>{service.price}</span>
            </div>
          ))}
        </div>

        {card.horario && (
          <div className="rounded-[24px] px-5 py-4" style={{ background: `${palette.primary}10`, border: `1px solid ${palette.primary}18` }}>
            <p className="mb-3 text-sm font-semibold text-white">Horario de atención</p>
            <div className="whitespace-pre-line text-sm leading-7" style={{ color: palette.text }}>{card.horario}</div>
          </div>
        )}

        <div className="rounded-2xl px-4 py-3 text-center" style={{ borderTop: `1px dashed ${palette.primary}33`, color: `${palette.primary}` }}>
          <p className="text-[11px] uppercase tracking-[0.3em]">CardLink · cardlink.mx/{card.slug}</p>
        </div>
      </div>
    </div>
  )
}

export default function DesignCardPreview({ card }: Props) {
  const diseño = card.diseño || 'clasico'

  switch (diseño) {
    case 'tattoo':
      return <TattooCard card={card} />
    case 'vet':
      return <VetCard card={card} />
    case 'travel':
      return <TravelCard card={card} />
    default:
      return <ClassicCard card={card} />
  }
}
