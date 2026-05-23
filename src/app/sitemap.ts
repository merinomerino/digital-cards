import type { MetadataRoute } from 'next'
import { getAllCards } from '@/lib/firestore'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cardlink.mx'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${APP_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const cards = await getAllCards()
    const cardRoutes: MetadataRoute.Sitemap = cards.map((card) => ({
      url: `${APP_URL}/${card.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    return [...staticRoutes, ...cardRoutes]
  } catch {
    return staticRoutes
  }
}
