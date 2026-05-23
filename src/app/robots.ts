import type { MetadataRoute } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/offline', '/admin/', '/*/edit'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
