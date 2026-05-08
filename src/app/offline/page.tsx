'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">📶</div>
      <h1 className="text-2xl font-bold text-white mb-2">Sin conexión a internet</h1>
      <p className="text-slate-400 max-w-sm mb-8">
        Parece que no tienes conexión. Revisa tu red e intenta de nuevo.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Reintentar
      </button>
      <div className="mt-12">
        <span className="text-2xl font-bold text-white">Card<span className="text-indigo-400">Link</span></span>
      </div>
    </div>
  )
}
