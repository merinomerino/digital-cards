'use client'

/**
 * /admin/setup — Página de primer arranque para crear el admin root de Firebase Auth.
 * Protegida por ADMIN_PASSWORD (env var) para evitar registros no autorizados.
 * Una vez creado el primer usuario, esta página puede deshabilitarse.
 */

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { registerUser } from '@/lib/auth'

type Step = 'verify' | 'register' | 'done'

function firebaseErrorMsg(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Ve a iniciar sesión.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu red.',
    'auth/operation-not-allowed': 'Email/Password no está habilitado en Firebase Console. Actívalo en Authentication → Sign-in method.',
    'permission-denied': 'Firestore bloqueó la escritura. Verifica las Security Rules del proyecto.',
  }
  return map[code] ?? `Error al crear la cuenta (${code || 'desconocido'}). Inténtalo de nuevo.`
}

export default function AdminSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('verify')
  const [setupPassword, setSetupPassword] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* Paso 1 — verificar ADMIN_PASSWORD */
  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: setupPassword }),
      })
      const data = (await res.json().catch(() => null)) as { token?: string; error?: string } | null
      if (!res.ok || !data?.token) {
        setError(data?.error ?? 'Clave de configuración incorrecta.')
        toast.error('Clave incorrecta')
        return
      }
      toast.success('Verificado. Ahora crea tu cuenta de admin.')
      setStep('register')
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  /* Paso 2 — crear usuario Firebase */
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      await registerUser(email.trim().toLowerCase(), password)
      toast.success('¡Cuenta de administrador creada!')
      setStep('done')
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
          style: { background: '#13131A', color: '#F1F5F9', border: '1px solid rgba(99,102,241,0.18)', borderRadius: '16px' },
        }}
      />

      <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[#13131A] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-xl">
            ⚙️
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">Primera configuración</p>
            <h1 className="mt-2 text-2xl font-semibold text-white tracking-tight">Crear Admin Root</h1>
            <p className="mt-2 text-sm text-mts-muted">
              Crea la cuenta de administrador principal de CardLink.
            </p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-7">
          {(['verify', 'register', 'done'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === s ? 'bg-indigo-600 text-white' :
                (i < (['verify', 'register', 'done'] as Step[]).indexOf(step)) ? 'bg-emerald-600 text-white' :
                'bg-white/10 text-mts-muted'
              }`}>
                {i < (['verify', 'register', 'done'] as Step[]).indexOf(step) ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`h-px flex-1 ${i < (['verify', 'register', 'done'] as Step[]).indexOf(step) ? 'bg-emerald-600' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Verify ADMIN_PASSWORD */}
        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/70 leading-relaxed">
              <p className="font-medium text-amber-300 mb-1">🔑 Clave de configuración requerida</p>
              Ingresa el valor de <code className="bg-white/10 px-1 rounded">ADMIN_PASSWORD</code> de tus variables de entorno para verificar que tienes acceso al servidor.
            </div>
            <div>
              <label htmlFor="setup-pass" className="mb-2 block text-sm font-medium text-slate-200">
                Clave de configuración (ADMIN_PASSWORD)
              </label>
              <input
                id="setup-pass"
                type="password"
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-500/20"
                placeholder="••••••••••"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
                <span className="shrink-0">⚠</span><span>{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading || !setupPassword} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-500 px-4 py-3 font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {loading ? 'Verificando...' : 'Verificar acceso'}
            </button>
          </form>
        )}

        {/* Step 2: Create Firebase admin user */}
        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-email" className="mb-2 block text-sm font-medium text-slate-200">
                Correo electrónico del admin
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="admin@merinotechsystems.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="mb-2 block text-sm font-medium text-slate-200">
                Contraseña (mín. 8 caracteres)
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-mts-muted hover:text-white text-xs" tabIndex={-1}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {password && (
                <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${password.length < 8 ? 'w-1/4 bg-red-500' : password.length < 12 ? 'w-2/4 bg-amber-500' : 'w-full bg-emerald-500'}`} />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="reg-confirm" className="mb-2 block text-sm font-medium text-slate-200">
                Confirmar contraseña
              </label>
              <input
                id="reg-confirm"
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:ring-2 focus:ring-indigo-500/20 ${confirmPassword && confirmPassword !== password ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-400/50'}`}
                placeholder="••••••••••••"
                autoComplete="new-password"
                required
                disabled={loading}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="mt-1 text-xs text-red-400">Las contraseñas no coinciden</p>
              )}
            </div>
            {error && (
              <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
                <span className="shrink-0">⚠</span><span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !email || !password || !confirmPassword || password !== confirmPassword}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 font-semibold text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {loading ? 'Creando cuenta...' : 'Crear cuenta de administrador'}
            </button>
          </form>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div className="text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl">
              ✅
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">¡Cuenta creada!</h2>
              <p className="text-mts-muted text-sm mt-2">
                Tu cuenta de administrador <span className="text-white">{email}</span> está lista.
              </p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 text-xs text-mts-muted text-left space-y-1">
              <p className="text-amber-300/70 font-medium">💡 Recomendaciones de seguridad</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Guarda tus credenciales en un gestor de contraseñas.</li>
                <li>No compartas tu contraseña con nadie.</li>
                <li>Puedes cambiar la contraseña desde Firebase Console si la olvidas.</li>
              </ul>
            </div>
            <button
              onClick={() => router.replace('/admin/login')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 font-semibold text-white transition"
            >
              Ir a iniciar sesión →
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-sm text-mts-muted transition hover:text-white">
            ← Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
