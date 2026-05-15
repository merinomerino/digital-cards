import { analytics } from './firebase'
import { logEvent } from 'firebase/analytics'

export type AnalyticsEvent =
  | 'card_view'
  | 'social_click'
  | 'phone_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'website_click'
  | 'save_contact'
  | 'share_card'
  | 'qr_scan'

export function trackCardEvent(
  event: AnalyticsEvent,
  params?: Record<string, string | number | boolean>,
) {
  if (!analytics) return
  try {
    logEvent(analytics, event, params)
  } catch {
    // analytics not available
  }
}

export function trackCardView(slug: string, cardName: string) {
  trackCardEvent('card_view', { slug, card_name: cardName })
}

export function trackSocialClick(slug: string, network: string) {
  trackCardEvent('social_click', { slug, network })
}

export function trackClick(slug: string, type: string) {
  trackCardEvent(type as AnalyticsEvent, { slug })
}
