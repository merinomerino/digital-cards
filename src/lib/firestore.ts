import { db, firebaseAvailable } from '@/lib/firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { Card } from '@/types/card'

const COLLECTION = 'cards'

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

function checkAvailable() {
  if (!firebaseAvailable) {
    throw new DatabaseError('Firebase no está configurado. Verifica las variables de entorno.')
  }
  if (!db) {
    throw new DatabaseError('No se pudo conectar a la base de datos.')
  }
}

function findErrorType(err: unknown): string | null {
  const msg = String(err).toLowerCase()
  if (msg.includes('permission') || msg.includes('denied') || msg.includes('unauthorized')) {
    return 'permiso'
  }
  if (msg.includes('not found') || msg.includes('no entity') || msg.includes('no document')) {
    return 'no-encontrado'
  }
  if (msg.includes('grpc') || msg.includes('connection failed') ||
      msg.includes('offline') || msg.includes('unavailable') ||
      msg.includes('network') || msg.includes('timeout') ||
      msg.includes('internal') || msg.includes('canceled') ||
      msg.includes('deadline')) {
    return 'conexion'
  }
  return null
}

export async function getCardById(id: string): Promise<Card | null> {
  checkAvailable()
  try {
    const docSnap = await getDoc(doc(db!, COLLECTION, id))
    if (!docSnap.exists()) return null
    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as Card
  } catch (err) {
    const errorType = findErrorType(err)
    if (errorType === 'conexion') {
      throw new DatabaseError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    }
    throw err
  }
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  checkAvailable()
  try {
    const q = query(collection(db!, COLLECTION), where('slug', '==', slug))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const docSnap = snapshot.docs[0]
    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as Card
  } catch (err) {
    const errorType = findErrorType(err)
    if (errorType === 'conexion') {
      throw new DatabaseError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    }
    throw err
  }
}

export async function createCard(
  data: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  checkAvailable()
  try {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db!, COLLECTION), {
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return docRef.id
  } catch (err) {
    const errorType = findErrorType(err)
    if (errorType === 'conexion') {
      throw new DatabaseError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    }
    throw err
  }
}

export async function updateCard(id: string, data: Partial<Card>): Promise<void> {
  checkAvailable()
  const docRef = doc(db!, COLLECTION, id)
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() })
}

export async function getAllCards(): Promise<Card[]> {
  checkAvailable()
  try {
    const snapshot = await getDocs(collection(db!, COLLECTION))
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      } as Card
    })
  } catch (err) {
    const errorType = findErrorType(err)
    if (errorType === 'conexion') {
      throw new DatabaseError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    }
    throw err
  }
}

export async function deleteCard(id: string): Promise<void> {
  checkAvailable()
  const { doc, deleteDoc } = await import('firebase/firestore')
  const docRef = doc(db!, COLLECTION, id)
  await deleteDoc(docRef)
}

export async function slugExists(slug: string): Promise<boolean> {
  if (!firebaseAvailable || !db) return false
  try {
    const q = query(collection(db, COLLECTION), where('slug', '==', slug))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}
