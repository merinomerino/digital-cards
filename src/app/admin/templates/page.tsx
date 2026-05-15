'use client'

import { TEMPLATES } from '@/lib/templates/registry'

export default function AdminTemplates() {
  const freeTemplates = TEMPLATES.filter(t => !t.premium)
  const premiumTemplates = TEMPLATES.filter(t => t.premium)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-mts-muted text-sm mt-1">{TEMPLATES.length} plantillas disponibles</p>
      </div>

      {/* Free templates */}
      <div>
        <h2 className="text-white font-semibold text-sm mb-4">Gratuitas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {freeTemplates.map(t => (
            <div key={t.id} className="bg-[#13131a] border border-white/5 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="h-32 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.primary}22)` }}>
                <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl" style={{ borderColor: t.colors.primary, color: t.colors.primary }}>
                  {t.variant === 'tattoo' ? '⚡' : t.variant === 'vet' ? '🐾' : t.variant === 'travel' ? '✈️' : '◆'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm">{t.name}</h3>
                <p className="text-mts-muted text-xs mt-1 leading-relaxed">{t.description}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.secondary }} />
                  <span className="text-[10px] text-mts-muted ml-auto">{t.variant}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium templates */}
      <div>
        <h2 className="text-white font-semibold text-sm mb-4">Premium ✦</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {premiumTemplates.map(t => (
            <div key={t.id} className="bg-[#13131a] border border-amber-500/20 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-colors relative">
              <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 text-[10px] font-medium px-2 py-0.5 rounded-full">Premium</div>
              <div className="h-32 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.primary}22)` }}>
                <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center text-2xl opacity-60" style={{ borderColor: t.colors.primary, color: t.colors.primary }}>
                  ✦
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm">{t.name}</h3>
                <p className="text-mts-muted text-xs mt-1 leading-relaxed">{t.description}</p>
                <p className="text-amber-400 text-xs font-medium mt-3">Próximamente</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
