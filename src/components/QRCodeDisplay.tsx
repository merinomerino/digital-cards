'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  url: string
  slug: string
}

export default function QRCodeDisplay({ url, slug }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = 200
      canvas.height = 200
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = `${slug}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-lg">
      <p className="text-sm text-slate-500 font-medium">Escanea para ver tu tarjeta</p>
      <div ref={qrRef}>
        <QRCodeSVG value={url} size={200} bgColor="#ffffff" fgColor="#000000" level="L" />
      </div>
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={downloadQR}
          className="flex-1 py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Descargar QR
        </button>
        <button
          onClick={copyLink}
          className={`flex-1 py-2 px-4 font-medium rounded-lg transition-colors text-sm ${
            copied ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {copied ? '¡Copiado!' : 'Copiar enlace'}
        </button>
      </div>
    </div>
  )
}
