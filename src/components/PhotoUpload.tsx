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

    // Mostrar preview local inmediato
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

  const getInitials = (url: string) =>
    url ? '' : slug.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar / preview */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full overflow-hidden bg-indigo-500/20 border-4 border-indigo-400/50 flex items-center justify-center cursor-pointer"
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-indigo-400">
              {getInitials(preview)}
            </span>
          )}

          {/* Overlay de carga */}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center">
              <span className="text-white font-bold text-sm">{progress}%</span>
            </div>
          )}
        </div>

        {/* Botón cámara */}
        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 rounded-full flex items-center justify-center shadow-lg transition-colors"
            title="Cambiar foto"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full max-w-xs bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Botones de acción */}
      {!disabled && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:text-slate-400 transition-colors"
          >
            📷 {preview ? 'Cambiar foto' : 'Agregar foto'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(''); onChange('') }}
              disabled={uploading}
              className="text-sm text-red-400 hover:text-red-600 disabled:text-slate-400 transition-colors"
            >
              Quitar
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <p className="text-xs text-slate-400 text-center">
        JPG, PNG o HEIC · Máx {MAX_SIZE_MB} MB
      </p>

      {/* Input oculto — capture permite cámara en móvil */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
