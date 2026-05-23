'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardCustomColors, CardFont, CardAnimation, CardBackgroundType, CardDesign } from '@/types/card'
import { toSlug } from '@/lib/utils'
import { slugExists } from '@/lib/firestore'
import { getTemplate } from '@/lib/templates/registry'
import PhotoUpload from '@/components/PhotoUpload'
import { getStarterCss, getStarterHtml } from '@/lib/cardStarters'
import { getTemplateHtml } from '@/lib/templateHtml'

export type CardFormData = {
  slug: string
  nombre: string
  tituloProfesional: string
  empresa: string
  telefono: string
  email: string
  website: string
  fotoUrl: string
  logoUrl: string
  headerBanner: string
  pin: string
  diseño: 'clasico' | 'tattoo' | 'vet' | 'travel'
  tagline: string
  customFont: CardFont
  animation: CardAnimation
  backgroundType: CardBackgroundType
  backgroundImage: string
  customGradient: string
  customColors?: CardCustomColors
  customCss: string
  customHtml: string
  servicios: { name: string; price: string }[]
  horario: string
  direccion: string
  googleMapsUrl: string
  redesSociales: {
    linkedin: string
    instagram: string
    twitter: string
    whatsapp: string
    github: string
    tiktok: string
  }
}

type Props = {
  initialData?: Partial<Card>
  onSubmit: (data: CardFormData) => Promise<void>
  isEditing?: boolean
  onPreviewChange?: (data: CardFormData) => void
}

// ─── Profession Presets ────────────────────────────────────────────────────
interface ProfessionPreset {
  label: string
  titulo: string
  tagline: string
  diseño: CardFormData['diseño']
  servicios: { name: string; price: string }[]
}

interface ProfessionCategory {
  id: string
  label: string
  icon: string
  professions: ProfessionPreset[]
}

const PROFESSION_CATEGORIES: ProfessionCategory[] = [
  {
    id: 'salud', label: 'Salud', icon: '🏥',
    professions: [
      { label: 'Médico', titulo: 'Médico General', tagline: 'Atención médica integral para toda la familia', diseño: 'clasico', servicios: [{ name: 'Consulta general', price: '$350' }, { name: 'Revisión preventiva', price: '$450' }, { name: 'Consulta a domicilio', price: '$700' }] },
      { label: 'Dentista', titulo: 'Odontólogo / Dentista', tagline: 'Tu sonrisa perfecta, nuestra especialidad', diseño: 'clasico', servicios: [{ name: 'Limpieza dental', price: '$500' }, { name: 'Extracción simple', price: '$800' }, { name: 'Blanqueamiento', price: '$1,500' }] },
      { label: 'Psicólogo', titulo: 'Psicólogo Clínico', tagline: 'Tu bienestar mental es nuestra prioridad', diseño: 'clasico', servicios: [{ name: 'Consulta individual', price: '$800' }, { name: 'Terapia de pareja', price: '$1,200' }, { name: 'Sesión online', price: '$700' }] },
      { label: 'Nutriólogo', titulo: 'Nutriólogo Certificado', tagline: 'Alimentación inteligente, vida saludable', diseño: 'vet', servicios: [{ name: 'Consulta inicial', price: '$600' }, { name: 'Plan nutricional', price: '$1,000' }, { name: 'Seguimiento mensual', price: '$400' }] },
      { label: 'Fisioterapeuta', titulo: 'Fisioterapeuta', tagline: 'Recupera tu movilidad, mejora tu calidad de vida', diseño: 'clasico', servicios: [{ name: 'Evaluación física', price: '$500' }, { name: 'Sesión de terapia', price: '$400' }, { name: 'Paquete 10 sesiones', price: '$3,500' }] },
    ],
  },
  {
    id: 'belleza', label: 'Belleza & Estilo', icon: '💇',
    professions: [
      { label: 'Estilista', titulo: 'Estilista / Colorista', tagline: 'Transformamos tu look, elevamos tu confianza', diseño: 'tattoo', servicios: [{ name: 'Corte de cabello', price: '$200' }, { name: 'Coloración completa', price: '$800' }, { name: 'Tratamiento capilar', price: '$500' }] },
      { label: 'Tatuador', titulo: 'Artista del Tatuaje', tagline: 'Tu piel es mi lienzo — arte que dura para siempre', diseño: 'tattoo', servicios: [{ name: 'Tatuaje pequeño', price: 'Desde $800' }, { name: 'Tatuaje mediano', price: 'Desde $1,500' }, { name: 'Cover-up / retoque', price: 'Consultar' }] },
      { label: 'Barbero', titulo: 'Barbero Profesional', tagline: 'Estilo y tradición en cada corte', diseño: 'tattoo', servicios: [{ name: 'Corte clásico', price: '$150' }, { name: 'Corte + barba', price: '$220' }, { name: 'Afeitado con navaja', price: '$180' }] },
      { label: 'Maquillista', titulo: 'Maquillista Profesional', tagline: 'Arte y belleza en cada trazo', diseño: 'clasico', servicios: [{ name: 'Maquillaje social', price: '$600' }, { name: 'Maquillaje de novia', price: '$1,500' }, { name: 'Curso básico', price: '$2,000' }] },
      { label: 'Esteticista', titulo: 'Esteticista Certificada', tagline: 'Tu piel merece lo mejor', diseño: 'vet', servicios: [{ name: 'Limpieza facial', price: '$450' }, { name: 'Tratamiento antienvejecimiento', price: '$900' }, { name: 'Depilación', price: '$300' }] },
    ],
  },
  {
    id: 'legal', label: 'Legal & Finanzas', icon: '⚖️',
    professions: [
      { label: 'Abogado', titulo: 'Abogado / Licenciado en Derecho', tagline: 'Defensa legal experta para proteger tus derechos', diseño: 'clasico', servicios: [{ name: 'Consulta legal', price: '$500' }, { name: 'Asesoría familiar', price: '$800' }, { name: 'Representación procesal', price: 'Cotizar' }] },
      { label: 'Contador', titulo: 'Contador Público Certificado', tagline: 'Tus finanzas en orden, tu empresa en crecimiento', diseño: 'clasico', servicios: [{ name: 'Declaración anual', price: '$1,200' }, { name: 'Contabilidad mensual', price: '$2,500/mes' }, { name: 'Registro de empresa', price: '$3,500' }] },
      { label: 'Asesor Financiero', titulo: 'Asesor Financiero Independiente', tagline: 'Tu dinero trabajando inteligentemente para ti', diseño: 'travel', servicios: [{ name: 'Análisis financiero', price: '$800' }, { name: 'Plan de inversión', price: '$1,500' }, { name: 'Asesoría fiscal', price: '$1,000' }] },
    ],
  },
  {
    id: 'tech', label: 'Tecnología', icon: '💻',
    professions: [
      { label: 'Desarrollador', titulo: 'Desarrollador de Software', tagline: 'Soluciones digitales que escalan tu negocio', diseño: 'tattoo', servicios: [{ name: 'Landing page', price: '$5,000' }, { name: 'Aplicación web', price: 'Desde $15,000' }, { name: 'Consultoría técnica', price: '$1,500/hr' }] },
      { label: 'Diseñador UX/UI', titulo: 'Diseñador UX/UI', tagline: 'Experiencias digitales que enamoran a tus usuarios', diseño: 'clasico', servicios: [{ name: 'Diseño de interfaz', price: 'Desde $8,000' }, { name: 'Auditoría UX', price: '$5,000' }, { name: 'Prototipo interactivo', price: '$6,000' }] },
      { label: 'Marketing Digital', titulo: 'Especialista en Marketing Digital', tagline: 'Más visibilidad, más clientes, más ventas', diseño: 'clasico', servicios: [{ name: 'Gestión de redes', price: '$3,000/mes' }, { name: 'Campaña Google Ads', price: '$2,500/mes' }, { name: 'SEO posicionamiento', price: '$2,000/mes' }] },
      { label: 'Fotógrafo', titulo: 'Fotógrafo Profesional', tagline: 'Capturando los momentos que defines para siempre', diseño: 'tattoo', servicios: [{ name: 'Sesión de retrato', price: '$1,500' }, { name: 'Fotografía de boda', price: 'Desde $12,000' }, { name: 'Fotografía corporativa', price: 'Desde $3,000' }] },
    ],
  },
  {
    id: 'gastro', label: 'Gastronomía', icon: '🍽️',
    professions: [
      { label: 'Chef / Restaurante', titulo: 'Chef Ejecutivo', tagline: 'Sabores auténticos, experiencias memorables', diseño: 'clasico', servicios: [{ name: 'Chef a domicilio', price: 'Desde $2,500' }, { name: 'Catering empresarial', price: 'Cotizar' }, { name: 'Clases de cocina', price: '$800/persona' }] },
      { label: 'Panadería / Pastelería', titulo: 'Panadero / Pastelero Artesanal', tagline: 'Hecho con amor, disfrutado con pasión', diseño: 'vet', servicios: [{ name: 'Pastel personalizado', price: 'Desde $600' }, { name: 'Cupcakes docena', price: '$350' }, { name: 'Pan artesanal', price: '$80' }] },
      { label: 'Food Truck', titulo: 'Propietario de Food Truck', tagline: 'Sabor en movimiento — ¡te encontramos donde estás!', diseño: 'tattoo', servicios: [{ name: 'Renta del truck', price: 'Desde $5,000' }, { name: 'Menú principal', price: '$85-$150' }, { name: 'Paquete eventos', price: 'Cotizar' }] },
    ],
  },
  {
    id: 'mascotas', label: 'Mascotas', icon: '🐾',
    professions: [
      { label: 'Veterinario', titulo: 'Médico Veterinario', tagline: 'Porque tu mascota merece la mejor atención', diseño: 'vet', servicios: [{ name: 'Consulta general', price: '$350' }, { name: 'Vacunación completa', price: '$600' }, { name: 'Castración', price: '$1,200' }] },
      { label: 'Groomer', titulo: 'Groomer / Estilista Canino', tagline: 'Tu mascota, siempre hermosa y feliz', diseño: 'vet', servicios: [{ name: 'Baño y corte', price: '$250' }, { name: 'Baño + corte + spa', price: '$450' }, { name: 'Baño y secado', price: '$180' }] },
      { label: 'Entrenador', titulo: 'Entrenador Canino Profesional', tagline: 'Perros felices, familias en paz', diseño: 'vet', servicios: [{ name: 'Sesión de adiestramiento', price: '$400' }, { name: 'Curso básico (8 ses.)', price: '$2,800' }, { name: 'Adiestramiento a domicilio', price: '$600' }] },
    ],
  },
  {
    id: 'viajes', label: 'Viajes & Turismo', icon: '✈️',
    professions: [
      { label: 'Agente de Viajes', titulo: 'Agente de Viajes Certificado', tagline: 'Tu viaje soñado hecho realidad — sin estrés', diseño: 'travel', servicios: [{ name: 'Paquete internacional', price: 'Desde $15,000' }, { name: 'Luna de miel', price: 'Desde $30,000' }, { name: 'Viaje de aventura', price: 'Desde $8,000' }] },
      { label: 'Tour Operador', titulo: 'Tour Operador Local', tagline: 'Conoce lo mejor de nuestra región con guía experto', diseño: 'travel', servicios: [{ name: 'City tour', price: '$350' }, { name: 'Tour aventura', price: '$650' }, { name: 'Tour privado', price: '$1,200' }] },
    ],
  },
  {
    id: 'inmobiliaria', label: 'Inmobiliaria', icon: '🏠',
    professions: [
      { label: 'Agente Inmobiliario', titulo: 'Agente Inmobiliario Certificado', tagline: 'Encuentra la propiedad de tus sueños', diseño: 'travel', servicios: [{ name: 'Compra de propiedad', price: 'Sin costo para compradores' }, { name: 'Venta de propiedad', price: '3% de comisión' }, { name: 'Renta de inmueble', price: 'Medio mes de renta' }] },
      { label: 'Arquitecto', titulo: 'Arquitecto / Diseñador', tagline: 'Espacios que inspiran, estructuras que perduran', diseño: 'clasico', servicios: [{ name: 'Proyecto arquitectónico', price: 'Cotizar' }, { name: 'Remodelación integral', price: 'Cotizar' }, { name: 'Supervisión de obra', price: '$500/visita' }] },
    ],
  },
  {
    id: 'educacion', label: 'Educación', icon: '📚',
    professions: [
      { label: 'Tutor / Maestro', titulo: 'Tutor Académico Privado', tagline: 'Aprender es posible cuando tienes el guía correcto', diseño: 'clasico', servicios: [{ name: 'Clase individual', price: '$250/hr' }, { name: 'Paquete 10 clases', price: '$2,200' }, { name: 'Apoyo en examen', price: '$350' }] },
      { label: 'Coach', titulo: 'Coach de Vida y Negocios', tagline: 'Desbloquea tu potencial, alcanza tus metas', diseño: 'clasico', servicios: [{ name: 'Sesión de coaching', price: '$800' }, { name: 'Programa 3 meses', price: '$6,500' }, { name: 'Taller grupal', price: '$400/persona' }] },
    ],
  },
  {
    id: 'servicios', label: 'Servicios del Hogar', icon: '🔧',
    professions: [
      { label: 'Plomero', titulo: 'Plomero / Gasfitero Profesional', tagline: 'Soluciones rápidas y confiables para tu hogar', diseño: 'clasico', servicios: [{ name: 'Servicio urgente', price: '$400' }, { name: 'Instalación de regadera', price: '$600' }, { name: 'Destape de drenaje', price: '$350' }] },
      { label: 'Electricista', titulo: 'Electricista Certificado', tagline: 'Instalaciones seguras, trabajo garantizado', diseño: 'clasico', servicios: [{ name: 'Revisión eléctrica', price: '$350' }, { name: 'Instalación de contactos', price: '$200' }, { name: 'Tablero eléctrico', price: 'Cotizar' }] },
      { label: 'Mecánico', titulo: 'Mecánico Automotriz', tagline: 'Tu auto en las mejores manos — reparamos con honestidad', diseño: 'tattoo', servicios: [{ name: 'Afinación mayor', price: 'Desde $800' }, { name: 'Cambio de aceite', price: '$350' }, { name: 'Revisión de frenos', price: '$500' }] },
    ],
  },
]

// ─── Social Icons ──────────────────────────────────────────────────────────
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  instagram: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
  twitter: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  whatsapp: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
  github: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
  tiktok: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>,
}

const socialFields: { key: keyof CardFormData['redesSociales']; label: string; placeholder: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'tu-usuario' },
  { key: 'instagram', label: 'Instagram', placeholder: '@tuusuario' },
  { key: 'twitter', label: 'Twitter / X', placeholder: '@tuusuario' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '5218787020221' },
  { key: 'github', label: 'GitHub', placeholder: 'tu-usuario' },
  { key: 'tiktok', label: 'TikTok', placeholder: '@tuusuario' },
]

const fontOptions: { value: CardFont; label: string; description: string; fontFamily: string }[] = [
  { value: 'inter', label: 'Inter', description: 'Predeterminada y profesional', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { value: 'playfair', label: 'Playfair Display', description: 'Elegante y editorial', fontFamily: '"Playfair Display", Georgia, serif' },
  { value: 'mono', label: 'JetBrains Mono', description: 'Técnica y moderna', fontFamily: '"JetBrains Mono", monospace' },
  { value: 'montserrat', label: 'Montserrat', description: 'Moderna y versátil', fontFamily: 'Montserrat, sans-serif' },
  { value: 'poppins', label: 'Poppins', description: 'Redondeada y amigable', fontFamily: 'Poppins, sans-serif' },
  { value: 'raleway', label: 'Raleway', description: 'Premium y creativa', fontFamily: 'Raleway, sans-serif' },
  { value: 'oswald', label: 'Oswald', description: 'Bold y condensada', fontFamily: 'Oswald, sans-serif' },
]

const animationOptions: { value: CardAnimation; label: string; icon: string }[] = [
  { value: 'none', label: 'Sin animación', icon: '—' },
  { value: 'fade', label: 'Fade in', icon: '✨' },
  { value: 'slide-up', label: 'Slide up', icon: '↑' },
  { value: 'zoom', label: 'Zoom in', icon: '🔍' },
  { value: 'bounce', label: 'Bounce', icon: '⬆' },
  { value: 'glow', label: 'Glow', icon: '💡' },
  { value: 'float', label: 'Float', icon: '🌊' },
]

const colorFieldLabels: { key: keyof CardCustomColors; label: string }[] = [
  { key: 'primary', label: 'Color principal' },
  { key: 'secondary', label: 'Color secundario' },
  { key: 'accent', label: 'Acento' },
  { key: 'bg', label: 'Fondo' },
  { key: 'text', label: 'Texto' },
]

const fallbackColors: CardCustomColors = {
  primary: '#6366f1', secondary: '#4f46e5',
  accent: 'rgba(99,102,241,.15)', bg: '#0f172a', text: '#c7d2fe',
}

const DESIGN_OPTIONS: { value: CardFormData['diseño']; name: string; desc: string; colors: string[] }[] = [
  { value: 'clasico', name: 'Clásico', desc: 'Profesional y minimalista', colors: ['#6366f1', '#4f46e5', '#0f172a'] },
  { value: 'tattoo', name: 'Tattoo Studio', desc: 'Neón oscuro, estilo urbano', colors: ['#00ff88', '#0a0a0f', '#001a0d'] },
  { value: 'vet', name: 'Veterinaria', desc: 'Teal cálido y amigable', colors: ['#2dd4bf', '#14b8a6', '#0f2b2a'] },
  { value: 'travel', name: 'Viajes Premium', desc: 'Azul marino con dorado', colors: ['#f59e0b', '#d97706', '#0c1222'] },
]

function getColorPickerValue(value: string, fallback: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const n = value.slice(1)
    return `#${n[0]}${n[0]}${n[1]}${n[1]}${n[2]}${n[2]}`
  }
  const m = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (m) {
    const [, r, g, b] = m
    return `#${[r, g, b].map(p => Number(p).toString(16).padStart(2, '0')).join('')}`
  }
  return fallback
}

// ─── Section component ─────────────────────────────────────────────────────
function Section({ title, icon, defaultOpen = false, children }: { title: string; icon: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>
        <svg className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="p-5 space-y-4 bg-white">{children}</div>}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function CardForm({ initialData, onSubmit, isEditing, onPreviewChange }: Props) {
  const [formData, setFormData] = useState<CardFormData>({
    slug: initialData?.slug || '',
    nombre: initialData?.nombre || '',
    tituloProfesional: initialData?.tituloProfesional || '',
    empresa: initialData?.empresa || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    fotoUrl: initialData?.fotoUrl || '',
    logoUrl: initialData?.logoUrl || '',
    headerBanner: initialData?.headerBanner || '',
    pin: '',
    diseño: (initialData as typeof initialData & { diseño?: CardFormData['diseño'] })?.diseño || 'clasico',
    tagline: initialData?.tagline || '',
    customFont: initialData?.customFont || 'inter',
    animation: initialData?.animation || 'none',
    backgroundType: initialData?.backgroundType || 'solid',
    backgroundImage: initialData?.backgroundImage || '',
    customGradient: initialData?.customGradient || '',
    customColors: initialData?.customColors ? { ...initialData.customColors } : undefined,
    customCss: initialData?.customCss || (initialData?.slug ? '' : getStarterCss(initialData ?? {})),
    customHtml: initialData?.customHtml || (initialData?.slug ? '' : getStarterHtml(initialData ?? {})),
    servicios: (initialData as typeof initialData & { servicios?: CardFormData['servicios'] })?.servicios || [],
    horario: (initialData as typeof initialData & { horario?: string })?.horario || '',
    direccion: (initialData as typeof initialData & { direccion?: string })?.direccion || '',
    googleMapsUrl: (initialData as typeof initialData & { googleMapsUrl?: string })?.googleMapsUrl || '',
    redesSociales: {
      linkedin: initialData?.redesSociales?.linkedin || '',
      instagram: initialData?.redesSociales?.instagram || '',
      twitter: initialData?.redesSociales?.twitter || '',
      whatsapp: initialData?.redesSociales?.whatsapp || '',
      github: initialData?.redesSociales?.github || '',
      tiktok: initialData?.redesSociales?.tiktok || '',
    },
  })

  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [useCustomColors, setUseCustomColors] = useState(Boolean(initialData?.customColors))
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [presetApplied, setPresetApplied] = useState(false)

  const templateColors = useMemo<CardCustomColors>(
    () => getTemplate(formData.diseño)?.colors || fallbackColors,
    [formData.diseño],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, nombre: value, slug: isEditing ? prev.slug : toSlug(value) }))
  }

  const handleDesignChange = (value: CardFormData['diseño']) => {
    setFormData(prev => ({
      ...prev,
      diseño: value,
      customColors: useCustomColors ? prev.customColors || { ...(getTemplate(value)?.colors || fallbackColors) } : undefined,
    }))
  }

  const handleSocialChange = (key: keyof CardFormData['redesSociales'], value: string) => {
    setFormData(prev => ({ ...prev, redesSociales: { ...prev.redesSociales, [key]: value } }))
  }

  const applyPreset = (preset: ProfessionPreset) => {
    setFormData(prev => ({
      ...prev,
      tituloProfesional: preset.titulo,
      tagline: preset.tagline,
      diseño: preset.diseño,
      servicios: preset.servicios.length > 0 ? preset.servicios : prev.servicios,
    }))
    setPresetApplied(true)
    setActiveCategory(null)
    setTimeout(() => setPresetApplied(false), 2000)
  }

  const handleLoadTemplateHtml = () => {
    const card = {
      id: 'preview', slug: formData.slug || 'preview', pinHash: '',
      nombre: formData.nombre || 'Tu nombre', tituloProfesional: formData.tituloProfesional || '',
      empresa: formData.empresa, telefono: formData.telefono, email: formData.email,
      website: formData.website, fotoUrl: formData.fotoUrl, diseño: formData.diseño as CardDesign,
      tagline: formData.tagline, customFont: formData.customFont, customColors: formData.customColors,
      servicios: formData.servicios.filter(s => s.name || s.price),
      horario: formData.horario, direccion: formData.direccion, googleMapsUrl: formData.googleMapsUrl,
      redesSociales: formData.redesSociales,
      views: 0, clicks: 0, whatsappClicks: 0, instagramClicks: 0, phoneClicks: 0,
      createdAt: new Date(), updatedAt: new Date(),
    }
    setFormData(prev => ({ ...prev, customHtml: getTemplateHtml(card) }))
  }

  const handleServiceChange = (index: number, field: 'name' | 'price', value: string) => {
    setFormData(prev => {
      const servicios = [...prev.servicios]
      servicios[index] = { ...servicios[index], [field]: value }
      return { ...prev, servicios }
    })
  }

  const handleColorChange = (key: keyof CardCustomColors, value: string) => {
    setFormData(prev => ({ ...prev, customColors: { ...(prev.customColors || templateColors), [key]: value } }))
  }

  const toggleCustomColors = (enabled: boolean) => {
    setUseCustomColors(enabled)
    setFormData(prev => ({ ...prev, customColors: enabled ? { ...(prev.customColors || templateColors) } : undefined }))
  }

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 2) { setSlugAvailable(null); return }
    setSlugChecking(true)
    try {
      const exists = await slugExists(slug)
      setSlugAvailable(!exists)
    } catch { setSlugAvailable(null) }
    finally { setSlugChecking(false) }
  }, [])

  useEffect(() => {
    if (!isEditing && formData.slug) {
      const timer = setTimeout(() => checkSlug(formData.slug), 600)
      return () => clearTimeout(timer)
    }
  }, [formData.slug, isEditing, checkSlug])

  useEffect(() => { onPreviewChange?.(formData) }, [formData, onPreviewChange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload: CardFormData = {
      ...formData,
      tagline: formData.tagline.trim().slice(0, 120),
      customColors: useCustomColors ? formData.customColors || { ...templateColors } : undefined,
      servicios: formData.servicios.map(s => ({ name: s.name.trim(), price: s.price.trim() })).filter(s => s.name || s.price),
      customCss: formData.customCss.trim(),
      customHtml: formData.customHtml.trim(),
      logoUrl: formData.logoUrl.trim(),
      headerBanner: formData.headerBanner.trim(),
    }
    try { await onSubmit(payload) } finally { setLoading(false) }
  }

  const inputClass = 'w-full px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white text-slate-900 placeholder:text-slate-400 transition'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'
  const appDomain = (process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx').replace(/^https?:\/\//, '').replace(/\/$/, '') + '/'
  const activeCategoryData = PROFESSION_CATEGORIES.find(c => c.id === activeCategory)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">

      {/* ── Preset de profesión ───────────────────────────────────────────── */}
      {!isEditing && !presetApplied && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-900">🚀 ¿Cuál es tu profesión?</p>
              <p className="text-xs text-indigo-600 mt-0.5">Selecciona para pre-cargar título, descripción y servicios</p>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {PROFESSION_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(prev => prev === cat.id ? null : cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-white border border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'}`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Profession buttons for selected category */}
          {activeCategoryData && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-indigo-100">
              {activeCategoryData.professions.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-xl border border-indigo-300 bg-white px-3 py-2 text-xs font-medium text-indigo-800 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition shadow-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {presetApplied && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2 text-sm text-emerald-700">
          <span>✅</span> Preset aplicado — revisa y personaliza los campos
        </div>
      )}

      {/* ── Sección: URL ──────────────────────────────────────────────────── */}
      {!isEditing && (
        <Section title="URL de tu tarjeta" icon="🔗" defaultOpen>
          <div>
            <label className={labelClass}>Dirección web</label>
            <div className={`flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${slugAvailable === false ? 'border-red-400' : slugAvailable === true ? 'border-emerald-400' : 'border-slate-200'}`}>
              <span className="px-3 py-3 bg-slate-50 text-slate-400 text-sm border-r border-slate-200 whitespace-nowrap select-none flex-shrink-0">{appDomain}</span>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="flex-1 px-3 py-3 text-sm outline-none bg-white min-w-0 text-slate-900 placeholder:text-slate-400" placeholder="juan-perez" />
              <div className="pr-3">
                {slugChecking && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
                {!slugChecking && slugAvailable === true && <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                {!slugChecking && slugAvailable === false && <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
              </div>
            </div>
            {slugAvailable === false && <p className="mt-1.5 text-xs text-red-500">Este slug ya está en uso</p>}
            {slugAvailable === true && <p className="mt-1.5 text-xs text-emerald-600">¡Disponible!</p>}
          </div>

          <div>
            <label className={labelClass}>PIN de seguridad (4 dígitos) *</label>
            <input type="password" name="pin" value={formData.pin} onChange={handleChange} maxLength={4} pattern="[0-9]{4}" inputMode="numeric" autoComplete="new-password" required className={`${inputClass} max-w-[140px] text-center text-xl tracking-[0.5em] font-bold`} placeholder="····" />
            <p className="mt-1.5 text-xs text-slate-500">Lo necesitarás para editar tu tarjeta</p>
          </div>
        </Section>
      )}

      {/* ── Sección: Identidad ───────────────────────────────────────────── */}
      <Section title="Identidad y contacto" icon="👤" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre completo *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleNombreChange} required className={inputClass} placeholder="Juan Pérez" />
          </div>
          <div>
            <label className={labelClass}>Título profesional *</label>
            <input type="text" name="tituloProfesional" value={formData.tituloProfesional} onChange={handleChange} required className={inputClass} placeholder="Médico General · Chef · Abogado" />
          </div>
          <div>
            <label className={labelClass}>Empresa / Negocio</label>
            <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} className={inputClass} placeholder="Mi Empresa S.A. · Clínica Central" />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className={inputClass} placeholder="+52 878 702 0221" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="juan@empresa.com" />
          </div>
          <div>
            <label className={labelClass}>Sitio web</label>
            <input type="text" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="www.misitioweb.com" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>Tagline / Bio</label>
            <span className="text-xs text-slate-500">{formData.tagline.length}/120</span>
          </div>
          <textarea name="tagline" value={formData.tagline} onChange={handleChange} maxLength={120} rows={2} className={`${inputClass} resize-none`} placeholder="Frase corta que describe tu servicio o lema de tu negocio" />
        </div>
      </Section>

      {/* ── Sección: Medios ──────────────────────────────────────────────── */}
      <Section title="Foto, logo y banner" icon="🖼️">
        <div>
          <label className={labelClass}>Foto de perfil</label>
          <PhotoUpload slug={formData.slug || 'temp-upload'} currentUrl={formData.fotoUrl} onChange={url => setFormData(prev => ({ ...prev, fotoUrl: url }))} disabled={loading} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Logo (URL)</label>
            <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className={inputClass} placeholder="https://mi-empresa.com/logo.png" />
            <p className="mt-1 text-xs text-slate-500">Aparece sobre la foto de perfil</p>
          </div>
          <div>
            <label className={labelClass}>Banner de encabezado (URL)</label>
            <input type="url" name="headerBanner" value={formData.headerBanner} onChange={handleChange} className={inputClass} placeholder="https://mi-empresa.com/banner.jpg" />
            <p className="mt-1 text-xs text-slate-500">Imagen en la parte superior de la tarjeta</p>
          </div>
        </div>
      </Section>

      {/* ── Sección: Diseño ──────────────────────────────────────────────── */}
      <Section title="Diseño y personalización" icon="🎨" defaultOpen>
        {/* Visual design picker */}
        <div>
          <label className={labelClass}>Plantilla de diseño</label>
          <div className="grid grid-cols-2 gap-3">
            {DESIGN_OPTIONS.map(d => {
              const active = formData.diseño === d.value
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => handleDesignChange(d.value)}
                  className={`relative rounded-2xl border-2 p-3 text-left transition ${active ? 'border-indigo-500 bg-indigo-50 shadow-[0_8px_24px_rgba(99,102,241,0.18)]' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                >
                  {active && (
                    <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                  {/* Color swatch */}
                  <div className="mb-2 flex gap-1 h-6 rounded-lg overflow-hidden">
                    {d.colors.map((c, i) => <div key={i} className="flex-1" style={{ background: c }} />)}
                  </div>
                  <p className={`text-xs font-semibold ${active ? 'text-indigo-700' : 'text-slate-800'}`}>{d.name}</p>
                  <p className={`text-[10px] mt-0.5 ${active ? 'text-indigo-500' : 'text-slate-500'}`}>{d.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Font picker */}
        <div>
          <label className={labelClass}>Fuente principal</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {fontOptions.map(option => {
              const active = formData.customFont === option.value
              return (
                <button key={option.value} type="button" onClick={() => setFormData(prev => ({ ...prev, customFont: option.value }))}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                >
                  <div style={{ fontFamily: option.fontFamily }} className={`text-base ${active ? 'text-indigo-700' : 'text-slate-800'}`}>{option.label}</div>
                  <p className={`mt-0.5 text-xs ${active ? 'text-indigo-600' : 'text-slate-500'}`}>{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom colors toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Personalizar colores</p>
              <p className="text-xs text-slate-500">Override de la paleta del template</p>
            </div>
            <button type="button" onClick={() => toggleCustomColors(!useCustomColors)} className={`relative h-7 w-12 rounded-full transition ${useCustomColors ? 'bg-indigo-600' : 'bg-slate-300'}`} aria-pressed={useCustomColors}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${useCustomColors ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {useCustomColors && (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">Paleta de {getTemplate(formData.diseño)?.name || 'template'}</p>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, customColors: { ...templateColors } }))} className="text-xs text-indigo-600 hover:text-indigo-500">Restablecer</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {colorFieldLabels.map(({ key, label }) => (
                  <label key={key} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <span className="mb-2 block text-xs font-medium text-slate-700">{label}</span>
                    <div className="flex items-center gap-2">
                      <input type="color" value={getColorPickerValue(formData.customColors?.[key] || templateColors[key], key === 'accent' ? templateColors.primary : templateColors[key])} onChange={e => handleColorChange(key, e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
                      <input type="text" value={formData.customColors?.[key] || templateColors[key]} onChange={e => handleColorChange(key, e.target.value)} className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-indigo-400" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Animation picker */}
        <div>
          <label className={labelClass}>✨ Animación de entrada</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {animationOptions.map(anim => {
              const active = formData.animation === anim.value
              return (
                <button key={anim.value} type="button" onClick={() => setFormData(prev => ({ ...prev, animation: anim.value }))}
                  className={`rounded-xl border px-3 py-3 text-center text-xs font-medium transition ${active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}
                >
                  <div className="text-base mb-1">{anim.icon}</div>
                  {anim.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Background */}
        <div>
          <label className={labelClass}>🖼 Fondo de tarjeta</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(['solid', 'gradient', 'image'] as CardBackgroundType[]).map(type => {
              const active = formData.backgroundType === type
              const labels = { solid: 'Color sólido', gradient: 'Gradiente', image: 'Imagen' }
              const icons = { solid: '🎨', gradient: '🌈', image: '🖼' }
              return (
                <button key={type} type="button" onClick={() => setFormData(prev => ({ ...prev, backgroundType: type }))}
                  className={`rounded-xl border px-3 py-3 text-center text-xs font-medium transition ${active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}
                >
                  <div className="text-base mb-1">{icons[type]}</div>
                  {labels[type]}
                </button>
              )
            })}
          </div>
          {formData.backgroundType === 'image' && (
            <input type="url" name="backgroundImage" value={formData.backgroundImage} onChange={handleChange} className={inputClass} placeholder="https://images.unsplash.com/photo-..." />
          )}
          {formData.backgroundType === 'gradient' && (
            <input type="text" name="customGradient" value={formData.customGradient} onChange={handleChange} className={`${inputClass} font-mono text-xs`} placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
          )}
        </div>
      </Section>

      {/* ── Sección: Servicios & Ubicación ───────────────────────────────── */}
      <Section title="Servicios, horario y ubicación" icon="📍">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Servicios / Precios</label>
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, servicios: [...prev.servicios, { name: '', price: '' }] }))} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Agregar servicio
            </button>
          </div>
          {formData.servicios.length === 0 && (
            <p className="text-xs text-slate-400 py-2">Sin servicios aún — haz clic en &ldquo;Agregar servicio&rdquo; o selecciona un preset de profesión</p>
          )}
          <div className="space-y-2">
            {formData.servicios.map((svc, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={svc.name} onChange={e => handleServiceChange(i, 'name', e.target.value)} placeholder="Nombre del servicio" className={`${inputClass} flex-1`} />
                <input type="text" value={svc.price} onChange={e => handleServiceChange(i, 'price', e.target.value)} placeholder="$0" className={`${inputClass} w-28`} />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, servicios: prev.servicios.filter((_, idx) => idx !== i) }))} className="flex-shrink-0 rounded-lg p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition" aria-label="Eliminar servicio">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Horario de atención</label>
          <textarea name="horario" value={formData.horario} onChange={handleChange} className={`${inputClass} resize-none`} placeholder={'Lunes a Viernes · 9:00 AM - 6:00 PM\nSábado · 10:00 AM - 2:00 PM'} rows={2} />
        </div>

        <div>
          <label className={labelClass}>Dirección física</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className={inputClass} placeholder="Calle Hidalgo 123, Col. Centro, Ciudad" />
        </div>

        <div>
          <label className={labelClass}>Link de Google Maps</label>
          <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} className={inputClass} placeholder="https://maps.google.com/..." />
          {formData.googleMapsUrl && (
            <a href={formData.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-500 hover:underline">Verificar enlace ↗</a>
          )}
        </div>
      </Section>

      {/* ── Sección: Redes sociales ───────────────────────────────────────── */}
      <Section title="Redes sociales" icon="🔗">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialFields.map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-8 flex items-center justify-center flex-shrink-0 text-slate-400">{SOCIAL_ICONS[key]}</span>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-0.5 block">{label}</label>
                <input type="text" value={formData.redesSociales[key]} onChange={e => handleSocialChange(key, e.target.value)} placeholder={placeholder} className={inputClass} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Sección: Avanzado (CSS/HTML) ─────────────────────────────────── */}
      <Section title="Personalización avanzada (CSS / HTML)" icon="⚙️">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          💡 <strong>Pro tip:</strong> Haz clic en &ldquo;Cargar plantilla HTML&rdquo; para editar el diseño completo con variables dinámicas. Solo usa HTML de confianza.
        </div>

        <div>
          <label className={labelClass}>🎨 CSS personalizado</label>
          <textarea name="customCss" value={formData.customCss} onChange={handleChange} rows={5} className={`${inputClass} resize-y font-mono text-xs leading-relaxed`} placeholder={`.card-mi-nombre {\n  border: 2px solid gold;\n}\n\n.card-mi-nombre h2 {\n  letter-spacing: 0.1em;\n}`} spellCheck={false} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>📄 HTML personalizado</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleLoadTemplateHtml} className="flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition">
                📋 Cargar plantilla HTML
              </button>
              {formData.customHtml && (
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, customHtml: '' }))} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                  🗑 Limpiar
                </button>
              )}
            </div>
          </div>

          <details className="mb-2 rounded-xl border border-indigo-100 bg-indigo-50/60">
            <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-indigo-700 select-none">📚 Variables disponibles (clic para ver)</summary>
            <div className="px-3 pb-3 pt-1">
              <p className="text-xs text-slate-600 mb-2">Usa <code className="bg-white border border-slate-200 rounded px-1 font-mono">{'{{variable}}'}</code>. Condicionales: <code className="bg-white border border-slate-200 rounded px-1 font-mono">{'{{#campo}}...{{/campo}}'}</code></p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                {[
                  ['{{nombre}}', 'Nombre completo'], ['{{tituloProfesional}}', 'Título / puesto'],
                  ['{{empresa}}', 'Empresa'], ['{{tagline}}', 'Lema / bio'],
                  ['{{telefono}}', 'Teléfono'], ['{{email}}', 'Correo'],
                  ['{{website}}', 'Web (visible)'], ['{{websiteHref}}', 'Web (URL)'],
                  ['{{fotoUrl}}', 'Foto perfil'], ['{{initials}}', 'Iniciales'],
                  ['{{direccion}}', 'Dirección'], ['{{horario}}', 'Horario'],
                  ['{{whatsappUrl}}', 'WhatsApp'], ['{{linkedinUrl}}', 'LinkedIn'],
                  ['{{instagramUrl}}', 'Instagram'], ['{{twitterUrl}}', 'Twitter/X'],
                  ['{{githubUrl}}', 'GitHub'], ['{{tiktokUrl}}', 'TikTok'],
                  ['{{serviciosHtml}}', 'Bloque servicios'],
                ].map(([v, d]) => (
                  <div key={v} className="flex items-baseline gap-1.5 py-0.5">
                    <code className="shrink-0 font-mono bg-white border border-slate-200 rounded px-1 text-indigo-700 text-[10px]">{v}</code>
                    <span className="text-slate-500 truncate text-[10px]">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </details>

          <textarea name="customHtml" value={formData.customHtml} onChange={handleChange} rows={12} className={`${inputClass} resize-y font-mono text-xs leading-relaxed`} placeholder={'<!-- Clic en "Cargar plantilla HTML" para editar el diseño -->'} spellCheck={false} />
        </div>
      </Section>

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading || (!isEditing && slugAvailable === false)}
        className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-sm"
      >
        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {loading ? 'Guardando...' : isEditing ? '💾 Guardar cambios' : '🚀 Crear tarjeta'}
        {!loading && !isEditing && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </button>
    </form>
  )
}
