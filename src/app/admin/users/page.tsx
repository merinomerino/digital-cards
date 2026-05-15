'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { AppUser } from '@/lib/auth'

export default function AdminUsers() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) return
    getDocs(collection(db, 'users')).then(snap => {
      setUsers(snap.docs.map(d => d.data() as AppUser))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <p className="text-mts-muted text-sm mt-1">{users.length} usuarios registrados</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-mts-muted text-sm">No hay usuarios registrados aún.</p>
        </div>
      ) : (
        <div className="bg-[#13131a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {users.map(u => (
              <div key={u.uid} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
                    {u.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{u.email}</p>
                    <p className="text-mts-muted text-xs">Rol: {u.role} {u.company ? `· ${u.company}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
