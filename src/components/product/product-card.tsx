'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { Heart, ShoppingCart, Zap, Star } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getCurrency } from '@/lib/utils'
import { OriginBadge } from '@/components/ui'
import { useCartStore } from '@/store'
import { useLocale }    from '@/hooks'
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
  const addItem  = useCartStore(s => s.addItem)
  const hasItem  = useCartStore(s => s.hasItem)
  const currency = getCurrency(locale)
  const price    = getProductPrice(product, locale)
  const original = locale === 'ko' ? product.originalPriceKRW : product.originalPriceUZS
  const inCart   = hasItem(product.id)
  const primaryImg = product.images.find(i => i.isPrimary) ?? product.images[0]
  const discountPct = product.discountPercent ?? (
    original && price ? Math.round((1 - price / original) * 100) : 0
  )

  function onAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`Added to cart!`, { duration: 1800, position: 'bottom-center' })
  }

  return (
    <Link
      href={ROUTES.product(product.slug)}
      className={cn('product-card group rounded-[22px] flex flex-col', className)}
      style={style}
    >
      {/* ── Image ─────────────────────────────────────────────────────────── */}
      <div className="relative aspect-product w-full overflow-hidden rounded-t-[22px] bg-zinc-100">
        {primaryImg ? (
          <Image
            src={primaryImg.url}
            alt={primaryImg.altText}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-zinc-200">📦</div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg,#007AFF,#0052A2)', boxShadow: '0 3px 10px rgba(0,82,162,0.38)' }}>
              NEW
            </span>
          )}
          {discountPct > 0 && (
            <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#E4002B,#b8001f)', boxShadow: '0 3px 10px rgba(228,0,43,0.38)' }}>
              −{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
          aria-label="Save to wishlist"
          className={cn(
            'absolute right-2.5 top-2.5',
            'flex h-8 w-8 items-center justify-center rounded-full',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-200 hover:scale-110',
          )}
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)',
            border: '1px solid rgba(255,255,255,0.90)',
          }}
        >
          <Heart className="h-3.5 w-3.5 text-zinc-500 hover:text-red-500 transition-colors" />
        </button>

        {/* Quick-add — slides up on hover */}
        <div className={cn(
          'absolute inset-x-2.5 bottom-2.5',
          'translate-y-full group-hover:translate-y-0',
          'transition-transform duration-300 ease-out'
        )}>
          <button
            onClick={onAddToCart}
            className={cn(
              'flex w-full items-center justify-center gap-2',
              'rounded-xl py-2.5 text-sm font-bold',
              'transition-all duration-150 active:scale-95',
              inCart
                ? 'text-white'
                : 'text-zinc-900',
            )}
            style={{
              background: inCart
                ? 'linear-gradient(135deg,#10b981,#059669)'
                : 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(16px)',
              boxShadow: inCart
                ? '0 4px 14px rgba(16,185,129,0.40)'
                : '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            {inCart
              ? <><Zap className="h-3.5 w-3.5" /> In Cart ✓</>
              : <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
            }
          </button>
        </div>
      </div>

      {/* ── Info ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-3.5 pt-3">
        <div className="flex items-center justify-between gap-1">
          <OriginBadge origin={product.origin} />
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold text-zinc-500">{product.rating}</span>
          </div>
        </div>

        <p className="clamp-2 text-sm font-medium leading-snug text-zinc-800 min-h-[2.5rem] group-hover:text-zinc-900 transition-colors">
          {t(product.title)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="font-bold text-base text-zinc-900 group-hover:text-brand-600 transition-colors">
              {formatPrice(price, currency, locale)}
            </div>
            {original && original > price && (
              <div className="text-xs text-zinc-400 line-through">
                {formatPrice(original, currency, locale)}
              </div>
            )}
          </div>
          {product.soldCount > 50 && (
            <span className="text-[10.5px] text-zinc-400 whitespace-nowrap rounded-lg px-1.5 py-0.5"
              style={{ background: 'rgba(255,255,255,0.60)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.05)' }}>
              {product.soldCount.toLocaleString()}+ sold
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
