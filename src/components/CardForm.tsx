'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/types/card'
import { toSlug, getSocialIcon } from '@/lib/utils'
import { slugExists } from '@/lib/firestore'
import PhotoUpload from '@/components/PhotoUpload'

export type CardFormData = {
  slug: string
  nombre: string
  tituloProfesional: string
  empresa: string
  telefono: string
  email: string
  website: string
  fotoUrl: string
  pin: string
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
}

const socialFields: { key: keyof CardFormData['redesSociales']; label: string; placeholder: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'tu-usuario' },
  { key: 'instagram', label: 'Instagram', placeholder: '@tuusuario' },
  { key: 'twitter', label: 'Twitter / X', placeholder: '@tuusuario' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '5218787020221' },
  { key: 'github', label: 'GitHub', placeholder: 'tu-usuario' },
  { key: 'tiktok', label: 'TikTok', placeholder: '@tuusuario' },
]

export default function CardForm({ initialData, onSubmit, isEditing }: Props) {
  const [formData, setFormData] = useState<CardFormData>({
    slug: initialData?.slug || '',
    nombre: initialData?.nombre || '',
    tituloProfesional: initialData?.tituloProfesional || '',
    empresa: initialData?.empresa || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    fotoUrl: initialData?.fotoUrl || '',
    pin: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      nombre: value,
      slug: isEditing ? prev.slug : toSlug(value),
    }))
  }

  const handleSocialChange = (key: keyof CardFormData['redesSociales'], value: string) => {
    setFormData(prev => ({
      ...prev,
      redesSociales: { ...prev.redesSociales, [key]: value },
    }))
  }

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 2) { setSlugAvailable(null); return }
    setSlugChecking(true)
    try {
      const exists = await slugExists(slug)
      setSlugAvailable(!exists)
    } catch {
      setSlugAvailable(null)
    } finally {
      setSlugChecking(false)
    }
  }, [])

  useEffect(() => {
    if (!isEditing && formData.slug) {
      const timer = setTimeout(() => checkSlug(formData.slug), 600)
      return () => clearTimeout(timer)
    }
  }, [formData.slug, isEditing, checkSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white'
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5'

  const appDomain =
    (process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx')
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '') + '/'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
      {!isEditing && (
        <div>
          <label className={labelClass}>URL de tu tarjeta</label>
          <div className={`flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${
            slugAvailable === false ? 'border-red-400 focus-within:ring-red-400' :
            slugAvailable === true  ? 'border-green-400 focus-within:ring-green-400' :
            'border-slate-200'
          }`}>
            <span className="px-3 py-3 bg-slate-50 text-slate-400 text-sm border-r border-slate-200 whitespace-nowrap select-none flex-shrink-0">
              {appDomain}
            </span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="flex-1 px-3 py-3 text-sm outline-none bg-white min-w-0"
              placeholder="juan-perez"
            />
            <div className="pr-3">
              {slugChecking && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
              {!slugChecking && slugAvailable === true && <span className="text-green-500 text-lg">✓</span>}
              {!slugChecking && slugAvailable === false && <span className="text-red-500 text-lg">✗</span>}
            </div>
          </div>
          {slugAvailable === false && <p className="mt-1.5 text-xs text-red-500">Este slug ya está en uso</p>}
          {slugAvailable === true && <p className="mt-1.5 text-xs text-green-600">¡Disponible!</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre completo *</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleNombreChange} required className={inputClass} placeholder="Juan Pérez" />
        </div>
        <div>
          <label className={labelClass}>Título profesional *</label>
          <input type="text" name="tituloProfesional" value={formData.tituloProfesional} onChange={handleChange} required className={inputClass} placeholder="Diseñador Gráfico" />
        </div>
        <div>
          <label className={labelClass}>Empresa / Negocio</label>
          <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} className={inputClass} placeholder="Mi Empresa SA" />
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
        <label className={labelClass}>Foto de perfil</label>
        <div className="mt-2">
          <PhotoUpload
            slug={formData.slug || 'temp-upload'}
            currentUrl={formData.fotoUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, fotoUrl: url }))}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>PIN de seguridad (4 dígitos) *</label>
        <input
          type="password"
          name="pin"
          value={formData.pin}
          onChange={handleChange}
          maxLength={4}
          pattern="[0-9]{4}"
          inputMode="numeric"
          autoComplete="new-password"
          required
          className={`${inputClass} max-w-[140px] text-center text-xl tracking-[0.5em] font-bold`}
          placeholder="····"
        />
        <p className="mt-1.5 text-xs text-slate-500">Lo necesitarás para editar tu tarjeta</p>
      </div>

      <div>
        <label className={labelClass}>Redes sociales</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialFields.map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xl w-8 text-center">{getSocialIcon(key)}</span>
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-0.5 block">{label}</label>
                <input
                  type="text"
                  value={formData.redesSociales[key]}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || (!isEditing && slugAvailable === false)}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear mi tarjeta →'}
      </button>
    </form>
  )
}
