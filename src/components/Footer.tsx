export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-[#0f172a] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top: brand + nav */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight">
                Card<span className="text-indigo-400">Link</span>
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Gratis
              </span>
            </div>
            <p className="text-slate-500 text-sm">Tu identidad profesional, siempre contigo.</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Crear tarjeta</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacidad</a>
            <a href="/terms" className="hover:text-white transition-colors">Términos</a>
            <a href="mailto:contacto@merinotechsystems.com" className="hover:text-white transition-colors">Contacto</a>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
            <p>© {year} CardLink. Todos los derechos reservados.</p>
            <p>
              Desarrollado por{' '}
              <a
                href="https://merinotechsystems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Merino Tech Systems
              </a>
              {' '}· Piedras Negras, Coahuila
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
