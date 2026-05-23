import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mts-bg px-4">
      <div className="w-full max-w-md space-y-6 rounded-[32px] border border-white/10 bg-[#13131A] p-8 text-center shadow-2xl shadow-black/30 animate-scale-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
          <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-mts-text">Página no encontrada</h1>
          <p className="text-sm leading-relaxed text-mts-muted">
            La tarjeta o página que buscas no existe, pudo cambiar de enlace o aún no haber sido publicada.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">¿Qué puedes hacer?</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Verifica que el enlace esté completo y sin errores.</li>
            <li>• Regresa al inicio para explorar ejemplos de tarjetas.</li>
            <li>• Crea tu propia tarjeta si aún no tienes una publicada.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-mts-primary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-mts-primary-hover"
          >
            ← Volver a CardLink
          </Link>
          <Link
            href="/#crear"
            className="text-sm text-mts-muted transition-colors hover:text-mts-text"
          >
            Crear mi tarjeta gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
