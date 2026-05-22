import CryptoJS from 'crypto-js';

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function hashPin(pin: string): string {
  return CryptoJS.SHA256(pin).toString(CryptoJS.enc.Hex);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${cleaned}`;
}

/**
 * Genera URL de WhatsApp con mensaje prellenado indicando que el contacto
 * vio la tarjeta digital, para que el dueño sepa de dónde viene el lead.
 */
export function getWhatsAppUrl(phone: string, nombre: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  const msg = encodeURIComponent(`Hola ${nombre}, vi tu tarjeta digital 👋`);
  return `https://wa.me/${cleaned}?text=${msg}`;
}

export function getSocialIcon(network: string): string {
  const icons: Record<string, string> = {
    linkedin: '💼',
    instagram: '📸',
    twitter: '🐦',
    whatsapp: '💬',
    github: '💻',
    tiktok: '🎵',
  };
  return icons[network] || '🔗';
}

export function getSocialUrl(network: string, value: string): string {
  const urls: Record<string, (v: string) => string> = {
    linkedin: (v) => `https://linkedin.com/in/${v}`,
    instagram: (v) => `https://instagram.com/${v}`,
    twitter: (v) => `https://twitter.com/${v}`,
    whatsapp: (v) => formatPhone(v),
    github: (v) => `https://github.com/${v}`,
    tiktok: (v) => `https://tiktok.com/@${v}`,
  };
  return urls[network]?.(value) || value;
}
