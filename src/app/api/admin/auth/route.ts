import { createHash, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

const ADMIN_SALT = 'cardlink-admin-salt'

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null
}

function hashAdminToken(password: string): string {
  return createHash('sha256').update(password + ADMIN_SALT).digest('hex')
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice(7).trim() || null
}

export async function POST(request: Request) {
  const adminPassword = getAdminPassword()

  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD no está configurado.' }, { status: 500 })
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null
  const password = body?.password?.trim() || ''

  if (!password) {
    return NextResponse.json({ error: 'La contraseña es obligatoria.' }, { status: 400 })
  }

  const expectedToken = hashAdminToken(adminPassword)
  const incomingToken = hashAdminToken(password)

  if (!safeCompare(incomingToken, expectedToken)) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 })
  }

  return NextResponse.json(
    { authenticated: true, token: expectedToken },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function GET(request: Request) {
  const adminPassword = getAdminPassword()

  if (!adminPassword) {
    return NextResponse.json({ authenticated: false, error: 'ADMIN_PASSWORD no está configurado.' }, { status: 500 })
  }

  const token = getBearerToken(request)

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }

  const expectedToken = hashAdminToken(adminPassword)

  if (!safeCompare(token, expectedToken)) {
    return NextResponse.json({ authenticated: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }

  return NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } })
}
