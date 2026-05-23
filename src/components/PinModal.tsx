'use client'

import { useState, useRef, useEffect } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  cardId: string
}

export default function PinModal({ isOpen, onClose, onSuccess, cardId }: Props) {
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [isOpen])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    setError(null)
    if (value && index < 3) inputRefs.current[index + 1]?.focus()
    if (newDigits.every(d => d !== '') && index === 3) verifyPin(newDigits.join(''))
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0)
      inputRefs.current[index - 1]?.focus()
  }

  const verifyPin = async (pin: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (res.ok) {
        onSuccess()
      } else if (res.status === 429) {
        setError('Demasiados intentos. Espera un momento.')
        setShake(true)
        setTimeout(() => setShake(false), 500)
        setDigits(['', '', '', ''])
        inputRefs.current[0]?.focus()
      } else if (res.status === 401) {
        setError('PIN incorrecto')
        setShake(true)
        setTimeout(() => setShake(false), 500)
        setDigits(['', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setError('Error del servidor. Inténtalo de nuevo.')
      }
    } catch { setError('Error de conexión. Inténtalo de nuevo.') }
    finally { setLoading(false) }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`mx-4 w-full max-w-sm rounded-2xl border border-white/10 bg-[#13131A] p-8 shadow-2xl shadow-black/40 ${shake ? 'animate-shake' : 'animate-scale-in'}`}>
        <h2 className="mb-2 text-center text-xl font-semibold text-white">Ingresa tu PIN</h2>
        <p className="mb-2 text-center text-slate-400">Ingresa el PIN de 4 dígitos para editar tu tarjeta</p>
        <p className="mb-6 text-center text-xs uppercase tracking-[0.24em] text-slate-500">/{cardId}</p>

        <div className="flex justify-center gap-3 mb-6">
          {digits.map((digit, index) => (
            <input
              key={index} ref={el => { inputRefs.current[index] = el }}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)} disabled={loading}
              className={`h-14 w-14 rounded-xl border-2 bg-white/5 text-center text-2xl font-bold text-white transition-colors focus:border-mts-primary ${error ? 'border-red-500' : 'border-white/10'} ${loading ? 'opacity-50' : ''}`}
            />
          ))}
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}

        <div className="flex justify-center">
          <button onClick={onClose} disabled={loading}
            className="px-6 py-2 text-slate-400 transition-colors hover:text-white disabled:opacity-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
