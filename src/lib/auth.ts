import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  deleteUser,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import type { Card } from '@/types/card'

export type UserRole = 'root' | 'admin' | 'client'

export interface AppUser {
  uid: string
  email: string
  role: UserRole
  active: boolean
  mustCreatePassword: boolean
  company?: string
  createdAt: string
  displayName?: string
}

export async function loginAdmin(email: string, password: string): Promise<FirebaseUser> {
  if (!auth) throw new Error('Firebase Auth no está configurado')
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logoutAdmin(): Promise<void> {
  if (!auth) return
  await fbSignOut(auth)
}

export function onAdminAuth(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) return () => {}
  return onAuthStateChanged(auth, callback)
}

export async function getAppUser(uid: string): Promise<AppUser | null> {
  if (!db) return null
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as AppUser
}

export async function registerUser(email: string, password: string): Promise<AppUser> {
  if (!auth || !db) throw new Error('Firebase no está configurado')
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const userData: AppUser = {
    uid: cred.user.uid,
    email,
    role: 'admin',
    active: true,
    mustCreatePassword: false,
    createdAt: Timestamp.now().toDate().toISOString(),
    displayName: email.split('@')[0],
  }
  const userRef = doc(db, 'users', cred.user.uid)
  try {
    await setDoc(userRef, userData)
  } catch (firestoreErr: unknown) {
    /* Rollback: eliminar el usuario de Firebase Auth si Firestore falla */
    await deleteUser(cred.user).catch(() => {})
    // Re-lanzar con code legible si está disponible
    const code = (firestoreErr as { code?: string }).code
    if (code) {
      const e = firestoreErr as Error & { code: string }
      e.code = code
      throw e
    }
    throw firestoreErr
  }
  return userData
}

export async function sendSetupLink(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase Auth no está configurado')
  await sendPasswordResetEmail(auth, email)
}

export async function getUserCards(uid: string): Promise<Card[]> {
  if (!db) return []
  const q = query(collection(db, 'cards'), where('ownerId', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Card))
}
