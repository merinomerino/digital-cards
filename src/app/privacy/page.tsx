import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de CardLink — cómo recopilamos, usamos y protegemos tus datos.',
  robots: { index: true, follow: false },
}

const LAST_UPDATED = '07 de mayo de 2026'
const CONTACT_EMAIL = 'privacidad@merinotechsystems.com'

export default function PrivacyPage() {
  return (
    <>
    <div className="min-h-screen bg-[#0f172a] text-white py-14 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors mb-4 inline-block">
            ← Volver a CardLink
          </Link>
          <h1 className="text-3xl font-bold text-white">Política de Privacidad</h1>
          <p className="text-slate-400 mt-2 text-sm">Última actualización: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
            <p className="text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Merino Tech Systems</strong>, empresa ubicada en Piedras Negras, Coahuila, México,
              es el responsable del tratamiento de los datos personales que usted proporcione al usar el servicio <strong className="text-slate-200">CardLink</strong>.
            </p>
            <p className="text-slate-400 leading-relaxed mt-2">
              Contacto de privacidad: <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-400 hover:underline">{CONTACT_EMAIL}</a>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Datos que recopilamos</h2>
            <p className="text-slate-400 leading-relaxed mb-3">Al crear o editar una tarjeta digital usted proporciona voluntariamente:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Nombre completo y título profesional</li>
              <li>Empresa u organización</li>
              <li>Número de teléfono y correo electrónico</li>
              <li>Sitio web y URL de foto de perfil</li>
              <li>Usuarios de redes sociales (LinkedIn, Instagram, WhatsApp, etc.)</li>
              <li>PIN de seguridad (almacenado únicamente como hash SHA-256 — no es reversible)</li>
            </ul>
            <p className="text-slate-400 leading-relaxed mt-3">
              También recopilamos datos de uso de forma anónima (páginas visitadas, país, tipo de dispositivo) a través
              de Google Analytics y Google AdSense, sujetos a sus propias políticas de privacidad.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalidad del tratamiento</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Crear y mostrar su tarjeta de presentación digital pública.</li>
              <li>Permitirle editar o actualizar su información mediante PIN.</li>
              <li>Generar el código QR asociado a su tarjeta.</li>
              <li>Mostrar publicidad contextual a través de Google AdSense para mantener el servicio gratuito.</li>
              <li>Analizar el uso del servicio para mejorarlo.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base legal</h2>
            <p className="text-slate-400 leading-relaxed">
              El tratamiento se basa en el <strong className="text-slate-200">consentimiento expreso</strong> que usted otorga
              al crear su tarjeta, de conformidad con la{' '}
              <strong className="text-slate-200">Ley Federal de Protección de Datos Personales en Posesión de los Particulares
              (LFPDPPP)</strong> y su Reglamento, así como los Lineamientos del Aviso de Privacidad.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Carácter público de los datos</h2>
            <p className="text-slate-400 leading-relaxed">
              La información que usted registra en su tarjeta es <strong className="text-slate-200">pública por naturaleza</strong>:
              está diseñada para ser compartida con terceros mediante el enlace o QR. Cualquier persona con acceso al enlace
              podrá ver la información de su tarjeta.
            </p>
            <p className="text-slate-400 leading-relaxed mt-2">
              Le recomendamos no incluir información sensible que no desee hacer pública.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Conservación de datos</h2>
            <p className="text-slate-400 leading-relaxed">
              Sus datos se conservan mientras el servicio esté activo o hasta que usted solicite su eliminación.
              No existe un límite de tiempo automático, pero podemos eliminar tarjetas inactivas por más de 24 meses
              previa notificación.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Derechos ARCO</h2>
            <p className="text-slate-400 leading-relaxed mb-3">
              Usted tiene derecho a <strong className="text-slate-200">Acceder, Rectificar, Cancelar u Oponerse</strong> al
              tratamiento de sus datos personales (derechos ARCO), así como el derecho a la portabilidad y al olvido.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Para ejercerlos, envíe un correo a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-400 hover:underline">{CONTACT_EMAIL}</a>{' '}
               con el asunto <em>&ldquo;Derechos ARCO &mdash; CardLink&rdquo;</em> e incluya:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Nombre completo</li>
              <li>Slug de su tarjeta (ej: /juan-perez)</li>
              <li>Derecho que desea ejercer</li>
              <li>Descripción clara de la solicitud</li>
            </ul>
            <p className="text-slate-400 mt-3">Respondemos en un plazo máximo de <strong className="text-slate-200">20 días hábiles</strong>.</p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cookies y tecnologías similares</h2>
            <p className="text-slate-400 leading-relaxed">
              Utilizamos cookies técnicas necesarias para el funcionamiento del servicio. Adicionalmente, Google AdSense
              puede utilizar cookies para mostrar publicidad personalizada. Puede gestionar sus preferencias en la
              configuración de su navegador o mediante el{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Centro de preferencias de anuncios de Google
              </a>.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Transferencias a terceros</h2>
            <p className="text-slate-400 leading-relaxed">
              Sus datos se almacenan en <strong className="text-slate-200">Google Cloud / Firebase Firestore</strong> (EE. UU.),
              bajo el Acuerdo de Procesamiento de Datos de Google. No vendemos ni compartimos sus datos personales con
              terceros con fines comerciales propios.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Cambios a esta política</h2>
            <p className="text-slate-400 leading-relaxed">
              Nos reservamos el derecho de modificar esta política. Los cambios sustanciales se notificarán mediante
              aviso en la página principal con al menos 30 días de anticipación.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Autoridad reguladora</h2>
            <p className="text-slate-400 leading-relaxed">
              Si considera que sus derechos han sido vulnerados puede presentar una queja ante el{' '}
              <a
                href="https://www.inai.org.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
