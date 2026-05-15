import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-mts-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-white tracking-tight">
                Card<span className="text-mts-primary">Link</span>
              </span>
            </div>
            <p className="text-mts-muted text-sm">by Merino Tech Systems</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mts-muted">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/#servicios" className="hover:text-white transition-colors">Servicios</Link>
            <Link href="/#crear" className="hover:text-white transition-colors">Crear tarjeta</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
            <a href="mailto:contacto@merinotechsystems.com" className="hover:text-white transition-colors">Contacto</a>
          </nav>
        </div>
        <div className="border-t border-mts-border pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-mts-muted">
            <p>&copy; {year} CardLink. Todos los derechos reservados.</p>
            <p>Piedras Negras, Coahuila, México</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
