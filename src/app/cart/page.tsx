'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getCurrency } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useLocale }    from '@/hooks'
import { ROUTES }       from '@/config'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { locale } = useLocale()
  const { items, removeItem, updateQty, clearCart, totalUZS, totalKRW } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = locale === 'ko' ? totalKRW() : totalUZS()
  const DELIVERY = locale === 'ko' ? 3_000 : 20_000
  const FREE_THRESHOLD = locale === 'ko' ? 50_000 : 500_000
  const remaining = Math.max(0, FREE_THRESHOLD - subtotal)

  if (items.length === 0) {
    return (
      <div className="container-main py-24 text-center">
        <div className="text-6xl mb-5 animate-bounce-subtle">🛒</div>
        <h1 className="font-display text-3xl font-bold text-zinc-800 mb-2">Your cart is empty</h1>
        <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
          Looks like you haven't added anything yet. Discover amazing Korean products!
        </p>
        <Link href={ROUTES.products}>
          <button className="btn-brand h-12 px-8 inline-flex items-center gap-2 text-sm font-bold">
            🛍️ Start Shopping <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-main py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-zinc-900">
          Shopping Cart
          <span className="ml-3 text-lg font-normal text-zinc-400">({items.length} items)</span>
        </h1>
        <button onClick={() => { clearCart(); toast.success('Cart cleared') }}
          className="text-sm font-semibold text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" /> Clear All
        </button>
      </div>

      {/* Free shipping progress */}
      {remaining > 0 && (
        <div className="gl rounded-[22px] p-4 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚚</span>
              <span className="text-sm font-semibold text-zinc-700">
                Add {formatPrice(remaining, currency, locale)} more for <span className="text-emerald-600 font-bold">FREE shipping</span>
              </span>
            </div>
            <span className="text-xs text-zinc-400">{Math.round((subtotal / FREE_THRESHOLD) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / FREE_THRESHOLD) * 100)}%`,
                background: 'linear-gradient(90deg,#E4002B,#007AFF)',
              }} />
          </div>
        </div>
      )}
      {remaining === 0 && (
        <div className="gl rounded-[22px] p-4 mb-6 animate-fade-in"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-semibold text-emerald-700">You've unlocked FREE shipping!</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Cart items ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {items.map(item => {
            const img   = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
            const price = getProductPrice(item.product, locale)
            return (
              <div key={item.productId} className="gl rounded-[24px] p-4 flex gap-4 items-start animate-fade-up">
                {/* Image */}
                <Link href={ROUTES.product(item.product.slug)}>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-transform hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(255,255,255,0.80)' }}>
                    {img && <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="96px" />}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={ROUTES.product(item.product.slug)}>
                      <p className="text-sm font-semibold text-zinc-800 hover:text-red-600 transition-colors leading-snug clamp-2">
                        {item.product.title[locale] || item.product.title.uz}
                      </p>
                    </Link>
                    <button onClick={() => removeItem(item.productId)}
                      className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold rounded-full px-2 py-0.5"
                      style={{
                        background: item.product.origin === 'KR' ? 'rgba(228,0,43,0.09)' : 'rgba(0,82,162,0.09)',
                        color: item.product.origin === 'KR' ? '#b8001f' : '#003d78',
                      }}>
                      {item.product.origin === 'KR' ? '🇰🇷 Korea' : '🇺🇿 Uzbekistan'}
                    </span>
                    {item.product.stockQty <= 5 && item.product.stockQty > 0 && (
                      <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                        Only {item.product.stockQty} left
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {/* Qty stepper */}
                    <div className="flex items-center rounded-xl overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.70)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.82)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      }}>
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-zinc-900 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQty}
                        className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all disabled:opacity-30">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-zinc-900 text-sm">
                        {formatPrice(price * item.quantity, currency, locale)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-zinc-400">
                          {formatPrice(price, currency, locale)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Summary ───────────────────────────────────────────────────── */}
        <div>
          <div className="gl rounded-[28px] p-6 sticky top-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-zinc-900">Order Summary</h2>

            {/* Promo code */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  className="input pl-9 h-11 text-sm"
                  placeholder="Promo code (e.g. WELCOME10)"
                />
              </div>
              <button className="btn-glass h-11 px-4 text-sm font-semibold flex-shrink-0">Apply</button>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-zinc-700">{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Delivery</span>
                <span className={cn('font-medium', remaining === 0 ? 'text-emerald-600 font-bold' : 'text-zinc-700')}>
                  {remaining === 0 ? 'FREE' : formatPrice(DELIVERY, currency, locale)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Discount</span>
                <span className="font-medium text-zinc-700">—</span>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex justify-between font-bold text-lg text-zinc-900">
                <span>Total</span>
                <span className="text-gradient-brand">
                  {formatPrice(subtotal + (remaining === 0 ? 0 : DELIVERY), currency, locale)}
                </span>
              </div>
            </div>

            <Link href={ROUTES.checkout}>
              <button className="btn-brand w-full h-13 flex items-center justify-center gap-2.5 text-sm font-bold"
                style={{ height: 52 }}>
                <ShoppingBag className="h-4.5 w-4.5" />
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

            <Link href={ROUTES.products}>
              <button className="btn-glass w-full h-10 flex items-center justify-center gap-2 text-sm font-semibold">
                Continue Shopping
              </button>
            </Link>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100">
              {[
                { emoji: '🔒', text: 'Secure' },
                { emoji: '🚚', text: 'Fast' },
                { emoji: '↩️', text: 'Returns' },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex flex-col items-center gap-1">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-[10px] font-semibold text-zinc-400">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
