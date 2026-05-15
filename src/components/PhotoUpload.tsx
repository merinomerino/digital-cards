'use client'

import { useRef, useState } from 'react'
import { uploadProfilePhoto } from '@/lib/storage'

interface PhotoUploadProps {
  slug: string
  currentUrl: string
  onChange: (url: string) => void
  disabled?: boolean
}

const MAX_SIZE_MB = 5
const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic'

export default function PhotoUpload({ slug, currentUrl, onChange, disabled }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentUrl)

  const handleFile = async (file: File) => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no debe superar ${MAX_SIZE_MB} MB`)
      return
    }
    setError('')
    setUploading(true)
    setProgress(0)
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    try {
      const downloadUrl = await uploadProfilePhoto(slug, file, setProgress)
      setPreview(downloadUrl)
      onChange(downloadUrl)
    } catch {
      setError('Error al subir la foto. Intenta de nuevo.')
      setPreview(currentUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-500/20 border-4 border-indigo-400/50 flex items-center justify-center cursor-pointer"
          onClick={() => !disabled && !uploading && inputRef.current?.click()}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center">
              <span className="text-white font-bold text-sm">{progress}%</span>
            </div>
          )}
        </div>
        {!disabled && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-mts-primary hover:bg-mts-primary-hover disabled:bg-slate-400 rounded-full flex items-center justify-center shadow-lg transition-colors"
            title="Cambiar foto">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>

      {uploading && (
        <div className="w-full max-w-xs bg-slate-200 rounded-full h-1.5">
          <div className="bg-mts-primary h-1.5 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}

      {!disabled && (
        <div className="flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:text-slate-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {preview ? 'Cambiar foto' : 'Agregar foto'}
          </button>
          {preview && (
            <button type="button" onClick={() => { setPreview(''); onChange('') }} disabled={uploading}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 disabled:text-slate-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Quitar
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <p className="text-xs text-mts-muted text-center">JPG, PNG o HEIC · Máx {MAX_SIZE_MB} MB</p>

      <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={handleChange} />
    </div>
  )
}
