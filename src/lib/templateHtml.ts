/**
 * templateHtml.ts
 * Motor de plantillas HTML con sustitución de variables {{nombre}}.
 * Permite al usuario editar el HTML real de su tarjeta desde el editor.
 */

import type { Card } from '@/types/card'
import { getSocialUrl, getWhatsAppUrl } from './utils'
import { getTemplate } from './templates/registry'

const FALLBACK_COLORS = {
  primary: '#6366f1',
  secondary: '#4f46e5',
  accent: 'rgba(99,102,241,.15)',
  bg: '#0f172a',
  text: '#c7d2fe',
}

function getPalette(card: Card) {
  const tpl = getTemplate(card.diseño || 'clasico')
  return { ...(tpl?.colors || FALLBACK_COLORS), ...(card.customColors || {}) }
}

/** Detecta si un HTML contiene variables de plantilla CardLink */
export function isTemplateHtml(html: string): boolean {
  return /\{\{[a-zA-Z#^/]/.test(html)
}

/** Construye el mapa de variables a partir de los datos de la tarjeta */
function buildVarMap(card: Card): Record<string, string> {
  const initials = card.nombre
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const websiteHref = card.website
    ? card.website.startsWith('http')
      ? card.website
      : `https://${card.website}`
    : ''
  const websiteClean = card.website?.replace(/^https?:\/\//, '') || ''

  const socials = card.redesSociales || {}

  return {
    nombre: card.nombre || '',
    tituloProfesional: card.tituloProfesional || '',
    empresa: card.empresa || '',
    telefono: card.telefono || '',
    email: card.email || '',
    website: card.website || '',
    websiteHref,
    websiteClean,
    fotoUrl: card.fotoUrl || '',
    tagline: card.tagline || '',
    slug: card.slug || '',
    direccion: card.direccion || '',
    googleMapsUrl: card.googleMapsUrl || '',
    horario: (card.horario || '').replace(/\n/g, '<br>'),
    initials,
    linkedin: socials.linkedin || '',
    instagram: socials.instagram || '',
    twitter: socials.twitter || '',
    whatsapp: socials.whatsapp || '',
    github: socials.github || '',
    tiktok: socials.tiktok || '',
    linkedinUrl: socials.linkedin ? getSocialUrl('linkedin', socials.linkedin) : '',
    instagramUrl: socials.instagram ? getSocialUrl('instagram', socials.instagram) : '',
    twitterUrl: socials.twitter ? getSocialUrl('twitter', socials.twitter) : '',
    whatsappUrl: socials.whatsapp ? getWhatsAppUrl(socials.whatsapp, card.nombre) : '',
    githubUrl: socials.github ? getSocialUrl('github', socials.github) : '',
    tiktokUrl: socials.tiktok ? getSocialUrl('tiktok', socials.tiktok) : '',
    serviciosHtml: buildServiciosHtml(card),
  }
}

function buildServiciosHtml(card: Card): string {
  if (!card.servicios?.length) return ''
  const p = getPalette(card)
  return card.servicios
    .map(
      (s) => `<div style="padding:12px 16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid ${p.primary}18;margin-bottom:8px;">
  <p style="font-size:14px;font-weight:600;color:#fff;margin:0 0 4px;">${s.name}</p>
  <p style="font-size:14px;font-weight:700;color:${p.primary};margin:0;">${s.price}</p>
</div>`,
    )
    .join('\n')
}

/**
 * Procesa un HTML de plantilla sustituyendo variables y bloques condicionales.
 * {{#campo}}...{{/campo}}  → muestra bloque si campo tiene valor
 * {{^campo}}...{{/campo}}  → muestra bloque si campo NO tiene valor
 * {{variable}}             → sustituye por el valor real
 */
export function renderTemplateVars(html: string, card: Card): string {
  const vars = buildVarMap(card)

  // Bloques condicionales positivos {{#campo}}...{{/campo}}
  let result = html.replace(
    /\{\{#([a-zA-Z]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key: string, content: string) => (vars[key] ? content : ''),
  )

  // Bloques condicionales negativos {{^campo}}...{{/campo}}
  result = result.replace(
    /\{\{\^([a-zA-Z]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key: string, content: string) => (vars[key] ? '' : content),
  )

  // Variables simples {{variable}}
  result = result.replace(
    /\{\{([a-zA-Z]+)\}\}/g,
    (_, key: string) => vars[key] ?? '',
  )

  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// Generadores de HTML por plantilla (con placeholders {{variable}})
// ─────────────────────────────────────────────────────────────────────────────

function getClasicaTemplateHtml(p: ReturnType<typeof getPalette>): string {
  return `<!-- Plantilla: Clásico CardLink -->
<!-- Variables disponibles: {{nombre}}, {{tituloProfesional}}, {{empresa}}, {{tagline}},
     {{telefono}}, {{email}}, {{website}}, {{websiteHref}}, {{websiteClean}},
     {{fotoUrl}}, {{initials}}, {{slug}}, {{direccion}}, {{googleMapsUrl}}, {{horario}},
     {{linkedin}}, {{instagram}}, {{twitter}}, {{whatsapp}}, {{github}}, {{tiktok}},
     {{linkedinUrl}}, {{instagramUrl}}, {{twitterUrl}}, {{whatsappUrl}}, {{githubUrl}}, {{tiktokUrl}},
     {{serviciosHtml}}
     Condicionales: {{#campo}}...{{/campo}}  |  {{^campo}}...{{/campo}} -->

<div style="
  width:100%;overflow:hidden;border-radius:24px;
  background:linear-gradient(165deg,${p.bg} 0%,${p.secondary} 120%);
  border:1px solid ${p.primary}22;font-family:Inter,ui-sans-serif,system-ui,sans-serif;
">
  <!-- Barra de acento superior -->
  <div style="height:6px;background:linear-gradient(90deg,${p.primary},${p.secondary},${p.primary});"></div>

  <div style="padding:24px;display:flex;flex-direction:column;gap:20px;">

    <!-- Encabezado: foto + nombre + título -->
    <div style="display:flex;align-items:center;gap:16px;">
      {{#fotoUrl}}
      <img src="{{fotoUrl}}" alt="{{nombre}}" style="width:80px;height:80px;border-radius:16px;object-fit:cover;border:2px solid ${p.primary}33;flex-shrink:0;">
      {{/fotoUrl}}
      {{^fotoUrl}}
      <div style="width:80px;height:80px;border-radius:16px;background:${p.accent};border:2px solid ${p.primary}33;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:${p.text};flex-shrink:0;">
        {{initials}}
      </div>
      {{/fotoUrl}}
      <div style="min-width:0;flex:1;overflow:hidden;">
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;word-break:break-word;overflow-wrap:break-word;line-height:1.25;">{{nombre}}</h1>
        <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:${p.primary};word-break:break-word;overflow-wrap:break-word;">{{tituloProfesional}}</p>
        {{#tagline}}
        <p style="margin:4px 0 0;font-size:13px;font-style:italic;color:${p.text};word-break:break-word;">{{tagline}}</p>
        {{/tagline}}
        {{#empresa}}
        <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.5);word-break:break-word;">{{empresa}}</p>
        {{/empresa}}
      </div>
    </div>

    <!-- Contacto -->
    <div style="display:flex;flex-direction:column;gap:10px;">
      {{#telefono}}
      <a href="tel:{{telefono}}" style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:14px 16px;background:${p.accent};text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:12px;background:${p.primary}22;color:${p.primary};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">☎</span>
        <div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Teléfono</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:#fff;">{{telefono}}</p>
        </div>
      </a>
      {{/telefono}}
      {{#email}}
      <a href="mailto:{{email}}" style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:14px 16px;background:${p.accent};text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:12px;background:${p.primary}22;color:${p.primary};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">✉</span>
        <div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Email</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:#fff;">{{email}}</p>
        </div>
      </a>
      {{/email}}
      {{#websiteHref}}
      <a href="{{websiteHref}}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:14px 16px;background:${p.accent};text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:12px;background:${p.primary}22;color:${p.primary};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">↗</span>
        <div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Sitio web</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:#fff;">{{websiteClean}}</p>
        </div>
      </a>
      {{/websiteHref}}
      {{#googleMapsUrl}}
      <a href="{{googleMapsUrl}}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:14px 16px;background:${p.accent};text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:12px;background:${p.primary}22;color:${p.primary};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">📍</span>
        <div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Cómo llegar</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:#fff;word-break:break-word;overflow-wrap:break-word;">{{direccion}}</p>
        </div>
      </a>
      {{/googleMapsUrl}}
    </div>

    <!-- Servicios -->
    {{#serviciosHtml}}
    <div>
      <p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.25em;color:rgba(255,255,255,0.4);">Servicios</p>
      {{serviciosHtml}}
    </div>
    {{/serviciosHtml}}

    <!-- Redes sociales -->
    <div style="display:flex;flex-direction:column;gap:8px;">
      {{#linkedinUrl}}<a href="{{linkedinUrl}}" target="_blank" style="display:flex;align-items:center;gap:12px;border-radius:14px;padding:12px 16px;background:${p.accent};text-decoration:none;color:#fff;font-size:14px;font-weight:500;">LinkedIn</a>{{/linkedinUrl}}
      {{#instagramUrl}}<a href="{{instagramUrl}}" target="_blank" style="display:flex;align-items:center;gap:12px;border-radius:14px;padding:12px 16px;background:${p.accent};text-decoration:none;color:#fff;font-size:14px;font-weight:500;">Instagram</a>{{/instagramUrl}}
      {{#twitterUrl}}<a href="{{twitterUrl}}" target="_blank" style="display:flex;align-items:center;gap:12px;border-radius:14px;padding:12px 16px;background:${p.accent};text-decoration:none;color:#fff;font-size:14px;font-weight:500;">Twitter / X</a>{{/twitterUrl}}
      {{#whatsappUrl}}<a href="{{whatsappUrl}}" target="_blank" style="display:flex;align-items:center;gap:12px;border-radius:14px;padding:12px 16px;background:${p.accent};text-decoration:none;color:#fff;font-size:14px;font-weight:500;">WhatsApp</a>{{/whatsappUrl}}
      {{#githubUrl}}<a href="{{githubUrl}}" target="_blank" style="display:flex;align-items:center;gap:12px;border-radius:14px;padding:12px 16px;background:${p.accent};text-decoration:none;color:#fff;font-size:14px;font-weight:500;">GitHub</a>{{/githubUrl}}
      {{#tiktokUrl}}<a href="{{tiktokUrl}}" target="_blank" style="display:flex;align-items:center;gap:12px;border-radius:14px;padding:12px 16px;background:${p.accent};text-decoration:none;color:#fff;font-size:14px;font-weight:500;">TikTok</a>{{/tiktokUrl}}
    </div>

    </div>
</div>`
}

function getTattooTemplateHtml(p: ReturnType<typeof getPalette>): string {
  return `<!-- Plantilla: Tattoo Studio -->
<!-- Variables: {{nombre}}, {{tituloProfesional}}, {{empresa}}, {{tagline}},
     {{telefono}}, {{email}}, {{website}}, {{websiteHref}}, {{websiteClean}},
     {{fotoUrl}}, {{initials}}, {{whatsappUrl}}, {{instagramUrl}},
     {{googleMapsUrl}}, {{direccion}}, {{horario}}, {{serviciosHtml}} -->

<div style="
  overflow:hidden;border-radius:28px;
  background:${p.bg};border:1px solid ${p.primary}20;
  font-family:Inter,ui-sans-serif,system-ui,sans-serif;
">
  <!-- Header -->
  <div style="
    position:relative;padding:32px 24px 20px;
    background:linear-gradient(180deg,${p.bg} 0%,${p.secondary} 100%);
    border-bottom:1px solid ${p.primary}18;text-align:center;
  ">
    <!-- Foto o iniciales -->
    <div style="
      position:relative;width:96px;height:96px;margin:0 auto 16px;
      border-radius:50%;overflow:hidden;
      border:2px solid ${p.primary}55;
      box-shadow:0 0 32px ${p.primary}44;
      background:${p.primary}14;
      display:flex;align-items:center;justify-content:center;
    ">
      {{#fotoUrl}}
      <img src="{{fotoUrl}}" alt="{{nombre}}" style="width:100%;height:100%;object-fit:cover;">
      {{/fotoUrl}}
      {{^fotoUrl}}
      <span style="font-size:30px;font-weight:700;color:${p.primary};">{{initials}}</span>
      {{/fotoUrl}}
    </div>
    <h2 style="margin:0;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:0.18em;color:#fff;">{{nombre}}</h2>
    <p style="margin:8px 0 0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.4em;color:${p.primary};">{{tituloProfesional}}</p>
    {{#tagline}}
    <div style="
      margin:20px auto 0;max-width:360px;border-radius:16px;padding:12px 16px;
      border:1px solid ${p.primary}55;background:${p.primary}12;
      color:${p.text};font-size:14px;font-style:italic;
      box-shadow:0 0 24px ${p.primary}1f;
    ">"{{tagline}}"</div>
    {{/tagline}}
  </div>

  <!-- Cuerpo -->
  <div style="padding:24px;display:flex;flex-direction:column;gap:20px;">

    <!-- Botones de contacto -->
    <div style="display:flex;flex-direction:column;gap:12px;">
      {{#whatsappUrl}}
      <a href="{{whatsappUrl}}" target="_blank" style="display:flex;align-items:center;gap:16px;border-radius:50px;padding:12px 16px;background:${p.primary}0e;border:1px solid ${p.primary}22;text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:50%;background:${p.primary}1f;color:${p.primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">⚡</span>
        <div>
          <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">WhatsApp</p>
          <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.55);">Agenda tu sesión</p>
        </div>
      </a>
      {{/whatsappUrl}}
      {{#instagramUrl}}
      <a href="{{instagramUrl}}" target="_blank" style="display:flex;align-items:center;gap:16px;border-radius:50px;padding:12px 16px;background:${p.primary}0e;border:1px solid ${p.primary}22;text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:50%;background:${p.primary}1f;color:${p.primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">📸</span>
        <div>
          <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Instagram</p>
          <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.55);">Trabajos recientes</p>
        </div>
      </a>
      {{/instagramUrl}}
      {{#telefono}}
      <a href="tel:{{telefono}}" style="display:flex;align-items:center;gap:16px;border-radius:50px;padding:12px 16px;background:${p.primary}0e;border:1px solid ${p.primary}22;text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:50%;background:${p.primary}1f;color:${p.primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">📞</span>
        <div>
          <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Teléfono</p>
          <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.55);">{{telefono}}</p>
        </div>
      </a>
      {{/telefono}}
      {{#websiteHref}}
      <a href="{{websiteHref}}" target="_blank" style="display:flex;align-items:center;gap:16px;border-radius:50px;padding:12px 16px;background:${p.primary}0e;border:1px solid ${p.primary}22;text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:50%;background:${p.primary}1f;color:${p.primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">↗</span>
        <div>
          <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Website</p>
          <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.55);">{{websiteClean}}</p>
        </div>
      </a>
      {{/websiteHref}}
      {{#googleMapsUrl}}
      <a href="{{googleMapsUrl}}" target="_blank" style="display:flex;align-items:center;gap:16px;border-radius:50px;padding:12px 16px;background:${p.primary}0e;border:1px solid ${p.primary}22;text-decoration:none;">
        <span style="width:40px;height:40px;border-radius:50%;background:${p.primary}1f;color:${p.primary};display:flex;align-items:center;justify-content:center;flex-shrink:0;">📍</span>
        <div>
          <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Cómo llegar</p>
          <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.55);">{{direccion}}</p>
        </div>
      </a>
      {{/googleMapsUrl}}
    </div>

    <!-- Servicios -->
    <div style="border-radius:24px;padding:16px;background:${p.primary}08;border:1px solid ${p.primary}18;">
      <p style="margin:0 0 12px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.35em;color:${p.primary};">Servicios</p>
      {{serviciosHtml}}
    </div>

    <!-- Horario -->
    {{#horario}}
    <div style="border-radius:16px;padding:16px;text-align:center;border-top:1px solid ${p.primary}18;color:rgba(255,255,255,0.72);">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.32em;color:${p.primary};">Horario</p>
      <p style="margin:0;font-size:14px;line-height:1.7;">{{horario}}</p>
    </div>
    {{/horario}}

    <!-- CTA Agendar -->
    {{#whatsappUrl}}
    <a href="{{whatsappUrl}}" target="_blank" style="
      display:flex;align-items:center;justify-content:space-between;
      border-radius:16px;padding:16px 20px;color:#fff;text-decoration:none;
      background:linear-gradient(135deg,${p.primary},${p.secondary});
    ">
      <div>
        <p style="margin:0;font-size:14px;font-weight:600;">Agendar cita</p>
        <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.75);">WhatsApp · respuesta rápida</p>
      </div>
      <span style="font-size:20px;">↗</span>
    </a>
    {{/whatsappUrl}}

    {{#empresa}}
    <p style="text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:rgba(255,255,255,0.35);margin:0;">{{empresa}}</p>
    {{/empresa}}
  </div>
</div>`
}

function getVetTemplateHtml(p: ReturnType<typeof getPalette>): string {
  return `<!-- Plantilla: Veterinaria -->
<!-- Variables: {{nombre}}, {{tituloProfesional}}, {{empresa}}, {{tagline}},
     {{telefono}}, {{email}}, {{fotoUrl}}, {{initials}}, {{whatsappUrl}},
     {{instagramUrl}}, {{googleMapsUrl}}, {{direccion}}, {{horario}}, {{serviciosHtml}} -->

<div style="
  overflow:hidden;border-radius:28px;
  background:linear-gradient(180deg,${p.bg} 0%,${p.secondary} 130%);
  border:1px solid ${p.primary}18;
  font-family:Inter,ui-sans-serif,system-ui,sans-serif;
">
  <!-- Header -->
  <div style="position:relative;padding:32px 24px 24px;background:linear-gradient(160deg,${p.primary}22 0%,transparent 75%);">
    <div style="
      position:relative;display:flex;align-items:center;gap:16px;
      border-radius:24px;padding:16px;
      background:${p.primary}10;border:1px solid ${p.primary}16;
    ">
      <div style="
        width:80px;height:80px;border-radius:24px;overflow:hidden;
        background:#fff;border:3px solid ${p.primary}40;flex-shrink:0;
        display:flex;align-items:center;justify-content:center;
      ">
        {{#fotoUrl}}
        <img src="{{fotoUrl}}" alt="{{nombre}}" style="width:100%;height:100%;object-fit:cover;">
        {{/fotoUrl}}
        {{^fotoUrl}}
        <span style="font-size:24px;font-weight:700;color:${p.primary};">{{initials}}</span>
        {{/fotoUrl}}
      </div>
      <div style="min-width:0;flex:1;overflow:hidden;">
        <h2 style="margin:0;font-size:24px;font-weight:700;color:#fff;word-break:break-word;overflow-wrap:break-word;">{{nombre}}</h2>
        <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:${p.primary};">{{tituloProfesional}}</p>
        {{#tagline}}
        <p style="margin:12px 0 0;font-size:13px;font-style:italic;color:${p.text};">🐾 {{tagline}}</p>
        {{/tagline}}
      </div>
    </div>
  </div>

  <!-- Cuerpo -->
  <div style="padding:24px;display:flex;flex-direction:column;gap:20px;">

    <!-- Acciones de contacto (grid 2 columnas) -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      {{#whatsappUrl}}
      <a href="{{whatsappUrl}}" target="_blank" style="border-radius:16px;padding:16px;background:rgba(255,255,255,.04);border:1px solid ${p.primary}16;text-decoration:none;">
        <div style="width:40px;height:40px;border-radius:16px;background:${p.primary}16;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;">💬</div>
        <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">WhatsApp</p>
        <p style="margin:4px 0 0;font-size:12px;color:${p.text};">Agenda tu cita</p>
      </a>
      {{/whatsappUrl}}
      {{#telefono}}
      <a href="tel:{{telefono}}" style="border-radius:16px;padding:16px;background:rgba(255,255,255,.04);border:1px solid ${p.primary}16;text-decoration:none;">
        <div style="width:40px;height:40px;border-radius:16px;background:${p.primary}16;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;">📞</div>
        <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Teléfono</p>
        <p style="margin:4px 0 0;font-size:12px;color:${p.text};">Urgencias</p>
      </a>
      {{/telefono}}
      {{#instagramUrl}}
      <a href="{{instagramUrl}}" target="_blank" style="border-radius:16px;padding:16px;background:rgba(255,255,255,.04);border:1px solid ${p.primary}16;text-decoration:none;">
        <div style="width:40px;height:40px;border-radius:16px;background:${p.primary}16;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;">📸</div>
        <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Instagram</p>
        <p style="margin:4px 0 0;font-size:12px;color:${p.text};">Nuestros pacientes</p>
      </a>
      {{/instagramUrl}}
      {{#googleMapsUrl}}
      <a href="{{googleMapsUrl}}" target="_blank" style="border-radius:16px;padding:16px;background:rgba(255,255,255,.04);border:1px solid ${p.primary}16;text-decoration:none;">
        <div style="width:40px;height:40px;border-radius:16px;background:${p.primary}16;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;">📍</div>
        <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Cómo llegar</p>
        <p style="margin:4px 0 0;font-size:12px;color:${p.text};">{{direccion}}</p>
      </a>
      {{/googleMapsUrl}}
    </div>

    <!-- Servicios -->
    <div style="border-radius:24px;padding:16px;background:${p.primary}10;border:1px solid ${p.primary}16;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Servicios recomendados</p>
        <span style="border-radius:50px;padding:4px 12px;background:${p.primary}18;color:${p.primary};font-size:12px;font-weight:600;">🐶 🐱</span>
      </div>
      {{serviciosHtml}}
    </div>

    <!-- Horario -->
    {{#horario}}
    <div style="border-radius:24px;padding:16px 20px;background:${p.secondary}88;border:1px solid ${p.primary}18;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="width:32px;height:32px;border-radius:12px;background:${p.primary}16;color:${p.primary};display:flex;align-items:center;justify-content:center;">♥</span>
        <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Horario de atención</p>
      </div>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${p.text};">{{horario}}</p>
    </div>
    {{/horario}}
  </div>
</div>`
}

function getTravelTemplateHtml(p: ReturnType<typeof getPalette>): string {
  return `<!-- Plantilla: Viajes Premium -->
<!-- Variables: {{nombre}}, {{tituloProfesional}}, {{empresa}}, {{tagline}},
     {{telefono}}, {{email}}, {{website}}, {{websiteHref}}, {{websiteClean}},
     {{fotoUrl}}, {{initials}}, {{whatsappUrl}}, {{instagramUrl}},
     {{googleMapsUrl}}, {{horario}}, {{slug}}, {{serviciosHtml}} -->

<div style="
  overflow:hidden;border-radius:28px;
  background:linear-gradient(180deg,${p.bg} 0%,${p.secondary} 130%);
  border:1px solid ${p.primary}16;
  font-family:Inter,ui-sans-serif,system-ui,sans-serif;
">
  <!-- Header hero -->
  <div style="position:relative;overflow:hidden;padding:32px 24px 28px;background:linear-gradient(135deg,${p.secondary} 0%,${p.bg} 55%,${p.primary}18 100%);">
    <div style="position:relative;border-radius:24px;padding:20px;background:rgba(8,17,32,0.6);border:1px solid ${p.primary}1a;backdrop-filter:blur(6px);">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
        <div style="
          width:64px;height:64px;border-radius:16px;overflow:hidden;flex-shrink:0;
          border:2px solid ${p.primary}44;background:${p.primary}10;
          display:flex;align-items:center;justify-content:center;
        ">
          {{#fotoUrl}}
          <img src="{{fotoUrl}}" alt="{{nombre}}" style="width:100%;height:100%;object-fit:cover;">
          {{/fotoUrl}}
          {{^fotoUrl}}
          <span style="font-size:20px;font-weight:700;color:${p.primary};">{{initials}}</span>
          {{/fotoUrl}}
        </div>
        <div style="min-width:0;flex:1;overflow:hidden;">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.35em;color:${p.primary};">Travel concierge</p>
          <h2 style="margin:4px 0 0;font-size:24px;font-weight:700;color:#fff;word-break:break-word;overflow-wrap:break-word;">{{nombre}}</h2>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:${p.text};">{{tituloProfesional}}</p>
        </div>
      </div>
      {{#tagline}}
      <p style="margin:0;font-size:15px;font-weight:600;font-style:italic;color:${p.primary};">"{{tagline}}"</p>
      {{/tagline}}
    </div>
  </div>

  <!-- Cuerpo -->
  <div style="padding:24px;display:flex;flex-direction:column;gap:20px;">

    <!-- CTA principal -->
    {{#whatsappUrl}}
    <a href="{{whatsappUrl}}" target="_blank" style="
      display:flex;align-items:center;justify-content:space-between;
      border-radius:22px;padding:16px 20px;color:#fff;text-decoration:none;
      background:linear-gradient(135deg,${p.primary},${p.secondary});
    ">
      <div>
        <p style="margin:0;font-size:14px;font-weight:600;">Cotiza tu próximo viaje</p>
        <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.75);">Atención personalizada · WhatsApp</p>
      </div>
      <span style="font-size:20px;">✈</span>
    </a>
    {{/whatsappUrl}}

    <!-- Servicios / paquetes -->
    <div style="display:flex;flex-direction:column;gap:12px;">
      {{serviciosHtml}}
    </div>

    <!-- Contacto adicional -->
    <div style="display:flex;flex-direction:column;gap:10px;">
      {{#telefono}}
      <a href="tel:{{telefono}}" style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid ${p.primary}18;text-decoration:none;">
        <span style="font-size:16px;">📞</span>
        <div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Teléfono</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:#fff;">{{telefono}}</p>
        </div>
      </a>
      {{/telefono}}
      {{#email}}
      <a href="mailto:{{email}}" style="display:flex;align-items:center;gap:12px;border-radius:16px;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid ${p.primary}18;text-decoration:none;">
        <span style="font-size:16px;">✉</span>
        <div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Email</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:500;color:#fff;">{{email}}</p>
        </div>
      </a>
      {{/email}}
    </div>

    <!-- Horario -->
    {{#horario}}
    <div style="border-radius:24px;padding:16px 20px;background:${p.primary}10;border:1px solid ${p.primary}18;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#fff;">Horario de atención</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:${p.text};">{{horario}}</p>
    </div>
    {{/horario}}

  </div>
</div>`
}

/**
 * Devuelve el HTML de la plantilla actual (CON placeholders {{variable}})
 * para mostrar en el editor y permitir la personalización.
 */
export function getTemplateHtml(card: Card): string {
  const p = getPalette(card)
  switch (card.diseño || 'clasico') {
    case 'tattoo': return getTattooTemplateHtml(p)
    case 'vet': return getVetTemplateHtml(p)
    case 'travel': return getTravelTemplateHtml(p)
    default: return getClasicaTemplateHtml(p)
  }
}
