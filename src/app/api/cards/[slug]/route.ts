import { NextRequest, NextResponse } from 'next/server'
import { getCardBySlug } from '@/lib/firestore'
import { hashPin } from '@/lib/utils'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
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
