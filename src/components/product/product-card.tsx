'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { Heart, ShoppingCart, Zap } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getCurrency } from '@/lib/utils'
import { Badge, OriginBadge, Rating } from '@/components/ui'
import { useCartStore } from '@/store'
import { useLocale, useTranslations }    from '@/hooks'
import { ROUTES }       from '@/config'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product:    Product
  className?: string
  style?:     React.CSSProperties
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  const { t, locale } = useLocale()
  const { tr } = useTranslations()
  const addItem  = useCartStore(s => s.addItem)
  const hasItem  = useCartStore(s => s.hasItem)
  const currency = getCurrency(locale)
  const price    = getProductPrice(product, locale)
  const original = product.originalPriceUZS
  const inCart   = hasItem(product.id)
  const primaryImg = product.images.find(i => i.isPrimary) ?? product.images[0]
  const discountPct = product.discountPercent ?? (
    original && price ? Math.round((1 - price / original) * 100) : 0
  )

  function onAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(tr('add_to_cart'), { duration: 1800, position: 'bottom-center' })
  }

  return (
    <Link
      href={ROUTES.product(product.slug)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-white dark:bg-zinc-900',
        'border border-zinc-100 dark:border-zinc-800',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:shadow-card-lg hover:border-zinc-200 dark:hover:border-zinc-700',
        className
      )}
      style={style}
    >
      {/* ── Image area ─────────────────────────────────────────────────── */}
      <div className="relative aspect-product w-full overflow-hidden bg-zinc-50 dark:bg-zinc-800">
        {primaryImg ? (
          <Image
            src={primaryImg.url}
            alt={primaryImg.altText}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-zinc-200 dark:text-zinc-700">📦</div>
        )}

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges — top left */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-lg bg-cobalt-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-cobalt">
              NEW
            </span>
          )}
          {discountPct > 0 && (
            <span className="rounded-lg bg-[#1C1C1E] px-2 py-0.5 text-[10px] font-bold text-white shadow-brand">
              −{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist — top right, appears on hover */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
          aria-label={tr('save_to_wishlist')}
          className={cn(
            'absolute right-2.5 top-2.5',
            'flex h-8 w-8 items-center justify-center rounded-full',
            'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm',
            'text-zinc-400 hover:text-red-500 dark:hover:text-red-400',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-200 hover:scale-110 shadow-soft'
          )}
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Quick add — slides up on hover */}
        <div className={cn(
          'absolute inset-x-2 bottom-2',
          'translate-y-full group-hover:translate-y-0',
          'transition-transform duration-300 ease-out'
        )}>
          <button
            onClick={onAddToCart}
            className={cn(
              'flex w-full items-center justify-center gap-2',
              'rounded-xl py-2.5 text-sm font-bold',
              'backdrop-blur-sm transition-all duration-150',
              'active:scale-95 shadow-glass',
              inCart
                ? 'bg-emerald-500/95 text-white'
                : 'bg-white/95 text-zinc-900 hover:bg-white dark:bg-zinc-900/95 dark:text-white dark:hover:bg-zinc-900'
            )}
          >
            {inCart
              ? <><Zap className="h-4 w-4" /> {locale === 'uz' ? 'Savatda ✓' : 'In Cart ✓'}</>
              : <><ShoppingCart className="h-4 w-4" /> {tr('add_to_cart')}</>
            }
          </button>
        </div>
      </div>

      {/* ── Product info ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-center justify-between gap-1">
          <OriginBadge origin={product.origin} />
          <Rating value={product.rating} size="sm" />
        </div>

        <p className="clamp-2 text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200 min-h-[2.5rem] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
          {t(product.title)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className={cn(
              'font-bold text-base',
              'text-zinc-900 dark:text-zinc-50',
              'group-hover:text-cobalt-600 dark:group-hover:text-cobalt-400 transition-colors'
            )}>
              {formatPrice(price, currency, locale)}
            </div>
            {original && original > price && (
              <div className="text-xs text-zinc-400 line-through">
                {formatPrice(original, currency, locale)}
              </div>
            )}
          </div>
          {product.soldCount > 50 && (
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap bg-zinc-50 dark:bg-zinc-800 rounded-md px-1.5 py-0.5 flex-shrink-0">
              {product.soldCount.toLocaleString()}+ {locale === 'uz' ? 'sotilgan' : 'sold'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
