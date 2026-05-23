import { NextRequest, NextResponse } from 'next/server'
import { getCardBySlug } from '@/lib/firestore'
import { hashPin } from '@/lib/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    const card = await getCardBySlug(slug)
    if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Strip sensitive fields before returning
    const { pinHash: _pin, ...publicCard } = card
    return NextResponse.json(publicCard)
  } catch {
    return NextResponse.json({ error: 'Error al cargar la tarjeta' }, { status: 500 })
  }
}

// Simple in-memory rate limiter: max 5 attempts per IP per slug per 5 min
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 5 * 60 * 1000

function checkRateLimit(ip: string, slug: string): boolean {
  const key = `${ip}:${slug}`
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count++
  return true
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip, slug)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera 5 minutos.' },
      { status: 429 }
    )
  }

  const { pin } = await req.json()

  if (!pin || String(pin).length !== 4) {
    return NextResponse.json({ error: 'PIN inválido' }, { status: 400 })
  }

  const card = await getCardBySlug(slug)
  if (!card) return NextResponse.json({ error: 'Tarjeta no encontrada' }, { status: 404 })

  const pinHash = hashPin(String(pin))
  if (pinHash !== card.pinHash) {
    return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 })
  }

  return NextResponse.json({ id: card.id, slug: card.slug })
}
