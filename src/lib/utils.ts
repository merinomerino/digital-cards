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
