import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage, firebaseAvailable } from './firebase'

function checkStorage(): void {
  if (!firebaseAvailable || !storage) {
    throw new Error('Firebase Storage no está disponible. Verifica la configuración.')
  }
}

export async function uploadProfilePhoto(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  checkStorage()
  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const path = `cards/${slug}/profile.${ext}`
  const storageRef = ref(storage!, path)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000',
    })

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.(pct)
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function deleteProfilePhoto(slug: string): Promise<void> {
  if (!firebaseAvailable || !storage) return
  for (const ext of ['jpg', 'png']) {
    try {
      await deleteObject(ref(storage!, `cards/${slug}/profile.${ext}`))
    } catch {
      // Ignore
    }
  }
}
