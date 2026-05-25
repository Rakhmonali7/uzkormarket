'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, RotateCcw, Truck, Sparkles, Star, Flame, Package, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, CATEGORIES } from '@/config'
import { ProductGrid } from '@/components/product/product-grid'
import { useFeaturedProducts, useNewProducts, useProductsByOrigin } from '@/hooks'

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="container-main pt-6 sm:pt-10">
      <div className="gl rounded-[32px] p-8 sm:p-12 lg:p-14 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none select-none"
          style={{ background: 'radial-gradient(circle, rgba(228,0,43,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none select-none"
          style={{ background: 'radial-gradient(circle, rgba(0,82,162,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Floating flags */}
        <div className="absolute top-8 right-10 text-5xl opacity-[0.08] pointer-events-none select-none animate-float" style={{ animationDelay: '0s' }}>🇰🇷</div>
        <div className="absolute bottom-10 right-24 text-4xl opacity-[0.07] pointer-events-none select-none animate-float" style={{ animationDelay: '3s' }}>🇺🇿</div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 gl-pill px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full animate-glow-pulse" style={{ background: '#E4002B' }} />
          <span className="text-xs font-semibold text-zinc-500">Authentic Korean Products · Delivered to Uzbekistan</span>
        </div>

        <h1 className="font-display font-bold leading-[1.06] text-zinc-900 text-balance mb-5"
          style={{ fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '-1.5px' }}>
          Shop the Best of{' '}
          <span className="text-gradient-brand">Korea</span>,<br />
          Delivered to Your Door
        </h1>

        <p className="text-base text-zinc-500 leading-relaxed max-w-[440px] mb-8">
          K-beauty, Korean food, electronics &amp; wellness — sourced directly from verified Korean sellers and shipped fast to Uzbekistan.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={ROUTES.products}>
            <button className="btn-brand h-12 px-7 flex items-center gap-2 text-sm font-bold">
              🇰🇷 Browse All Products
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href={ROUTES.search('sale')}>
            <button className="btn-glass h-12 px-6 flex items-center gap-2 text-sm">
              🔥 Sale Items
            </button>
          </Link>
          <Link href={ROUTES.search('new')}>
            <button className="btn-glass h-12 px-6 flex items-center gap-2 text-sm">
              ✨ New Arrivals
            </button>
          </Link>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2">
          {[
            '✓ Verified Korean Sellers',
            '🚚 7–14 Day Delivery',
            '🔒 Secure Payment',
            '↩️ 14-Day Returns',
          ].map(t => (
            <span key={t} className="gl-pill px-3.5 py-2 text-[11.5px] font-semibold text-zinc-500">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Promo Banner ──────────────────────────────────────────────────────────────
export function PromoBanner() {
  return (
    <section className="container-main">
      <div className="hero-banner relative rounded-[28px] px-7 py-7 flex items-center gap-6 overflow-hidden">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] opacity-[0.065] pointer-events-none select-none">
          🇰🇷
        </div>
        <span className="text-4xl relative z-10 flex-shrink-0"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}>🎁</span>
        <div className="flex-1 relative z-10">
          <h3 className="font-display text-[20px] font-bold text-white mb-1">
            Welcome Offer — 10% Off First Order
          </h3>
          <p className="text-[13px] text-white/70">
            Use code <strong className="text-white font-bold bg-white/15 px-1.5 py-0.5 rounded-md">WELCOME10</strong> at checkout on any Korean product
          </p>
        </div>
        <Link href={ROUTES.products}>
          <button className="flex-shrink-0 h-10 px-5 rounded-full flex items-center gap-2 text-[13px] font-bold text-white transition-all relative z-10 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.30)',
              boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.28)',
            }}>
            Claim Offer <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    </section>
  )
}

// ─── Trust Bar ─────────────────────────────────────────────────────────────────
export function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: 'Verified Sellers',     sub: 'Every seller reviewed',   color: '#E4002B' },
    { icon: Truck,       label: '7–14 Day Delivery',    sub: 'Door-to-door shipping',    color: '#007AFF' },
    { icon: ShieldCheck, label: 'Secure Payment',       sub: 'Unired & PayMe',           color: '#10b981' },
    { icon: RotateCcw,   label: '14-Day Returns',       sub: 'Hassle-free returns',      color: '#f59e0b' },
  ]
  return (
    <section className="container-main">
      <div className="gl rounded-[28px] px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, label, sub, color }, i) => (
            <div key={label} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}20`,
                  boxShadow: `0 2px 8px ${color}18`,
                }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800 leading-tight">{label}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{sub}</p>
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
  return (
    <section className="container-main">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Shop by Category</h2>
        <Link href={ROUTES.products} className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
          All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map((cat, i) => (
          <Link key={cat.value} href={ROUTES.category(cat.value)}
            className="flex-shrink-0 flex flex-col items-center gap-2.5 cursor-pointer group animate-fade-up"
            style={{ animationDelay: `${i * 40}ms`, width: 80 }}>
            <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-[24px] transition-all duration-250 group-hover:-translate-y-1.5 group-hover:scale-[1.10] no-select"
              style={{
                background: 'rgba(255,255,255,0.76)',
                backdropFilter: 'blur(24px) saturate(2.2)',
                border: '1px solid rgba(255,255,255,0.88)',
                boxShadow: '0 0 0 0.5px rgba(255,255,255,0.60), inset 0 1.5px 0 rgba(255,255,255,1), 0 5px 16px rgba(0,0,0,0.07)',
              }}>
              {cat.icon}
            </div>
            <span className="text-[11px] font-bold text-zinc-500 text-center group-hover:text-red-600 transition-colors leading-tight">
              {cat.en}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Origin Cards ─────────────────────────────────────────────────────────────
export function OriginCards() {
  return (
    <section className="container-main">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Korean products */}
        <Link href={ROUTES.origin('KR')}>
          <div className="relative overflow-hidden rounded-[28px] p-7 cursor-pointer group transition-all duration-300 hover:-translate-y-1.5"
            style={{
              background: 'linear-gradient(135deg, rgba(228,0,43,0.10) 0%, rgba(228,0,43,0.05) 100%)',
              backdropFilter: 'blur(32px) saturate(2)',
              border: '1px solid rgba(228,0,43,0.14)',
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.55), 0 8px 32px rgba(228,0,43,0.08), inset 0 1.5px 0 rgba(255,255,255,0.90)',
            }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,rgba(255,255,255,0.35) 0%,transparent 60%)' }} />
            <div className="absolute top-4 right-6 text-[64px] opacity-[0.14] pointer-events-none select-none group-hover:scale-110 transition-transform duration-300">🇰🇷</div>
            <div className="relative z-10">
              <span className="text-4xl mb-3 block">🇰🇷</span>
              <h3 className="font-display text-xl font-bold text-zinc-900 mb-1">Korean Products</h3>
              <p className="text-sm text-zinc-500 mb-4">K-beauty, food, electronics & wellness</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
                Shop Now <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Uzbek products */}
        <Link href={ROUTES.origin('UZ')}>
          <div className="relative overflow-hidden rounded-[28px] p-7 cursor-pointer group transition-all duration-300 hover:-translate-y-1.5"
            style={{
              background: 'linear-gradient(135deg, rgba(0,82,162,0.10) 0%, rgba(0,82,162,0.05) 100%)',
              backdropFilter: 'blur(32px) saturate(2)',
              border: '1px solid rgba(0,82,162,0.13)',
              boxShadow: '0 0 0 0.5px rgba(255,255,255,0.55), 0 8px 32px rgba(0,82,162,0.08), inset 0 1.5px 0 rgba(255,255,255,0.90)',
            }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,rgba(255,255,255,0.35) 0%,transparent 60%)' }} />
            <div className="absolute top-4 right-6 text-[64px] opacity-[0.14] pointer-events-none select-none group-hover:scale-110 transition-transform duration-300">🇺🇿</div>
            <div className="relative z-10">
              <span className="text-4xl mb-3 block">🇺🇿</span>
              <h3 className="font-display text-xl font-bold text-zinc-900 mb-1">Uzbek Products</h3>
              <p className="text-sm text-zinc-500 mb-4">Silk, crafts, spices & traditional goods</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600">
                Shop Now <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

// ─── Stats bar ─────────────────────────────────────────────────────────────────
export function StatsBar() {
  const stats = [
    { value: '12,000+', label: 'Products', icon: Package },
    { value: '4.8★',   label: 'Avg Rating', icon: Star },
    { value: '50,000+', label: 'Happy Customers', icon: Sparkles },
    { value: '2 Countries', label: 'Bridged', icon: Globe },
  ]
  return (
    <section className="container-main">
      <div className="gl rounded-[28px] px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <div key={label} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <p className="font-display text-2xl font-bold text-gradient-brand">{value}</p>
              <p className="text-xs font-semibold text-zinc-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Featured Products ─────────────────────────────────────────────────────────
export function FeaturedSection() {
  const { data, isLoading } = useFeaturedProducts()
  return (
    <section className="container-main">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
            ⭐ Featured Products
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">Hand-picked top sellers</p>
        </div>
        <Link href={ROUTES.products} className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ProductGrid products={data} loading={isLoading} skeletons={8} columns={4} />
    </section>
  )
}

// ─── New Arrivals ─────────────────────────────────────────────────────────────
export function NewArrivalsSection() {
  const { data, isLoading } = useNewProducts()
  return (
    <section className="container-main">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
            ✨ New Arrivals
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">Just landed this week</p>
        </div>
        <Link href={`${ROUTES.products}?sort=newest`} className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ProductGrid products={data} loading={isLoading} skeletons={4} columns={4} />
    </section>
  )
}

// ─── Seller CTA ────────────────────────────────────────────────────────────────
export function SellerCTA() {
  return (
    <section className="container-main">
      <div className="hero-banner relative rounded-[32px] px-10 py-14 text-center overflow-hidden">
        {/* Decorative */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-10 right-10 text-[120px] opacity-[0.06] pointer-events-none select-none animate-float">🏪</div>

        <div className="relative z-10 w-[68px] h-[68px] rounded-[22px] mx-auto mb-6 flex items-center justify-center text-[32px]"
          style={{
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.28)',
            boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.36)',
          }}>
          🏪
        </div>
        <h2 className="font-display text-[34px] font-bold text-white mb-3 relative z-10">
          Sell Your Products Here
        </h2>
        <p className="text-[14px] text-white/65 max-w-[360px] mx-auto mb-7 leading-relaxed relative z-10">
          Are you a Korean or Uzbek seller? Reach thousands of customers. List your products for free and grow your business.
        </p>
        <div className="flex items-center justify-center gap-3 relative z-10">
          <Link href="/seller">
            <button className="inline-flex items-center gap-2.5 h-12 px-8 rounded-full text-[14px] font-bold text-zinc-900 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 0 0 0.5px rgba(255,255,255,0.88), 0 10px 28px rgba(0,0,0,0.18)',
                backdropFilter: 'blur(16px)',
              }}>
              Open Your Store <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href={ROUTES.products}>
            <button className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-[14px] font-semibold text-white/80 hover:text-white transition-all"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
              }}>
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
