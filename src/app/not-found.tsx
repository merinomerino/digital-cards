import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mts-bg flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-mts-text">Página no encontrada</h1>
        <p className="text-mts-muted text-sm leading-relaxed">
          La tarjeta o página que buscas no existe. Revisa la dirección o crea tu propia tarjeta digital.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-mts-primary hover:bg-mts-primary-hover text-white font-medium px-6 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-indigo-500/20"
          >
            ← Volver a CardLink
          </Link>
          <Link
            href="/#crear"
            className="text-mts-muted hover:text-mts-text text-sm transition-colors"
          >
            Crear mi tarjeta gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
