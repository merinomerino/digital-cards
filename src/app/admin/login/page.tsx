'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { setAdminToken } from '@/lib/adminAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const result = (await response.json().catch(() => null)) as { token?: string; error?: string } | null

      if (!response.ok || !result?.token) {
        const message = result?.error || 'No se pudo iniciar sesión.'
        setError(message)
        toast.error(message)
        return
      }

      setAdminToken(result.token)
      toast.success('Acceso concedido')
      router.replace('/admin/dashboard')
    } catch {
      const message = 'No se pudo conectar con el servidor.'
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-200">
              Password de administrador
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? 'Verificando acceso...' : 'Entrar al Admin'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-mts-muted">
          Este acceso protege seed, dashboard, analytics y creación manual de tarjetas en producción.
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-mts-muted transition hover:text-white">
            ← Volver a CardLink
          </Link>
        </div>
      </div>
    </div>
  )
}
