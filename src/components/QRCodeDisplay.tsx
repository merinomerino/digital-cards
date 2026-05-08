'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  url: string
  slug: string
}

export default function QRCodeDisplay({ url, slug }: QRCodeDisplayProps) {
  const [downloaded, setDownloaded] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const SIZE = 400
    const PADDING = 32
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = SIZE + PADDING * 2
    canvas.height = SIZE + PADDING * 2
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // White background with padding
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, PADDING, PADDING, SIZE, SIZE)
      const link = document.createElement('a')
      link.download = `${slug}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    }
    // Use encodeURIComponent to handle unicode in SVG
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col items-center gap-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Código QR
      </p>

      {/* QR con fondo blanco visible */}
      <div
        ref={qrRef}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <QRCodeSVG
          value={url}
          size={180}
          bgColor="#ffffff"
          fgColor="#0f172a"
          level="M"
        />
      </div>

      {/* URL legible */}
      <p className="text-xs text-slate-500 break-all text-center max-w-[240px]">{url}</p>

      {/* Botón descargar */}
      <button
        onClick={downloadQR}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
          downloaded
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-700 hover:bg-slate-600 text-white'
        }`}
      >
        {downloaded ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ¡Descargado!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar QR
          </>
        )}
      </button>
    </div>
  )
}
