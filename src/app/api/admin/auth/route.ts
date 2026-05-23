import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

/**
 * POST /api/admin/auth
 * Verifica la clave de configuración inicial (ADMIN_PASSWORD).
 * Solo es llamada por /admin/setup para desbloquear el registro del primer root.
 */
export async function POST(req: Request) {
  try {
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Configuración de servidor incompleta. Define ADMIN_PASSWORD en las variables de entorno.' },
        { status: 503 }
      )
    }

    const body = await req.json().catch(() => null)
    const { password } = (body ?? {}) as { password?: string }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Se requiere el campo password.' }, { status: 400 })
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Clave de configuración incorrecta.' }, { status: 401 })
    }

    // Token simple: en producción, esto podría ser un JWT de corta duración.
    // Para setup de primer arranque, un token opaco es suficiente.
    const token = Buffer.from(`setup:${Date.now()}`).toString('base64')
    return NextResponse.json({ token }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
