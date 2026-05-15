import { describe, it, expect } from 'vitest'
import { toSlug, hashPin, formatPhone, getSocialUrl } from './utils'

describe('toSlug', () => {
  it('converts basic text to slug', () => {
    expect(toSlug('Juan Pérez')).toBe('juan-perez')
  })

  it('removes accents', () => {
    expect(toSlug('María José Hernández')).toBe('maria-jose-hernandez')
  })

  it('removes special characters', () => {
    expect(toSlug('Pedro @#$ López')).toBe('pedro-lopez')
  })

  it('handles multiple spaces and dashes', () => {
    expect(toSlug('  Ana   María  ')).toBe('ana-maria')
  })

  it('returns empty string for empty input', () => {
    expect(toSlug('')).toBe('')
  })

  it('preserves numbers', () => {
    expect(toSlug('Carlos 123')).toBe('carlos-123')
  })
})

describe('hashPin', () => {
  it('returns a 64-character hex string', () => {
    const hash = hashPin('1234')
    expect(hash).toHaveLength(64)
    expect(/^[a-f0-9]+$/.test(hash)).toBe(true)
  })

  it('returns consistent results for same input', () => {
    expect(hashPin('5678')).toBe(hashPin('5678'))
  })

  it('returns different results for different inputs', () => {
    expect(hashPin('1234')).not.toBe(hashPin('5678'))
  })
})

describe('formatPhone', () => {
  it('formats phone number for WhatsApp URL', () => {
    expect(formatPhone('5218787020221')).toBe('https://wa.me/5218787020221')
  })

  it('removes non-digit characters', () => {
    expect(formatPhone('+52 878 702 0221')).toBe('https://wa.me/528787020221')
  })
})

describe('getSocialUrl', () => {
  it('returns LinkedIn URL', () => {
    expect(getSocialUrl('linkedin', 'juanperez')).toBe('https://linkedin.com/in/juanperez')
  })

  it('returns GitHub URL', () => {
    expect(getSocialUrl('github', 'merinomerino')).toBe('https://github.com/merinomerino')
  })

  it('returns WhatsApp URL with formatting', () => {
    expect(getSocialUrl('whatsapp', '5218787020221')).toBe('https://wa.me/5218787020221')
  })

  it('returns Instagram URL', () => {
    expect(getSocialUrl('instagram', 'juanperez')).toBe('https://instagram.com/juanperez')
  })

  it('returns raw value for unknown network', () => {
    expect(getSocialUrl('unknown', 'some-value')).toBe('some-value')
  })
})
