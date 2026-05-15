export interface Template {
  id: string
  name: string
  description: string
  preview: string
  variant: 'clasico' | 'tattoo' | 'vet' | 'travel'
  premium: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    bg: string
    text: string
  }
}

export const TEMPLATES: Template[] = [
  {
    id: 'clasico',
    name: 'Clásico CardLink',
    description: 'Diseño profesional y minimalista, ideal para cualquier negocio',
    preview: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=200&auto=format&fit=crop',
    variant: 'clasico',
    premium: false,
    colors: { primary: '#6366f1', secondary: '#4f46e5', accent: 'rgba(99,102,241,.15)', bg: '#0f172a', text: '#c7d2fe' },
  },
  {
    id: 'tattoo',
    name: 'Tattoo Studio',
    description: 'Estilo urbano con neón verde sobre fondo oscuro. Perfecto para estudios de tatuaje, barberías y marcas audaces',
    preview: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=200&auto=format&fit=crop',
    variant: 'tattoo',
    premium: false,
    colors: { primary: '#00ff88', secondary: '#00cc6a', accent: 'rgba(0,255,136,.18)', bg: '#0a0a0f', text: '#00ff88' },
  },
  {
    id: 'vet',
    name: 'Veterinaria',
    description: 'Diseño cálido y amigable con tonos teal y coral. Ideal para clínicas veterinarias, pet shops y servicios de cuidado animal',
    preview: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=200&auto=format&fit=crop',
    variant: 'vet',
    premium: false,
    colors: { primary: '#2dd4bf', secondary: '#14b8a6', accent: 'rgba(45,212,191,.15)', bg: '#0f2b2a', text: '#2dd4bf' },
  },
  {
    id: 'travel',
    name: 'Viajes Premium',
    description: 'Estilo elegante azul marino con acentos dorados. Perfecto para agencias de viajes, hoteles y servicios turísticos',
    preview: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=200&auto=format&fit=crop',
    variant: 'travel',
    premium: false,
    colors: { primary: '#f59e0b', secondary: '#d97706', accent: 'rgba(245,158,11,.15)', bg: '#0c1222', text: '#f59e0b' },
  },
  {
    id: 'glass-premium',
    name: 'Glass Premium',
    description: 'Efecto vidrio con blur y bordes luminosos. Diseño premium exclusivo',
    preview: '',
    variant: 'clasico',
    premium: true,
    colors: { primary: '#e879f9', secondary: '#c084fc', accent: 'rgba(232,121,249,.15)', bg: '#1a0028', text: '#e9d5ff' },
  },
  {
    id: 'neon-tech',
    name: 'Neon Tech',
    description: 'Estilo cyberpunk con neón azul y rosa. Para startups y marcas tecnológicas',
    preview: '',
    variant: 'tattoo',
    premium: true,
    colors: { primary: '#06b6d4', secondary: '#ec4899', accent: 'rgba(6,182,212,.15)', bg: '#001524', text: '#67e8f9' },
  },
]

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id)
}

export function getFreeTemplates(): Template[] {
  return TEMPLATES.filter(t => !t.premium)
}

export function getPremiumTemplates(): Template[] {
  return TEMPLATES.filter(t => t.premium)
}
