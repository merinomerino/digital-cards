import { db, firebaseAvailable } from '@/lib/firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  type QueryDocumentSnapshot,
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
  try {
    const docRef = doc(db!, COLLECTION, id)
    const { deleteField } = await import('firebase/firestore')
    const cleanData: Record<string, unknown> = { updatedAt: Timestamp.now() }
    for (const [k, v] of Object.entries(data)) {
      cleanData[k] = v === undefined ? deleteField() : v
    }
    await updateDoc(docRef, cleanData)
  } catch (err) {
    const errorType = findErrorType(err)
    if (errorType === 'conexion') {
      throw new DatabaseError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    }
    if (errorType === 'permiso') {
      throw new DatabaseError('No tienes permiso para editar esta tarjeta.')
    }
    throw new DatabaseError('No se pudieron guardar los cambios. Inténtalo de nuevo.')
  }
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

export interface CardsPage {
  cards: Card[]
  cursor: QueryDocumentSnapshot | null
  hasMore: boolean
}

export async function getCardsPaginated(
  pageSize = 20,
  cursor?: QueryDocumentSnapshot | null
): Promise<CardsPage> {
  checkAvailable()
  try {
    const base = query(
      collection(db!, COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1),
      ...(cursor ? [startAfter(cursor)] : [])
    )
    const snapshot = await getDocs(base)
    const hasMore = snapshot.docs.length > pageSize
    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs
    const cards = docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate(),
      } as Card
    })
    return { cards, cursor: docs[docs.length - 1] ?? null, hasMore }
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
  try {
    const cardSnap = await getDoc(doc(db!, COLLECTION, id))
    const slug = cardSnap.exists() ? (cardSnap.data().slug as string | undefined) : undefined
    await deleteDoc(doc(db!, COLLECTION, id))
    if (slug) {
      const { deleteCardStorage } = await import('./storage')
      await deleteCardStorage(slug)
    }
  } catch (err) {
    const errorType = findErrorType(err)
    if (errorType === 'conexion') {
      throw new DatabaseError('No se pudo conectar a la base de datos. Verifica tu conexión.')
    }
    if (errorType === 'permiso') {
      throw new DatabaseError('No tienes permiso para eliminar esta tarjeta.')
    }
    throw new DatabaseError('No se pudo eliminar la tarjeta. Inténtalo de nuevo.')
  }
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
