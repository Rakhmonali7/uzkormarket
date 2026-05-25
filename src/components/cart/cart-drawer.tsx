'use client'

import { useEffect } from 'react'
import Link  from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getCurrency } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { useLocale }    from '@/hooks'
import { ROUTES }       from '@/config'

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUIStore()
  const { locale } = useLocale()
  const { items, removeItem, updateQty, totalUZS, totalKRW, totalItems } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = locale === 'ko' ? totalKRW() : totalUZS()
  const DELIVERY = locale === 'ko' ? 3_000 : 20_000

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setCartOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [setCartOpen])

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in"
          style={{ background: 'rgba(10,10,24,0.50)', backdropFilter: 'blur(8px)' }}
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[380px] flex-col',
          'transition-transform duration-300 ease-out will-change-transform',
          cartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(48px) saturate(2.2)',
          borderLeft: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.15), inset 1px 0 0 rgba(255,255,255,0.90)',
        }}
        aria-label="Shopping cart" role="dialog"
      >
        {/* Top stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.90) 50%,transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.65)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: 'rgba(228,0,43,0.09)', border: '1px solid rgba(228,0,43,0.14)' }}>
              <ShoppingBag className="h-4 w-4 text-red-500" />
            </div>
            <span className="font-semibold text-zinc-900">Cart</span>
            {totalItems() > 0 && (
              <span className="rounded-full px-2 py-0.5 text-xs font-bold text-red-600"
                style={{ background: 'rgba(228,0,43,0.09)', border: '1px solid rgba(228,0,43,0.14)' }}>
                {totalItems()}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-white/70 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
              <div className="text-5xl animate-bounce-subtle">🛒</div>
              <div>
                <p className="font-semibold text-zinc-700">Your cart is empty</p>
                <p className="mt-1 text-sm text-zinc-400">Add some amazing Korean products!</p>
              </div>
              <button onClick={() => setCartOpen(false)}
                className="btn-brand h-10 px-5 text-sm font-bold flex items-center gap-2">
                Browse Products
              </button>
            </div>
          ) : items.map(item => {
            const img   = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
            const price = getProductPrice(item.product, locale)
            return (
              <div key={item.productId} className="flex gap-3 animate-fade-in">
                {/* Thumb */}
                <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(255,255,255,0.80)' }}>
                  {img && <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="72px" />}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                  <p className="clamp-2 text-sm font-medium leading-snug text-zinc-800">
                    {item.product.title[locale] || item.product.title.uz}
                  </p>
                  <span className="text-sm font-bold text-zinc-900">
                    {formatPrice(price * item.quantity, currency, locale)}
                  </span>
                  <div className="flex items-center justify-between mt-auto">
                    {/* Qty */}
                    <div className="flex items-center overflow-hidden rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.70)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.82)',
                      }}>
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all">
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-zinc-900">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQty}
                        className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all disabled:opacity-30">
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeItem(item.productId)}
                      className="flex h-7 w-7 items-center justify-center rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 space-y-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.55)' }}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Delivery</span>
                <span>{formatPrice(DELIVERY, currency, locale)}</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-900 text-base pt-2"
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <span>Total</span>
                <span className="text-gradient-brand">{formatPrice(subtotal + DELIVERY, currency, locale)}</span>
              </div>
            </div>

            <Link href={ROUTES.checkout} onClick={() => setCartOpen(false)}>
              <button className="btn-brand w-full h-12 flex items-center justify-center gap-2 text-sm font-bold">
                <ShoppingBag className="h-4 w-4" />
                Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href={ROUTES.cart} onClick={() => setCartOpen(false)}>
              <button className="btn-glass w-full h-10 flex items-center justify-center text-sm font-semibold">
                View Cart
              </button>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
