import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/** Sube una foto de perfil a Firebase Storage y retorna la URL pública */
export async function uploadProfilePhoto(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const path = `cards/${slug}/profile.${ext}`
  const storageRef = ref(storage, path)

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

/** Elimina la foto de perfil de Storage */
export async function deleteProfilePhoto(slug: string): Promise<void> {
  for (const ext of ['jpg', 'png']) {
    try {
      await deleteObject(ref(storage, `cards/${slug}/profile.${ext}`))
    } catch {
      // Ignore — el archivo puede no existir
    }
  }
}
