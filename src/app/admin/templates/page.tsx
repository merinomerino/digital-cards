'use client'

import { useRouter } from 'next/navigation'
import { TEMPLATES } from '@/lib/templates/registry'

export default function AdminTemplates() {
  const router = useRouter()
  const freeTemplates = TEMPLATES.filter(t => !t.premium)
  const premiumTemplates = TEMPLATES.filter(t => t.premium)

  function applyTemplate(variant: string) {
    router.push(`/admin/cards/new?template=${variant}`)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/5 bg-[#13131A] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="mt-1 text-sm text-mts-muted">
            {TEMPLATES.length} plantillas · Elige una y crea tu tarjeta en segundos
          </p>
        </div>
      </div>

      {/* Free templates */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Gratuitas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {freeTemplates.map(t => (
            <div
              key={t.id}
              className="group overflow-hidden rounded-[24px] border border-white/5 bg-[#13131a] transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              {/* Preview */}
              <div
                className="relative flex h-36 items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.primary}22)` }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl"
                  style={{ borderColor: t.colors.primary, color: t.colors.primary }}
                >
                  {t.variant === 'tattoo' ? '⚡' : t.variant === 'vet' ? '🐾' : t.variant === 'travel' ? '✈️' : '◆'}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => applyTemplate(t.variant)}
                    className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                  >
                    Usar template →
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-mts-muted">{t.description}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.colors.secondary }} />
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.colors.accent }} />
                  <span className="ml-auto text-[10px] text-mts-muted">{t.variant}</span>
                </div>
                <button
                  onClick={() => applyTemplate(t.variant)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  Usar template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium templates */}
      {premiumTemplates.length > 0 && (
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">Premium ✦</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {premiumTemplates.map(t => (
              <div
                key={t.id}
                className="relative overflow-hidden rounded-[24px] border border-amber-500/20 bg-[#13131a] transition-all hover:border-amber-500/40"
              >
                <div className="absolute right-3 top-3 z-10 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                  Premium
                </div>
                <div
                  className="flex h-36 items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${t.colors.bg}, ${t.colors.primary}22)` }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed text-2xl opacity-60"
                    style={{ borderColor: t.colors.primary, color: t.colors.primary }}
                  >
                    ✦
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-mts-muted">{t.description}</p>
                  <div className="mt-3 rounded-xl border border-amber-500/10 bg-amber-500/5 py-2 text-center text-xs font-medium text-amber-400/70">
                    Próximamente
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
