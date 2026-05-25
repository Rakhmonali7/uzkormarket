'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config'

export function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // Show popup after 600ms — let page load first
    // Only once per session
    const shown = sessionStorage.getItem('popup_shown')
    if (!shown) {
      const t = setTimeout(() => { setVisible(true); sessionStorage.setItem('popup_shown', '1') }, 600)
      return () => clearTimeout(t)
    }
  }, [])

  function close() {
    setClosing(true)
    setTimeout(() => setVisible(false), 280)
  }

  if (!visible) return null

  return (
    <div
      className={cn(
        'popup-overlay transition-opacity duration-300',
        closing ? 'opacity-0' : 'opacity-100'
      )}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div className={cn('popup-card', !closing && 'animate-pop-in')}>

        {/* Banner */}
        <div className="relative h-48 overflow-hidden flex items-center justify-center"
          style={{ background: 'rgba(18,18,20,0.94)', backdropFilter: 'blur(32px)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.07) 0%,transparent 60%)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.30) 50%,transparent)' }} />
          <div className="relative z-10 flex items-center gap-5 text-5xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.50))' }}>
            <span>🇰🇷</span>
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.40)' }}>→</span>
            <span>🇺🇿</span>
          </div>
          {/* Limited time badge */}
          <div className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-[11px] font-bold text-white/80"
            style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)' }}>
            Limited Time
          </div>
          {/* Close button */}
          <button onClick={close}
            className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
            style={{ background: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.15)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-cobalt-500 animate-glow-pulse" />
            <span className="text-[11.5px] font-bold text-cobalt-600">Special Welcome Offer</span>
          </div>

          <h2 className="font-display text-[26px] font-bold text-zinc-900 leading-tight mb-3">
            Get <span className="text-gradient-brand">10% OFF</span> Your First Korean Order
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed mb-5">
            Authentic Korean beauty, food &amp; wellness — delivered straight to Uzbekistan.
            Use code <strong className="text-zinc-800 font-bold">WELCOME10</strong> at checkout.
          </p>

          {/* Offer pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['✨ K-Beauty', '🍜 Korean Food', '💊 Health', '🚚 Fast Delivery'].map(p => (
              <span key={p} className="gl-pill px-3 py-1.5 text-xs font-semibold text-zinc-600">{p}</span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href={ROUTES.products} onClick={close} className="flex-1">
              <button className={cn(
                'btn-brand w-full h-12 flex items-center justify-center gap-2 text-sm font-bold'
              )}>
                🇰🇷 Shop Korean Products
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <button onClick={close}
              className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all text-lg font-light">
              ✕
            </button>
          </div>

          <p onClick={close}
            className="text-center text-xs text-zinc-300 hover:text-zinc-500 mt-4 cursor-pointer transition-colors">
            No thanks, skip offer
          </p>
        </div>
      </div>
    </div>
  )
}
