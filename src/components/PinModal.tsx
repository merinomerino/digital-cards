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
  const [error, setError] = useState(false)
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
    setError(false)
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
      } else if (res.status === 401) {
        setError(true)
        setShake(true)
        setTimeout(() => setShake(false), 500)
        setDigits(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 ${shake ? 'animate-shake' : 'animate-scale-in'}`}>
        <h2 className="text-xl font-semibold text-center mb-2">Ingresa tu PIN</h2>
        <p className="text-gray-500 text-center mb-6">Ingresa el PIN de 4 dígitos</p>

        <div className="flex justify-center gap-3 mb-6">
          {digits.map((digit, index) => (
            <input
              key={index} ref={el => { inputRefs.current[index] = el }}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)} disabled={loading}
              className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:border-mts-primary transition-colors ${error ? 'border-red-500' : 'border-gray-300'} ${loading ? 'opacity-50' : ''}`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center text-sm mb-4">PIN incorrecto</p>}

        <div className="flex justify-center">
          <button onClick={onClose} disabled={loading}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
