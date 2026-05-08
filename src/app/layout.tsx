import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
