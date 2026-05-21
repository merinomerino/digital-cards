'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { onAdminAuth, logoutAdmin, getAppUser, type AppUser } from '@/lib/auth'
import type { User as FirebaseUser } from 'firebase/auth'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '◻' },
  { label: 'Tarjetas', href: '/admin/cards', icon: '⊞' },
  { label: 'Usuarios', href: '/admin/users', icon: '◉' },
  { label: 'Analytics', href: '/admin/analytics', icon: '◈' },
  { label: 'Editor', href: '/admin/editor', icon: '✎' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authState, setAuthState] = useState<'checking' | 'guest' | 'authenticated'>('checking')
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'
  const isSetupPage = pathname === '/admin/setup'
  const isPublicAdminPage = isLoginPage || isSetupPage

  useEffect(() => {
    /* No configurar listener de auth para páginas públicas */
    if (isPublicAdminPage) {
      setAuthState('guest')
      return
    }

    const unsubscribe = onAdminAuth(async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null)
        setAppUser(null)
        setAuthState('guest')
        if (!isPublicAdminPage) router.replace('/admin/login')
        return
      }

      /* Fetch rol desde Firestore */
      try {
        const userData = await getAppUser(firebaseUser.uid)
        /* Bloquear si es cliente */
        if (userData?.role === 'client' || userData?.active === false) {
          await logoutAdmin()
          setAuthState('guest')
          router.replace('/admin/login')
          return
        }
        setAppUser(userData)
      } catch {
        /* Si no existe en Firestore pero está autenticado, permitir como root */
        setAppUser(null)
      }

      setCurrentUser(firebaseUser)
      setAuthState('authenticated')
      if (isLoginPage) router.replace('/admin/dashboard')
    })

    return unsubscribe
  }, [isLoginPage, isPublicAdminPage, router])

  const handleLogout = async () => {
    setSidebarOpen(false)
    await logoutAdmin()
    router.replace('/admin/login')
  }

  /* Páginas públicas del admin — renderizar sin esperar auth */
  if (isPublicAdminPage) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#13131A', color: '#F1F5F9', border: '1px solid #1E293B', borderRadius: '14px' },
          }}
        />
        {children}
      </>
    )
  }

  /* Spinner de verificación (solo para páginas protegidas) */
  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-mts-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  /* No autenticado */
  if (authState !== 'authenticated') return null

  const displayEmail = currentUser?.email ?? appUser?.email ?? 'Admin'
  const displayRole = appUser?.role ?? 'root'
  const displayName = appUser?.displayName ?? displayEmail.split('@')[0]

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#13131A',
            color: '#F1F5F9',
            border: '1px solid #1E293B',
            borderRadius: '14px',
          },
        }}
      />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0F0F1A] transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-tight text-white">
            Card<span className="text-indigo-400">Link</span>
            <span className="ml-2 text-xs font-normal text-mts-muted">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-mts-muted transition hover:text-white lg:hidden">
            ✕
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-indigo-500/15 font-medium text-indigo-300' : 'text-mts-muted hover:bg-white/5 hover:text-white'}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/5 p-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{displayName}</p>
                <p className="text-xs text-mts-muted truncate">{displayEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                displayRole === 'root' ? 'bg-amber-900/40 text-amber-400' : 'bg-indigo-900/40 text-indigo-400'
              }`}>
                {displayRole}
              </span>
              <span className="text-[10px] text-mts-muted">🔒 Firebase Auth</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-mts-muted transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
            >
              ⏻ Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/5 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-xl text-white lg:hidden" aria-label="Abrir menú">
              ☰
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-mts-muted">Panel seguro</p>
              <p className="text-sm font-semibold text-white">
                {NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.label || 'CardLink Admin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-mts-muted truncate max-w-[180px]">{displayEmail}</span>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-mts-muted transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
