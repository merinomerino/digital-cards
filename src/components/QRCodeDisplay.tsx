'use client'

import { useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  url: string
  slug: string
}

export default function QRCodeDisplay({ url, slug }: QRCodeDisplayProps) {
  const [downloaded, setDownloaded] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const cardUrl = useMemo(() => {
    if (typeof window === 'undefined') return url
    return `${window.location.origin}/${slug}`
  }, [slug, url])

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const size = 400
    const padding = 40
    const footer = 110
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = size + padding * 2
    canvas.height = size + padding * 2 + footer
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()

    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#F8FAFC'
      ctx.fillRect(24, 24, canvas.width - 48, canvas.height - 48)
      ctx.fillStyle = '#0F172A'
      ctx.font = '700 28px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Escanéame', canvas.width / 2, 36)
      ctx.drawImage(img, padding, padding, size, size)

      ctx.fillStyle = '#6366F1'
      ctx.beginPath()
      ctx.roundRect(canvas.width / 2 - 74, size + padding + 20, 148, 44, 14)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 24px Inter, sans-serif'
      ctx.fillText('CardLink', canvas.width / 2, size + padding + 49)

      ctx.fillStyle = '#64748B'
      ctx.font = '16px Inter, sans-serif'
      ctx.fillText('Tarjeta digital lista para compartir', canvas.width / 2, size + padding + 84)

      const link = document.createElement('a')
      link.download = `${slug}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    }

    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#13131A] to-[#0f172a] p-6 shadow-xl shadow-black/20">
      <div className="mb-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300/80">Código QR</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Escanéame</h3>
        <p className="mt-1 text-sm text-slate-400">Comparte tu tarjeta en segundos desde cualquier dispositivo.</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div
          ref={qrRef}
          className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.22)]"
        >
          <QRCodeSVG
            value={cardUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
          />
        </div>

        <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-200">
          Descarga un PNG con branding de CardLink
        </div>

        <p className="max-w-[240px] break-all text-center text-xs text-slate-500">{cardUrl}</p>
      </div>

      <button
        onClick={downloadQR}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
          downloaded
            ? 'bg-emerald-500 text-white'
            : 'bg-white/6 text-white hover:bg-white/10'
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
