'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, RotateCcw, Truck, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, CATEGORIES } from '@/config'
import { ProductGrid } from '@/components/product/product-grid'
import { useFeaturedProducts } from '@/hooks'
import { useLocale, useTranslations } from '@/hooks'

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const { locale } = useLocale()
  const { tr } = useTranslations()

  const headline = locale === 'uz'
    ? (<>Koreyaning eng yaxshi mahsulotlari,<br /><span className="text-gradient-brand">eshigingizga yetkaziladi</span></>)
    : (<>Shop the Best of <span className="text-gradient-brand">Korea</span>,<br />Delivered to Your Door</>)

  const subline = locale === 'uz'
    ? "K-beauty, Koreya oziq-ovqatlari, elektronika va sog'liq mahsulotlari — tasdiqlangan Koreya sotuvchilaridan O'zbekistonga yetkaziladi."
    : "K-beauty, Korean food, electronics & wellness — sourced directly from verified Korean sellers and shipped to Uzbekistan."

  const eyebrow = locale === 'uz'
    ? "Haqiqiy Koreya mahsulotlari · O'zbekistonga yetkazish"
    : "Authentic Korean Products · Delivered to Uzbekistan"

  const trust = locale === 'uz'
    ? ['✓ Tasdiqlangan Koreya sotuvchilari', '🚚 7–14 kunlik yetkazish', '🔒 Unired to\'lov', '↩️ 14 kunlik qaytarish']
    : ['✓ Verified Korean Sellers', '🚚 7–14 Day Delivery', '🔒 Unired Payment', '↩️ 14-Day Returns']

  return (
    <section className="container-main pt-8">
      <div className="gl rounded-[28px] p-10 sm:p-14 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.03] bg-cobalt-500 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full opacity-[0.04] bg-brand-500 blur-3xl pointer-events-none" />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 gl-pill px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-cobalt-500 animate-glow-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{eyebrow}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.08] text-zinc-900 dark:text-white text-balance mb-4" style={{ letterSpacing: '-1.5px' }}>
          {headline}
        </h1>

        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[440px] mb-8">
          {subline}
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={ROUTES.products}>
            <button className="btn-brand h-12 px-7 flex items-center gap-2 text-sm font-bold">
              🇰🇷 {tr('browse_products')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href={ROUTES.search('sale')}>
            <button className="btn-glass h-12 px-6 flex items-center gap-2 text-sm">🔥 {tr('sale_items')}</button>
          </Link>
          <Link href={ROUTES.search('new')}>
            <button className="btn-glass h-12 px-6 flex items-center gap-2 text-sm">🆕 {tr('new_arrivals')}</button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {trust.map(t => (
            <span key={t} className="gl-pill px-3 py-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Promo Banner ──────────────────────────────────────────────────────────────
export function PromoBanner() {
  const { locale } = useLocale()

  const title = locale === 'uz'
    ? "Xush kelibsiz — Birinchi buyurtmaga 10% chegirma"
    : "Welcome Offer — 10% Off First Order"

  const desc = locale === 'uz'
    ? (<>Har qanday Koreya mahsulotiga <strong className="text-white/90 font-bold">WELCOME10</strong> kodini ishlating</>)
    : (<>Use code <strong className="text-white/90 font-bold">WELCOME10</strong> at checkout on any Korean product</>)

  const cta = locale === 'uz' ? "Olish" : "Claim Offer"

  return (
    <section className="container-main">
      <div className="gl-dark rounded-3xl px-8 py-7 flex items-center gap-6 relative">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[88px] opacity-[0.04] pointer-events-none select-none">🎁</div>
        <span className="text-4xl relative z-10" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.40))' }}>🎁</span>
        <div className="flex-1 relative z-10">
          <h3 className="font-display text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/55">{desc}</p>
        </div>
        <button
          className="flex-shrink-0 h-10 px-5 rounded-full flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-all relative z-10"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.16)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}>
          {cta} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  )
}

// ─── Trust Bar ─────────────────────────────────────────────────────────────────
export function TrustBar() {
  const { locale } = useLocale()

  const items = locale === 'uz'
    ? [
        { icon: ShieldCheck, label: 'Tasdiqlangan Koreya sotuvchilari', sub: "Har bir sotuvchi tekshirilgan",    color: 'text-brand-600 dark:text-brand-400' },
        { icon: Truck,       label: '7–14 kunlik yetkazish',            sub: "O'zbekistonga eshikgacha",         color: 'text-cobalt-500' },
        { icon: ShieldCheck, label: 'Unired xavfsiz to\'lov',           sub: "Xavfsiz tekshiruv kafolati",       color: 'text-emerald-500' },
        { icon: RotateCcw,   label: '14 kunlik qaytarish',              sub: "Muammosiz qaytarish",              color: 'text-amber-500' },
      ]
    : [
        { icon: ShieldCheck, label: 'Verified Korean Sellers',  sub: 'Every seller is reviewed',   color: 'text-brand-600 dark:text-brand-400' },
        { icon: Truck,       label: '7–14 Day Delivery',        sub: 'Door-to-door to Uzbekistan', color: 'text-cobalt-500' },
        { icon: ShieldCheck, label: 'Unired Secure Payment',    sub: 'Safe checkout guaranteed',   color: 'text-emerald-500' },
        { icon: RotateCcw,   label: '14-Day Returns',           sub: 'Hassle-free returns',        color: 'text-amber-500' },
      ]

  return (
    <section className="container-main">
      <div className="gl rounded-3xl px-6 py-5">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {items.map(({ icon: Icon, label, sub, color }, i) => (
            <div key={label} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', color)}
                style={{ background: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(255,255,255,0.9)' }}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-tight">{label}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Category Grid ─────────────────────────────────────────────────────────────
export function CategoryGrid() {
  const { locale } = useLocale()
  const { tr } = useTranslations()

  return (
    <section className="container-main">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{tr('shop_categories')}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
        {CATEGORIES.map((cat, i) => (
          <Link key={cat.value} href={ROUTES.category(cat.value)}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group animate-fade-up"
            style={{ animationDelay: `${i * 40}ms`, width: 76 }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl overflow-hidden transition-transform duration-200 group-hover:-translate-y-1.5"
              style={{
                background: 'var(--g-bg)',
                backdropFilter: 'blur(20px) saturate(2)',
                border: '1px solid var(--g-border)',
                boxShadow: 'var(--g-shadow)',
              }}>
              <span className="transition-transform duration-200 group-hover:scale-[1.15] inline-block">
                {cat.icon}
              </span>
            </div>
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 text-center group-hover:text-zinc-900 dark:group-hover:text-white transition-colors leading-tight">
              {locale === 'uz' ? cat.uz : cat.en}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Featured Products ─────────────────────────────────────────────────────────
export function FeaturedSection() {
  const { data, isLoading } = useFeaturedProducts()
  const { locale } = useLocale()
  const { tr } = useTranslations()

  const title = locale === 'uz' ? 'Tanlangan Koreya mahsulotlari' : 'Featured Korean Products'

  return (
    <section className="container-main">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{title}</h2>
        <Link href={ROUTES.products} className="text-sm font-bold text-cobalt-500 hover:text-cobalt-600 dark:text-cobalt-400 dark:hover:text-cobalt-300 transition-colors flex items-center gap-1">
          {tr('view_all')} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ProductGrid products={data} loading={isLoading} skeletons={8} columns={4} />
    </section>
  )
}

// ─── Seller CTA ────────────────────────────────────────────────────────────────
export function SellerCTA() {
  const { tr } = useTranslations()

  return (
    <section className="container-main">
      <div className="gl-dark rounded-[26px] px-10 py-12 text-center">
        <div className="w-16 h-16 rounded-[20px] mx-auto mb-5 flex items-center justify-center text-3xl relative z-10"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)' }}>
          🏪
        </div>
        <h2 className="font-display text-[32px] font-bold text-white mb-3 relative z-10">{tr('sell_banner_title')}</h2>
        <p className="text-sm text-white/50 max-w-[360px] mx-auto mb-6 leading-relaxed relative z-10">
          {tr('sell_banner_desc')}
        </p>
        <Link href="/seller" className="relative z-10">
          <button className="inline-flex items-center gap-2.5 h-12 px-8 rounded-full text-[14.5px] font-bold text-zinc-900 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 0 0.5px rgba(255,255,255,0.90), 0 8px 24px rgba(0,0,0,0.22)', backdropFilter: 'blur(16px)' }}>
            {tr('open_store')} <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </section>
  )
}
