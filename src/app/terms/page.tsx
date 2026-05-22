import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Términos y condiciones de uso del servicio CardLink.',
  robots: { index: true, follow: false },
}

const LAST_UPDATED = '07 de mayo de 2026'

export default function TermsPage() {
  return (
    <>
    <div className="min-h-screen bg-[#0f172a] text-white py-14 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors mb-4 inline-block">
            ← Volver a CardLink
          </Link>
          <h1 className="text-3xl font-bold text-white">Términos de Servicio</h1>
          <p className="text-slate-400 mt-2 text-sm">Última actualización: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de los términos</h2>
            <p className="text-slate-400 leading-relaxed">
              Al acceder o usar <strong className="text-slate-200">CardLink</strong> (en adelante &ldquo;el Servicio&rdquo;), operado por{' '}
              <strong className="text-slate-200">Merino Tech Systems</strong>, usted acepta estar sujeto a estos Términos de Servicio.
              Si no está de acuerdo con alguno de ellos, por favor no use el Servicio.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Descripción del Servicio</h2>
            <p className="text-slate-400 leading-relaxed">
              CardLink es una plataforma que permite a profesionales crear tarjetas de presentación digitales accesibles
              mediante un enlace único y código QR. El Servicio es gratuito y se sostiene mediante publicidad de Google AdSense.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Uso aceptable</h2>
            <p className="text-slate-400 leading-relaxed mb-3">Al usar CardLink usted se compromete a:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Proporcionar información veraz y actualizada en su tarjeta.</li>
              <li>No usar el Servicio para actividades ilegales, fraudulentas o que dañen a terceros.</li>
              <li>No suplantar la identidad de otra persona u organización.</li>
              <li>No intentar acceder a tarjetas ajenas sin autorización.</li>
              <li>No automatizar el uso del Servicio (scraping, bots) sin permiso por escrito.</li>
              <li>No publicar contenido ofensivo, discriminatorio o que infrinja derechos de autor.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Propiedad del contenido</h2>
            <p className="text-slate-400 leading-relaxed">
              Usted retiene todos los derechos sobre la información que ingresa en su tarjeta. Al usar el Servicio,
              nos otorga una licencia limitada, no exclusiva y gratuita para almacenar y mostrar ese contenido con el
              único propósito de operar CardLink.
            </p>
            <p className="text-slate-400 leading-relaxed mt-2">
              El diseño, interfaz, código fuente y marca CardLink son propiedad de Merino Tech Systems. Queda prohibida
              su reproducción total o parcial sin autorización.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. PIN de seguridad</h2>
            <p className="text-slate-400 leading-relaxed">
              El PIN que establezca al crear su tarjeta es su único mecanismo de autenticación para editarla.
              <strong className="text-slate-200"> No almacenamos su PIN en texto plano</strong> — solo guardamos
              un hash criptográfico irreversible. Si pierde su PIN, no podremos recuperarlo.
            </p>
            <p className="text-slate-400 leading-relaxed mt-2">
              Merino Tech Systems no se hace responsable por el acceso no autorizado derivado de la pérdida o
              divulgación de su PIN.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Publicidad</h2>
            <p className="text-slate-400 leading-relaxed">
              Las páginas públicas de las tarjetas pueden mostrar anuncios de terceros (Google AdSense) para financiar
              el Servicio. Merino Tech Systems no controla el contenido exacto de dichos anuncios y no se responsabiliza
              por los sitios de destino de los mismos.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Disponibilidad y modificaciones</h2>
            <p className="text-slate-400 leading-relaxed">
              Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio en cualquier momento, con o
              sin previo aviso. Haremos un esfuerzo razonable por notificar cambios importantes con al menos 15 días de
              anticipación.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitación de responsabilidad</h2>
            <p className="text-slate-400 leading-relaxed">
              CardLink se proporciona <strong className="text-slate-200">&ldquo;tal cual&rdquo;</strong>, sin garantías de ningún tipo.
              Merino Tech Systems no será responsable por:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Pérdida de datos por fallas técnicas o desastres naturales.</li>
              <li>Uso no autorizado de su tarjeta o PIN.</li>
              <li>Interrupciones o errores en el Servicio.</li>
              <li>Daños indirectos, especiales o consecuentes.</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Eliminación de contenido</h2>
            <p className="text-slate-400 leading-relaxed">
              Merino Tech Systems puede eliminar cualquier tarjeta que viole estos Términos sin previo aviso.
              Usted puede solicitar la eliminación de su tarjeta en cualquier momento enviando un correo a{' '}
              <a href="mailto:privacidad@merinotechsystems.com" className="text-indigo-400 hover:underline">
                privacidad@merinotechsystems.com
              </a>.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Ley aplicable</h2>
            <p className="text-slate-400 leading-relaxed">
              Estos Términos se rigen por las leyes de los <strong className="text-slate-200">Estados Unidos Mexicanos</strong>,
              con jurisdicción en los tribunales competentes de Piedras Negras, Coahuila, renunciando a cualquier otro
              fuero que pudiera corresponder por razón de domicilio presente o futuro.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contacto</h2>
            <p className="text-slate-400 leading-relaxed">
              Para cualquier pregunta sobre estos Términos:{' '}
              <a href="mailto:contacto@merinotechsystems.com" className="text-indigo-400 hover:underline">
                contacto@merinotechsystems.com
              </a>
            </p>
            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 text-sm">
              <strong className="text-slate-200 block mb-1">Merino Tech Systems</strong>
              Piedras Negras, Coahuila, México<br />
              <a href="https://merinotechsystems.com" className="text-indigo-400 hover:underline">merinotechsystems.com</a>
            </div>
          </section>

        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
