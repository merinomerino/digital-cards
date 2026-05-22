import type { Card, CardCustomColors } from '@/types/card'
import { getTemplate } from '@/lib/templates/registry'

const FALLBACK_PALETTE: CardCustomColors = {
  primary: '#6366f1',
  secondary: '#4f46e5',
  accent: 'rgba(99,102,241,.15)',
  bg: '#0f172a',
  text: '#c7d2fe',
}

function getPalette(card: Partial<Card>): CardCustomColors {
  const templateColors = getTemplate((card.diseño as string) || 'clasico')?.colors || FALLBACK_PALETTE
  return { ...templateColors, ...(card.customColors || {}) }
}

function toSlugClass(slug: string): string {
  return `card-${slug.replace(/[^a-z0-9]/g, '-')}`
}

export function getStarterCss(card: Partial<Card>): string {
  const palette = getPalette(card)
  const slug = card.slug || 'mi-tarjeta'
  const sc = toSlugClass(slug)
  const diseño = card.diseño || 'clasico'

  return `/* ================================================
   Personalización: /${slug}  |  diseño: ${diseño}
   Selector raíz: .${sc}
   Usa !important para sobrescribir estilos de Tailwind
   ================================================ */

/* Variables de paleta actual */
.${sc} {
  --c-primary:   ${palette.primary};
  --c-secondary: ${palette.secondary};
  --c-bg:        ${palette.bg};
  --c-text:      ${palette.text};
  --c-accent:    ${palette.accent};
}

/* Contenedor principal */
/* .${sc} > div {
  border-radius: 32px !important;
  box-shadow: 0 30px 80px ${palette.primary}44 !important;
} */

/* Nombre */
/* .${sc} h1,
.${sc} h2 {
  font-size: 2rem !important;
  letter-spacing: 0.06em !important;
  text-shadow: 0 0 24px ${palette.primary}88;
} */

/* Foto / avatar */
/* .${sc} img {
  border-radius: 50% !important;
  border: 3px solid ${palette.primary} !important;
  box-shadow: 0 0 20px ${palette.primary}66 !important;
} */

/* Links de contacto (teléfono, email, website, maps) */
/* .${sc} a {
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.${sc} a:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px ${palette.primary}33 !important;
} */

/* Botón CTA principal (agendar / cotizar) */
/* .${sc} a[style*="gradient"] {
  background: linear-gradient(135deg, #f59e0b, #ef4444) !important;
} */

/* Redes sociales */
/* .${sc} svg {
  width: 22px !important;
  height: 22px !important;
} */

/* Tus reglas personalizadas aquí ↓ */
`
}

export function getStarterHtml(card: Partial<Card>): string {
  const slug = card.slug || 'mi-tarjeta'
  const nombre = card.nombre || 'Tu nombre'
  const palette = getPalette(card)

  return `<!-- ==========================================
   Bloque personalizado para: ${nombre}
   Se muestra AL FINAL de la tarjeta /${slug}
   ========================================== -->

<!-- Ejemplo 1: Botón extra (descomenta para usar) -->
<!--
<div style="margin-top:20px; text-align:center;">
  <a href="https://tuenlace.com"
     target="_blank"
     style="display:inline-block;
            background:linear-gradient(135deg, ${palette.primary}, ${palette.secondary});
            color:#fff; padding:14px 32px; border-radius:999px;
            font-weight:700; text-decoration:none; font-size:15px;
            letter-spacing:0.04em;
            box-shadow:0 8px 24px ${palette.primary}55;">
    ✨ Ver portafolio
  </a>
</div>
-->

<!-- Ejemplo 2: Badge de verificación (descomenta para usar) -->
<!--
<div style="margin-top:14px; display:flex; justify-content:center;">
  <span style="background:rgba(16,185,129,0.15); color:#10b981;
               border:1px solid rgba(16,185,129,0.3); border-radius:999px;
               padding:6px 18px; font-size:12px; font-weight:600;
               letter-spacing:0.08em; text-transform:uppercase;">
    ✔ Certificado profesional
  </span>
</div>
-->

<!-- Tu HTML personalizado aquí ↓ -->
`
}
