'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getUserCards, type AppUser, type UserRole } from '@/lib/auth'

interface UserWithCards extends AppUser {
  cardCount?: number
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    root: 'bg-red-900/40 text-red-400 border-red-500/20',
    admin: 'bg-indigo-900/40 text-indigo-400 border-indigo-500/20',
    client: 'bg-slate-800 text-slate-400 border-white/10',
  }
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[role] || styles.client}`}>
      {role}
    </span>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithCards[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    if (!db) return
    setError(null)
    try {
      const snap = await getDocs(collection(db, 'users'))
      const rawUsers = snap.docs.map(d => ({ ...d.data() } as UserWithCards))

      // Load card counts in parallel
      const withCounts = await Promise.all(
        rawUsers.map(async (u) => {
          try {
            const cards = await getUserCards(u.uid)
            return { ...u, cardCount: cards.length }
          } catch {
            return { ...u, cardCount: 0 }
          }
        })
      )
      setUsers(withCounts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)))
    } catch {
      setError('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  async function toggleActive(user: UserWithCards) {
    if (!db || updating) return
    setUpdating(user.uid)
    try {
      await updateDoc(doc(db, 'users', user.uid), { active: !user.active })
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, active: !u.active } : u))
    } catch {
      // ignore
    } finally {
      setUpdating(null)
    }
  }

  async function changeRole(user: UserWithCards, newRole: UserRole) {
    if (!db || updating || user.role === 'root') return
    setUpdating(user.uid)
    try {
      await updateDoc(doc(db, 'users', user.uid), { role: newRole })
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, role: newRole } : u))
    } catch {
      // ignore
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={loadUsers} className="text-sm text-indigo-400 hover:underline">Reintentar</button>
      </div>
    )
  }

  const activeCount = users.filter(u => u.active).length
  const rootCount = users.filter(u => u.role === 'root').length

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/5 bg-[#13131A] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="mt-1 text-sm text-mts-muted">
            {users.length} registrados · {activeCount} activos
            {rootCount > 0 && <span className="ml-1 text-red-400">· {rootCount} root</span>}
          </p>
        </div>
      </div>

      {/* Users list */}
      {users.length === 0 ? (
        <div className="rounded-[28px] border border-white/5 bg-[#13131A] p-12 text-center">
          <p className="text-sm text-mts-muted">No hay usuarios registrados aún.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#13131A]">
          <div className="divide-y divide-white/5">
            {users.map(u => (
              <div key={u.uid} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-sm font-bold text-indigo-300">
                    {u.displayName?.charAt(0)?.toUpperCase() || u.email?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {u.displayName || u.email}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      {u.displayName && (
                        <span className="text-xs text-mts-muted">{u.email}</span>
                      )}
                      <RoleBadge role={u.role} />
                      {u.company && (
                        <span className="text-xs text-mts-muted">· {u.company}</span>
                      )}
                      <span className="text-xs text-mts-muted">
                        · {u.cardCount ?? 0} tarjeta{u.cardCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  {/* Role selector — only for non-root users */}
                  {u.role !== 'root' && (
                    <select
                      value={u.role}
                      disabled={updating === u.uid}
                      onChange={(e) => changeRole(u, e.target.value as UserRole)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition focus:border-indigo-500/50 focus:outline-none disabled:opacity-50"
                    >
                      <option value="admin">admin</option>
                      <option value="client">client</option>
                    </select>
                  )}

                  {/* Active toggle */}
                  <button
                    disabled={updating === u.uid}
                    onClick={() => toggleActive(u)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                      u.active
                        ? 'border-emerald-500/20 bg-emerald-900/20 text-emerald-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/20'
                        : 'border-red-500/20 bg-red-900/20 text-red-400 hover:bg-emerald-900/20 hover:text-emerald-400 hover:border-emerald-500/20'
                    }`}
                  >
                    {updating === u.uid ? '...' : u.active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info note */}
      <p className="text-center text-xs text-mts-muted/60">
        Los usuarios con rol <span className="text-red-400">root</span> no pueden ser modificados desde aquí.
      </p>
    </div>
  )
}
