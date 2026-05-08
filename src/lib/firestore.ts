import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Card } from '@/types/card';

const COLLECTION = 'cards';

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  } as Card;
}

export async function createCard(
  data: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateCard(id: string, data: Partial<Card>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function slugExists(slug: string): Promise<boolean> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
