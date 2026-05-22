'use client'

import { useState, useCallback } from 'react'
import CardForm, { CardFormData } from '@/components/CardForm'
import DesignCardPreview from '@/components/DesignCardPreview'
import { Card } from '@/types/card'

interface Props {
  initialData?: Partial<Card>
  onSubmit: (data: CardFormData) => Promise<void>
  isEditing?: boolean
}

function formDataToCard(data: CardFormData): Card {
  return {
    id: 'preview',
    slug: data.slug || 'preview',
    pinHash: '',
    nombre: data.nombre || 'Tu nombre completo',
    tituloProfesional: data.tituloProfesional || 'Tu profesión',
    empresa: data.empresa,
    telefono: data.telefono,
    email: data.email,
    website: data.website,
    fotoUrl: data.fotoUrl,
    logoUrl: data.logoUrl || undefined,
    headerBanner: data.headerBanner || undefined,
    diseño: data.diseño,
    tagline: data.tagline,
    customFont: data.customFont,
    animation: data.animation !== 'none' ? data.animation : undefined,
    backgroundType: data.backgroundType !== 'solid' ? data.backgroundType : undefined,
    backgroundImage: data.backgroundImage || undefined,
    customGradient: data.customGradient || undefined,
    customColors: data.customColors,
    customCss: data.customCss || undefined,
    customHtml: data.customHtml || undefined,
    servicios: data.servicios.filter((s) => s.name || s.price),
    horario: data.horario,
    direccion: data.direccion,
    googleMapsUrl: data.googleMapsUrl,
    redesSociales: data.redesSociales,
    views: 0,
    clicks: 0,
    whatsappClicks: 0,
    instagramClicks: 0,
    phoneClicks: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function buildInitialCard(initialData?: Partial<Card>): Card {
  return formDataToCard({
    slug: initialData?.slug || 'preview',
    nombre: initialData?.nombre || 'Tu nombre completo',
    tituloProfesional: initialData?.tituloProfesional || 'Tu profesión',
    empresa: initialData?.empresa || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    fotoUrl: initialData?.fotoUrl || '',
    logoUrl: initialData?.logoUrl || '',
    headerBanner: initialData?.headerBanner || '',
    pin: '',
    diseño: (initialData as (Partial<Card> & { diseño?: CardFormData['diseño'] }))?.diseño || 'clasico',
    tagline: initialData?.tagline || '',
    customFont: initialData?.customFont || 'inter',
    animation: initialData?.animation || 'none',
    backgroundType: initialData?.backgroundType || 'solid',
    backgroundImage: initialData?.backgroundImage || '',
    customGradient: initialData?.customGradient || '',
    customColors: initialData?.customColors,
    customCss: initialData?.customCss || '',
    customHtml: initialData?.customHtml || '',
    servicios: (initialData as (Partial<Card> & { servicios?: CardFormData['servicios'] }))?.servicios || [],
    horario: (initialData as (Partial<Card> & { horario?: string }))?.horario || '',
    direccion: (initialData as (Partial<Card> & { direccion?: string }))?.direccion || '',
    googleMapsUrl: (initialData as (Partial<Card> & { googleMapsUrl?: string }))?.googleMapsUrl || '',
    redesSociales: initialData?.redesSociales || {
      linkedin: '', instagram: '', twitter: '', whatsapp: '', github: '', tiktok: '',
    },
  })
}

export default function CardEditorWithPreview({ initialData, onSubmit, isEditing }: Props) {
  const [previewCard, setPreviewCard] = useState<Card>(() => buildInitialCard(initialData))
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const handlePreviewChange = useCallback((data: CardFormData) => {
    setPreviewCard(formDataToCard(data))
  }, [])

  const preview = (
    <div className="flex-1 overflow-y-auto px-4 pb-8">
      <DesignCardPreview card={previewCard} />
    </div>
  )

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Left: Form */}
        <div className="min-w-0">
          <CardForm
            initialData={initialData}
            onSubmit={onSubmit}
            isEditing={isEditing}
            onPreviewChange={handlePreviewChange}
          />
        </div>

        {/* Right: sticky live preview (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-6" style={{ maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <div className="space-y-3 pb-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm font-medium text-mts-muted">Vista previa en tiempo real</p>
              </div>

              {/* Phone frame */}
              <div className="mx-auto max-w-[340px]">
                <div className="rounded-[44px] border-[6px] border-slate-700 bg-mts-bg shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="h-6 bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <div className="w-16 h-1.5 rounded-full bg-slate-600" />
                  </div>
                  {/* Scrollable card area */}
                  <div
                    className="overflow-y-auto bg-mts-bg"
                    style={{ maxHeight: '72vh', scrollbarWidth: 'none' }}
                  >
                    <div className="p-3">
                      <DesignCardPreview card={previewCard} />
                    </div>
                  </div>
                  {/* Home bar */}
                  <div className="h-5 bg-slate-700 flex items-end justify-center pb-1.5 flex-shrink-0">
                    <div className="w-24 h-1 rounded-full bg-slate-500" />
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-mts-muted">Los cambios se reflejan al instante</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: floating preview button */}
      <button
        type="button"
        onClick={() => setShowMobilePreview(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-mts-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-mts-primary-hover"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Vista previa
      </button>

      {/* Mobile full-screen preview sheet */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-mts-bg">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm font-semibold text-white">Vista previa</p>
            </div>
            <button
              type="button"
              onClick={() => setShowMobilePreview(false)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-mts-muted hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al editor
            </button>
          </div>
          {preview}
        </div>
      )}
    </div>
  )
}
