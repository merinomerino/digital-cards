import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAuth, type Auth } from 'firebase/auth'
import { getAnalytics, type Analytics } from 'firebase/analytics'

const requiredConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// measurementId es opcional (Analytics); no bloquea Auth ni Firestore
const firebaseConfig = {
  ...requiredConfig,
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }
    : {}),
}

const hasKeys = Object.values(requiredConfig).every(v => typeof v === 'string' && v.length > 0)

let app: FirebaseApp | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null
let auth: Auth | null = null
let analytics: Analytics | null = null

if (hasKeys) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    db = getFirestore(app)
    storage = getStorage(app)
    auth = getAuth(app)
    try { analytics = getAnalytics(app) } catch { /* analytics not supported */ }
  } catch {
    // Firebase no disponible
  }
}

export { db, storage, auth, analytics }
export const firebaseAvailable = app !== null
