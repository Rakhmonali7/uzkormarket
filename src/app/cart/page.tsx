'use client'

import Link  from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getCurrency } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useLocale, useTranslations } from '@/hooks'
import { Button, Divider, EmptyState } from '@/components/ui'
import { ROUTES } from '@/config'

export default function CartPage() {
  const { locale } = useLocale()
  const { tr }     = useTranslations()
  const { items, removeItem, updateQty, clearCart, totalUZS, totalKRW } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = locale === 'ko' ? totalKRW() : totalUZS()
  const DELIVERY = locale === 'ko' ? 3_000 : 20_000
  const total    = subtotal + DELIVERY

  if (!items.length) {
    return (
      <div className="container-main py-16">
        <EmptyState
          icon="🛒"
          title={tr('empty_cart')}
          description="Mahsulot qo'shing va qaytib keling"
          action={
            <Link href={ROUTES.products}>
              <Button variant="primary">{tr('continue_shopping')}</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-main py-8 pb-16">
      {/* Header */}
      <div className="mb-7 flex items-center gap-4">
        <Link
          href={ROUTES.products}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {tr('continue_shopping')}
        </Link>
        <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
        <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-white">
          {tr('cart')} <span className="text-stone-400 dark:text-stone-500 font-sans text-lg font-normal">({items.length})</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          {items.map(item => {
            const img   = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
            const price = getProductPrice(item.product, locale)
            return (
              <div
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 animate-fade-in"
              >
                <Link href={ROUTES.product(item.product.slug)} className="flex-shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
                    {img && <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="112px" />}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <Link
                    href={ROUTES.product(item.product.slug)}
                    className="clamp-2 font-semibold text-stone-800 dark:text-stone-200 hover:text-brand-500 transition-colors text-sm leading-snug"
                  >
                    {item.product.title[locale] || item.product.title.uz}
                  </Link>
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    {item.product.origin === 'KR' ? '🇰🇷 Korea' : '🇺🇿 O\'zbekiston'}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 flex-wrap">
                    {/* Qty */}
                    <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-stone-900 dark:text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQty}
                        className="flex h-8 w-8 items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 dark:text-white">
                        {formatPrice(price * item.quantity, currency, locale)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={clearCart}
            className="text-sm text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Savatni tozalash
          </button>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4 sticky top-28">
            <h2 className="font-display text-lg font-bold text-stone-900 dark:text-white">
              {tr('order_summary')}
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} ta)</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Yetkazish</span>
                <span>{formatPrice(DELIVERY, currency, locale)}</span>
              </div>
            </div>

            <Divider />

            <div className="flex justify-between font-bold text-stone-900 dark:text-white text-base">
              <span>{tr('total')}</span>
              <span>{formatPrice(total, currency, locale)}</span>
            </div>

            <Link href={ROUTES.checkout}>
              <Button variant="primary" size="lg" fullWidth>
                {tr('checkout')} →
              </Button>
            </Link>

            {/* Promo */}
            <div className="pt-1">
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">Promo kod</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kodni kiriting"
                  className="input flex-1 h-9 text-sm"
                />
                <Button variant="secondary" size="sm">Qo'llash</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
