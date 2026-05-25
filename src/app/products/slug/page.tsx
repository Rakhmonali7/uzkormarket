'use client'

import { useState } from 'react'
import Image  from 'next/image'
import Link   from 'next/link'
import { useParams } from 'next/navigation'
import { Heart, Truck, RotateCcw, ShieldCheck, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { cn, formatPrice, getProductPrice, getProductOriginalPrice, getCurrency, timeAgo } from '@/lib/utils'
import { useProduct }  from '@/hooks'
import { useLocale, useTranslations } from '@/hooks'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { reviewsApi }   from '@/lib/api/client'
import { Button, Badge, OriginBadge, Rating, Skeleton } from '@/components/ui'
import { ROUTES } from '@/config'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug }      = useParams<{ slug: string }>()
  const { t, locale } = useLocale()
  const { tr }        = useTranslations()

  const { data: product, isLoading } = useProduct(slug as string)
  const { data: reviews } = useQuery({
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

  if (isLoading) return <DetailSkeleton />

  if (!product) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="font-semibold text-stone-700 dark:text-stone-300">Mahsulot topilmadi</p>
        <Link href={ROUTES.products} className="mt-4 inline-block text-brand-500 hover:underline">← Mahsulotlarga qaytish</Link>
      </div>
    )
  }

  const currency      = getCurrency(locale)
  const price         = getProductPrice(product, locale)
  const originalPrice = getProductOriginalPrice(product, locale)
  const inCart        = hasItem(product.id)

  function handleAddToCart() {
    addItem(product!, qty)
    setCartOpen(true)
    toast.success(`Savatga qo'shildi!`)
  }

  return (
    <div className="container-main py-6 lg:py-10 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-stone-400 dark:text-stone-500">
        <Link href={ROUTES.home}     className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Bosh sahifa</Link>
        <span>/</span>
        <Link href={ROUTES.products} className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors">Mahsulotlar</Link>
        <span>/</span>
        <span className="truncate text-stone-600 dark:text-stone-400 max-w-[200px]">{t(product.title)}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">

        {/* ── Left: Images ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-800">
            {product.images[activeImg] && (
              <Image
                src={product.images[activeImg].url}
                alt={product.images[activeImg].altText}
                fill priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            {product.discountPercent && (
              <div className="absolute left-4 top-4">
                <Badge variant="danger" size="md">−{product.discountPercent}%</Badge>
              </div>
            )}
            {product.isNew && (
              <div className="absolute left-4 top-4 mt-8">
                <Badge variant="new" size="md">Yangi</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200',
                    activeImg === i
                      ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-stone-900'
                      : 'opacity-55 hover:opacity-90 hover:ring-1 hover:ring-stone-300 dark:hover:ring-stone-600'
                  )}
                >
                  <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Info ────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <OriginBadge origin={product.origin} />
            {product.stockQty > 0 && product.stockQty < 10 && (
              <Badge variant="warning">Faqat {product.stockQty} ta qoldi</Badge>
            )}
            {product.stockQty === 0 && (
              <Badge variant="muted">{tr('out_of_stock')}</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl font-bold leading-tight text-stone-900 dark:text-white sm:text-3xl text-pretty">
            {t(product.title)}
          </h1>

          {/* Rating + sold */}
          <div className="flex items-center gap-3 flex-wrap">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {product.soldCount.toLocaleString()} marta sotilgan
            </span>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-900 dark:text-white">
                {formatPrice(price, currency, locale)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-lg text-stone-400 line-through dark:text-stone-500">
                    {formatPrice(originalPrice, currency, locale)}
                  </span>
                  <Badge variant="danger">{product.discountPercent}% chegirma</Badge>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
              Taxminiy yetkazish: {product.shippingDays} kun
            </p>
          </div>

          {/* Qty + Cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{tr('qty')}:</span>
              <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-stone-900 dark:text-stone-100">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stockQty, q + 1))}
                  disabled={qty >= product.stockQty}
                  className="flex h-10 w-10 items-center justify-center text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-stone-400 dark:text-stone-500">{product.stockQty} ta mavjud</span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary" size="lg" fullWidth
                onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                leftIcon={<ShoppingCart className="h-5 w-5" />}
              >
                {inCart ? '✓ Savatda' : tr('add_to_cart')}
              </Button>
              <Button variant="outline" size="lg" aria-label={tr('save_to_wishlist')}>
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Trust card */}
          <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 p-4 space-y-3">
            {[
              { icon: Truck,       text: `${product.shippingDays} kun ichida yetkazish` },
              { icon: RotateCcw,   text: '14 kun qaytarish kafolati'                    },
              { icon: ShieldCheck, text: 'Tasdiqlangan sotuvchi, xaridor himoyasi'       },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-stone-600 dark:text-stone-400">
                <Icon className="h-4 w-4 text-brand-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Reviews ────────────────────────────────────── */}
      <div className="mt-12 lg:mt-16">
        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 mb-8 gap-1">
          {([
            { key: 'desc',    label: 'Tavsif'    },
            { key: 'reviews', label: `${tr('reviews')} (${product.reviewCount})` },
          ] as const).map(tab_ => (
            <button
              key={tab_.key}
              onClick={() => setTab(tab_.key)}
              className={cn(
                'px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors',
                tab === tab_.key
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
              )}
            >
              {tab_.label}
            </button>
          ))}
        </div>

        {/* Description */}
        {tab === 'desc' && (
          <div className="prose prose-stone dark:prose-invert max-w-3xl animate-fade-in">
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-base">
              {t(product.description)}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 not-prose">
              {[
                { label: 'Kelib chiqishi', value: product.origin === 'KR' ? '🇰🇷 Korea' : '🇺🇿 O\'zbekiston' },
                { label: 'Yetkazish',      value: `${product.shippingDays} kun`            },
                { label: 'Reyting',        value: `${product.rating} / 5`                  },
                { label: 'Sotilgan',       value: product.soldCount.toLocaleString()        },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-stone-100 dark:border-stone-800 p-3.5">
                  <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">{label}</p>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className="space-y-5 max-w-3xl animate-fade-in">
            {!reviews?.length && (
              <p className="text-stone-400 dark:text-stone-500 text-sm">Hali sharhlar yo'q.</p>
            )}
            {reviews?.map(review => (
              <div key={review.id} className="rounded-2xl border border-stone-100 dark:border-stone-800 p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-sm font-bold text-brand-700 dark:text-brand-300">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{review.userName}</p>
                      {review.verifiedPurchase && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Tasdiqlangan xarid</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Rating value={review.rating} size="sm" />
                    <p className="text-xs text-stone-400 mt-0.5">{timeAgo(review.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{review.body}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">
                  {review.helpful} kishi foydali deb topdi
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="container-main py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-5">
          <Skeleton className="h-6  w-28 rounded-full" />
          <Skeleton className="h-10 w-4/5 rounded-xl" />
          <Skeleton className="h-5  w-36 rounded-lg"  />
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
