'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { loginAdmin, getAppUser } from '@/lib/auth'

/* Firebase Auth error codes → mensajes en español */
function firebaseErrorMsg(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu red e intenta de nuevo.',
  }
  return map[code] ?? 'Error al iniciar sesión. Inténtalo de nuevo.'
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const firebaseUser = await loginAdmin(email.trim().toLowerCase(), password)

      /* Verificar rol — solo root y admin pueden entrar al panel */
      const appUser = await getAppUser(firebaseUser.uid)
      if (appUser && appUser.role === 'client') {
        setError('Esta cuenta no tiene permisos de administrador.')
        toast.error('Sin permisos de administrador')
        return
      }
      if (appUser && !appUser.active) {
        setError('Esta cuenta está deshabilitada. Contacta al administrador.')
        toast.error('Cuenta deshabilitada')
        return
      }

      toast.success('¡Bienvenido al panel de CardLink!')
      router.replace('/admin/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      const message = firebaseErrorMsg(code)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-10 flex items-center justify-center">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#13131A',
            color: '#F1F5F9',
            border: '1px solid rgba(99,102,241,0.18)',
            borderRadius: '16px',
          },
        }}
      />

      <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[#13131A] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-xl font-semibold text-indigo-300">
            CL
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-indigo-300/80">Merino Tech Systems</p>
            <h1 className="mt-2 text-3xl font-semibold text-white tracking-tight">
              Card<span className="text-indigo-400">Link</span>
            </h1>
            <p className="mt-2 text-sm text-mts-muted">Acceso seguro al panel de administración.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-slate-200">
              Correo electrónico
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="admin@merinotechsystems.com"
              autoComplete="email"
              inputMode="email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-200">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-mts-muted transition hover:text-white text-xs select-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 mt-2"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? 'Verificando acceso...' : 'Entrar al panel'}
          </button>
        </form>

        {/* Security note */}
        <div className="mt-5 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-mts-muted space-y-1">
          <div className="flex items-center gap-2 text-indigo-300/70 font-medium">
            <span>🔒</span> Acceso protegido con Firebase Auth
          </div>
          <p>Solo cuentas con rol <span className="text-white/60">admin</span> o <span className="text-white/60">root</span> pueden ingresar al panel.</p>
        </div>

        {/* Links */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/" className="text-mts-muted transition hover:text-white">
            ← Volver a CardLink
          </Link>
          <Link href="/admin/setup" className="text-indigo-400/60 transition hover:text-indigo-300 text-xs">
            Primera vez →
          </Link>
        </div>
      </div>
    </div>
  )
}
