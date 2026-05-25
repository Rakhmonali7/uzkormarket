'use client'

import { useState } from 'react'
import Image  from 'next/image'
import Link   from 'next/link'
import { useParams } from 'next/navigation'
import {
  Heart, Truck, RotateCcw, ShieldCheck, Minus, Plus,
  ShoppingCart, Star, ChevronRight, Share2, Zap, Package, CheckCircle,
} from 'lucide-react'
import { cn, formatPrice, getProductPrice, getProductOriginalPrice, getCurrency, timeAgo } from '@/lib/utils'
import { useProduct }  from '@/hooks'
import { useLocale, useTranslations } from '@/hooks'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { reviewsApi }   from '@/lib/api/client'
import { Rating } from '@/components/ui'
import { ROUTES } from '@/config'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug }      = useParams<{ slug: string }>()
  const { t, locale } = useLocale()
  const { tr }        = useTranslations()

  const { data: product, isLoading } = useProduct(slug as string)
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', slug],
    queryFn:  () => reviewsApi.getForProduct(slug as string),
    enabled:  Boolean(slug),
  })

  const addItem     = useCartStore(s => s.addItem)
  const hasItem     = useCartStore(s => s.hasItem)
  const setCartOpen = useUIStore(s => s.setCartOpen)

  const [activeImg, setActiveImg] = useState(0)
  const [qty,       setQty]       = useState(1)
  const [tab,       setTab]       = useState<'desc' | 'reviews'>('desc')
  const [wishlist,  setWishlist]  = useState(false)

  if (isLoading) return <DetailSkeleton />

  if (!product) {
    return (
      <div className="container-main py-24 text-center">
        <p className="text-5xl mb-5">🔍</p>
        <p className="font-display text-xl font-bold text-zinc-700 mb-2">Product not found</p>
        <Link href={ROUTES.products} className="text-red-500 hover:text-red-600 text-sm font-semibold transition-colors">
          ← Back to products
        </Link>
      </div>
    )
  }

  const currency      = getCurrency(locale)
  const price         = getProductPrice(product, locale)
  const originalPrice = getProductOriginalPrice(product, locale)
  const inCart        = hasItem(product.id)

  function handleAddToCart() {
    if (!product) return
    addItem(product, qty)
    setCartOpen(true)
    toast.success(`Added to cart! 🛒`, { duration: 2000, position: 'bottom-center' })
  }

  function handleBuyNow() {
    if (!product) return
    addItem(product, qty)
    window.location.href = ROUTES.checkout
  }

  const discountPct = product.discountPercent ?? (
    originalPrice && price ? Math.round((1 - price / originalPrice) * 100) : 0
  )

  return (
    <div className="container-main py-6 lg:py-10 pb-20">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-zinc-400 flex-wrap">
        <Link href={ROUTES.home} className="hover:text-zinc-600 transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <Link href={ROUTES.products} className="hover:text-zinc-600 transition-colors">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <Link href={ROUTES.category(product.category)} className="hover:text-zinc-600 transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-zinc-600 clamp-1 max-w-[200px]">{t(product.title)}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] lg:gap-12 xl:gap-16">

        {/* ── Images ──────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[28px]"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.80)',
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.55), 0 16px 48px rgba(0,0,0,0.08), inset 0 1.5px 0 rgba(255,255,255,0.96)',
            }}>
            {product.images[activeImg] && (
              <Image
                src={product.images[activeImg].url}
                alt={product.images[activeImg].altText}
                fill className="object-cover transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 55vw" priority
              />
            )}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="rounded-xl px-3 py-1 text-[11px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#007AFF,#0052A2)', boxShadow: '0 3px 12px rgba(0,82,162,0.40)' }}>
                  NEW
                </span>
              )}
              {discountPct > 0 && (
                <span className="rounded-xl px-3 py-1 text-[11px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#E4002B,#b8001f)', boxShadow: '0 3px 12px rgba(228,0,43,0.40)' }}>
                  −{discountPct}%
                </span>
              )}
            </div>
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button onClick={() => setWishlist(v => !v)} className="gl-icon h-10 w-10" aria-label="Wishlist">
                <Heart className={cn('h-4 w-4 transition-colors', wishlist ? 'fill-red-500 text-red-500' : 'text-zinc-500')} />
              </button>
              <button className="gl-icon h-10 w-10" aria-label="Share">
                <Share2 className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImg(i)}
                  className={cn(
                    'flex-shrink-0 relative w-[72px] h-[72px] rounded-2xl overflow-hidden transition-all duration-200',
                    i === activeImg ? 'ring-2 ring-red-500 ring-offset-2 scale-105' : 'opacity-55 hover:opacity-85 hover:scale-105',
                  )}
                  style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.80)' }}>
                  <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ─────────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Origin + Rating */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
              style={{
                background: product.origin === 'KR' ? 'rgba(228,0,43,0.09)' : 'rgba(0,82,162,0.09)',
                border: `1px solid ${product.origin === 'KR' ? 'rgba(228,0,43,0.18)' : 'rgba(0,82,162,0.18)'}`,
                color: product.origin === 'KR' ? '#b8001f' : '#003d78',
              }}>
              {product.origin === 'KR' ? '🇰🇷 Korean Product' : '🇺🇿 Uzbek Product'}
            </span>
            <div className="flex items-center gap-1.5">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-[28px] font-bold text-zinc-900 leading-tight">
            {t(product.title)}
          </h1>

          {/* Price box */}
          <div className="gl rounded-[22px] p-5">
            <div className="flex items-end gap-3 flex-wrap">
              <span className="font-display text-[34px] font-bold text-gradient-brand leading-none">
                {formatPrice(price, currency, locale)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-lg text-zinc-400 line-through mb-1">
                  {formatPrice(originalPrice, currency, locale)}
                </span>
              )}
              {discountPct > 0 && (
                <span className="mb-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#E4002B,#b8001f)', boxShadow: '0 3px 10px rgba(228,0,43,0.32)' }}>
                  Save {discountPct}%
                </span>
              )}
            </div>
            {locale !== 'ko' && product.priceKRW > 0 && (
              <p className="text-[11px] text-zinc-400 mt-1.5">≈ ₩{product.priceKRW.toLocaleString()} KRW</p>
            )}
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap gap-2">
            <div className="gl-pill flex items-center gap-2 px-3.5 py-2">
              {product.stockQty > 0 ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[12px] font-semibold text-zinc-600">
                    {product.stockQty <= 10 ? `Only ${product.stockQty} left!` : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <Package className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-[12px] font-semibold text-zinc-400">Out of Stock</span>
                </>
              )}
            </div>
            <div className="gl-pill flex items-center gap-2 px-3.5 py-2">
              <Truck className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-[12px] font-semibold text-zinc-600">{product.shippingDays}-day delivery</span>
            </div>
            <div className="gl-pill flex items-center gap-2 px-3.5 py-2">
              <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[12px] font-semibold text-zinc-600">14-day returns</span>
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-zinc-700">Quantity</span>
            <div className="flex items-center rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.85)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-zinc-900 text-sm">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stockQty, q + 1))}
                disabled={qty >= product.stockQty}
                className="flex h-10 w-10 items-center justify-center text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all disabled:opacity-30">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {product.soldCount > 0 && (
              <span className="text-xs text-zinc-400">{product.soldCount.toLocaleString()}+ sold</span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={product.stockQty === 0}
              className={cn(
                'flex-1 flex items-center justify-center gap-2.5 h-[52px] rounded-2xl text-sm font-bold transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                inCart ? 'text-emerald-700' : 'text-zinc-700',
              )}
              style={{
                background: inCart ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.78)',
                backdropFilter: 'blur(20px)',
                border: inCart ? '1.5px solid rgba(16,185,129,0.25)' : '1.5px solid rgba(255,255,255,0.88)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1.5px 0 rgba(255,255,255,0.92)',
              }}>
              {inCart ? <><Zap className="h-4 w-4" />In Cart ✓</> : <><ShoppingCart className="h-4 w-4" />Add to Cart</>}
            </button>
            <button onClick={handleBuyNow} disabled={product.stockQty === 0}
              className="btn-brand flex-1 flex items-center justify-center gap-2.5 text-sm disabled:opacity-50"
              style={{ height: 52, borderRadius: 16 }}>
              <Zap className="h-4 w-4" />Buy Now
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-5 pt-1 border-t border-zinc-100">
            {[
              { icon: ShieldCheck, label: 'Secure checkout', color: '#10b981' },
              { icon: RotateCcw,   label: 'Free returns',    color: '#f59e0b' },
              { icon: Truck,       label: 'Fast shipping',   color: '#007AFF' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Icon className="h-3.5 w-3.5" style={{ color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Description / Reviews tabs */}
          <div className="pt-2">
            <div className="flex gap-1 mb-5 p-1 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.60)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.80)' }}>
              {(['desc', 'reviews'] as const).map(tb => (
                <button key={tb} onClick={() => setTab(tb)}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                    tab === tb ? 'text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700',
                  )}
                  style={tab === tb ? {
                    background: 'linear-gradient(135deg,#E4002B,#b8001f)',
                    boxShadow: '0 4px 14px rgba(228,0,43,0.28)',
                  } : {}}>
                  {tb === 'desc' ? 'Description' : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            {tab === 'desc' ? (
              <div className="gl rounded-[20px] p-5">
                <p className="text-sm text-zinc-600 leading-relaxed">{t(product.description)}</p>
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100/80">
                    {product.tags.map(tag => (
                      <span key={tag} className="gl-pill px-2.5 py-1 text-[11px] font-semibold text-zinc-500">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="gl rounded-[20px] p-8 text-center">
                    <p className="text-2xl mb-2">💬</p>
                    <p className="text-sm text-zinc-400">No reviews yet. Be the first!</p>
                  </div>
                ) : reviews.map(review => (
                  <div key={review.id} className="gl rounded-[20px] p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#E4002B,#0052A2)' }}>
                          {review.userName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-zinc-800">{review.userName}</p>
                            {review.verifiedPurchase && (
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-md px-1.5 py-0.5">✓ Verified</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400">{timeAgo(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={cn('h-3.5 w-3.5', s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200')} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">{review.body}</p>
                    {review.helpful > 0 && (
                      <p className="text-[11px] text-zinc-400 mt-2">{review.helpful} found helpful</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="container-main py-10 pb-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
        <div className="space-y-3">
          <div className="skeleton aspect-square w-full rounded-[28px]" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="skeleton w-[72px] h-[72px] rounded-2xl" />)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-6 w-32 rounded-full" />
          <div className="skeleton h-10 w-full rounded-2xl" />
          <div className="skeleton h-24 w-full rounded-[22px]" />
          <div className="skeleton h-12 w-full rounded-2xl" />
          <div className="skeleton h-[52px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
