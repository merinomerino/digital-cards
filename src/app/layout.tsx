import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Raleway, Oswald } from 'next/font/google'
import Script from 'next/script'
import Footer from '@/components/Footer'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' })
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'CardLink — Tu tarjeta de presentación digital',
    template: '%s | CardLink',
  },
  description:
    'Crea tu tarjeta de presentación digital profesional con código QR. Gratis, sin registro. Compártela en segundos.',
  keywords: [
    'tarjeta de presentación digital',
    'QR profesional',
    'vcard digital',
    'tarjeta digital México',
    'contacto digital',
  ],
  authors: [{ name: 'Merino Tech Systems', url: 'https://merinotechsystems.com' }],
  creator: 'Merino Tech Systems',
  publisher: 'Merino Tech Systems',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'CardLink',
    title: 'CardLink — Tu tarjeta de presentación digital',
    description: 'Tarjeta profesional con QR. Gratis y sin registro.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CardLink — Tu tarjeta de presentación digital',
    description: 'Tarjeta profesional con QR. Gratis y sin registro.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f172a',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  return (
    <html lang="es">
      <head>
        {/* Google AdSense — solo si el Publisher ID está configurado */}
        {publisherId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${raleway.variable} ${oswald.variable} ${inter.className} flex flex-col min-h-screen`}>
        <ServiceWorkerRegistrar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
