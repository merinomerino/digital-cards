'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  /** Slot ID de Google AdSense */
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

/**
 * Banner de publicidad Google AdSense.
 * Solo se renderiza en producción y cuando el script de AdSense está cargado.
 * Reemplazar data-ad-client con tu Publisher ID real (ca-pub-XXXXXXXXXXXXXXXX).
 */
export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      }
    } catch {
      // AdSense no disponible en dev
    }
  }, [])

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 text-xs ${className}`}
        style={{ minHeight: 90 }}>
        [Espacio publicitario — AdSense activo en producción]
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
