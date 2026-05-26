'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getCurrency } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { useLocale, useTranslations } from '@/hooks'
import { Button }       from '@/components/ui'
import { Divider }      from '@/components/ui'
import { ROUTES }       from '@/config'

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUIStore()
  const { locale, t } = useLocale()
  const { tr } = useTranslations()
  const { items, removeItem, updateQty, totalUZS, totalItems } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = totalUZS()
  const DELIVERY = 20_000

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  // Close on Escape
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
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50',
          'flex w-full max-w-[360px] flex-col',
          'bg-white dark:bg-zinc-950',
          'border-l border-zinc-100 dark:border-zinc-800',
          'shadow-card-lg',
          'transition-transform duration-300 ease-out will-change-transform',
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Shopping cart"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <ShoppingBag className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{tr('cart')}</span>
            {totalItems() > 0 && (
              <span className="rounded-full bg-zinc-900 dark:bg-white px-2 py-0.5 text-xs font-bold text-white dark:text-zinc-900">
                {totalItems()}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-4xl">
                🛒
              </div>
              <div>
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">{tr('empty_cart')}</p>
                <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                  {tr('empty_cart_hint')}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCartOpen(false)}>
                {tr('continue_shopping')}
              </Button>
            </div>
          ) : (
            items.map(item => {
              const img   = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
              const price = getProductPrice(item.product, locale)
              return (
                <div key={item.productId} className="flex gap-3 animate-fade-in">
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    {img && (
                      <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="80px" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <p className="clamp-2 text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200">
                      {t(item.product.title)}
                    </p>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      {formatPrice(price * item.quantity, currency, locale)}
                    </span>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Qty controls */}
                      <div className="flex items-center overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQty}
                          className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>{tr('subtotal')}</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>{tr('delivery')}</span>
                <span>{formatPrice(DELIVERY, currency, locale)}</span>
              </div>
              <Divider />
              <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 text-base">
                <span>{tr('total')}</span>
                <span>{formatPrice(subtotal + DELIVERY, currency, locale)}</span>
              </div>
            </div>

            <Link href={ROUTES.checkout} onClick={() => setCartOpen(false)}>
              <Button variant="primary" fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                {tr('checkout')}
              </Button>
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors py-1"
            >
              {tr('continue_shopping')}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
