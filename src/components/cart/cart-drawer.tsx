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
  const { locale } = useLocale()
  const { tr }     = useTranslations()
  const { items, removeItem, updateQty, totalUZS, totalKRW, totalItems } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = locale === 'ko' ? totalKRW() : totalUZS()
  const DELIVERY = locale === 'ko' ? 3_000 : 20_000

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
          className="fixed inset-0 z-40 bg-stone-950/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50',
          'flex w-full max-w-[360px] flex-col',
          'bg-white dark:bg-stone-950',
          'border-l border-stone-100 dark:border-stone-800',
          'shadow-card-lg',
          'transition-transform duration-300 ease-out will-change-transform',
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Shopping cart"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
              <ShoppingBag className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{tr('cart')}</span>
            {totalItems() > 0 && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {totalItems()}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-100 dark:bg-stone-800 text-4xl">
                🛒
              </div>
              <div>
                <p className="font-semibold text-stone-700 dark:text-stone-300">{tr('empty_cart')}</p>
                <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
                  Mahsulot qo'shing va qaytib keling
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
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
                    {img && (
                      <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="80px" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <p className="clamp-2 text-sm font-medium leading-snug text-stone-800 dark:text-stone-200">
                      {item.product.title[locale] || item.product.title.uz}
                    </p>
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      {formatPrice(price * item.quantity, currency, locale)}
                    </span>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Qty */}
                      <div className="flex items-center overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-stone-800 dark:text-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQty}
                          className="flex h-7 w-7 items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
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
          <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 space-y-3 bg-stone-50/50 dark:bg-stone-900/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Yetkazish</span>
                <span>{formatPrice(DELIVERY, currency, locale)}</span>
              </div>
              <Divider />
              <div className="flex justify-between font-bold text-stone-900 dark:text-stone-100 text-base">
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
              className="w-full text-center text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors py-1"
            >
              {tr('continue_shopping')}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
