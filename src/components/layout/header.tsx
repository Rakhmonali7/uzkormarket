'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search, ShoppingCart, User, Menu, Sun, Moon,
  ChevronDown, X, Store, ArrowRight, Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, CATEGORIES } from '@/config'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { useAuthStore } from '@/store'
import { useLocale }    from '@/hooks'
import { productsApi }  from '@/lib/api/client'

const LOCALES_CONFIG = [
  { value: 'uz' as const, label: "O'zbek",  flag: '🇺🇿' },
  { value: 'ru' as const, label: 'Русский',  flag: '🇷🇺' },
  { value: 'ko' as const, label: '한국어',   flag: '🇰🇷' },
]

export function Header() {
  const router   = useRouter()
  const pathname = usePathname()
  const { locale, setLocale } = useLocale()

  const totalItems         = useCartStore(s => s.totalItems)
  const { theme, setTheme, cartOpen, setCartOpen, setMobileMenuOpen } = useUIStore()
  const { isAuthed, user } = useAuthStore()

  const [scrolled,    setScrolled]    = useState(false)
  const [query,       setQuery]       = useState('')
  const [suggests,    setSuggests]    = useState<string[]>([])
  const [showLang,    setShowLang]    = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const langRef   = useRef<HTMLDivElement>(null)

  const current = LOCALES_CONFIG.find(l => l.value === locale) ?? LOCALES_CONFIG[0]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setSuggests([]); return }
    const id = setTimeout(async () => {
      const s = await productsApi.suggest(query)
      setSuggests(s)
    }, 220)
    return () => clearTimeout(id)
  }, [query])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(ROUTES.search(query))
    setSuggests([])
    setSearchFocus(false)
    setMobileSearch(false)
    searchRef.current?.blur()
  }

  const cartCount = totalItems()

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-b border-white/50 dark:border-white/5 shadow-sm'
          : 'bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-white/40 dark:border-white/5',
      )}>

        {/* ── Announcement bar ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #E4002B 0%, #c0001f 35%, #0052A2 65%, #003d78 100%)',
          }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.08) 0%,transparent 50%,rgba(255,255,255,0.05) 100%)' }} />
          <div className="container-main flex h-8 items-center justify-between text-[11px] font-semibold text-white/90 relative z-10">
            <span className="hidden sm:inline">🚚 Free shipping on orders over 500,000 so'm</span>
            <span className="sm:hidden">🚚 Free shipping 500K+</span>
            <span className="hidden md:inline">🇰🇷 Authentic Korean Products · Delivered to Uzbekistan 🇺🇿</span>
            <span className="flex items-center gap-1">🎁 Use <strong className="text-white">WELCOME10</strong> for 10% off</span>
          </div>
        </div>

        {/* ── Main nav ─────────────────────────────────────────────────── */}
        <div className="container-main">
          <div className="flex h-[60px] items-center gap-3">

            {/* Logo */}
            <Link href={ROUTES.home} className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-[12px] text-white font-display font-bold text-[17px] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg,#E4002B 0%,#b8001f 50%,#0052A2 100%)',
                  boxShadow: '0 4px 14px rgba(228,0,43,0.38), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}>
                K
                <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,rgba(255,255,255,0.25) 0%,transparent 60%)' }} />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-[17px] font-bold text-zinc-900 dark:text-white leading-none">
                  KorUz<span className="text-gradient-brand">Market</span>
                </span>
              </div>
            </Link>

            {/* Search bar (desktop) */}
            <div className="flex-1 relative max-w-xl mx-2 hidden sm:block">
              <form onSubmit={handleSearch}>
                <div className={cn(
                  'relative flex items-center rounded-2xl transition-all duration-200',
                  searchFocus
                    ? 'shadow-lg'
                    : 'shadow-sm',
                )}
                  style={{
                    background: searchFocus ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(20px)',
                    border: searchFocus ? '1px solid rgba(228,0,43,0.28)' : '1px solid rgba(255,255,255,0.82)',
                    boxShadow: searchFocus
                      ? '0 0 0 3.5px rgba(228,0,43,0.09), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
                      : '0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}>
                  <Search className="ml-3.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
                    placeholder="Search products, brands…"
                    className="flex-1 h-10 bg-transparent px-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none"
                  />
                  {query && (
                    <button type="button" onClick={() => { setQuery(''); setSuggests([]) }}
                      className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200/80 text-zinc-500 hover:bg-zinc-300 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </form>

              {/* Suggestions */}
              {suggests.length > 0 && searchFocus && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 animate-scale-in overflow-hidden rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255,255,255,0.88)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)',
                  }}>
                  {suggests.map(s => (
                    <button key={s}
                      onClick={() => { router.push(ROUTES.search(s)); setSuggests([]) }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors text-left">
                      <Search className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">

              {/* Mobile search toggle */}
              <button onClick={() => setMobileSearch(v => !v)}
                className="sm:hidden h-9 w-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all">
                <Search className="h-4 w-4" />
              </button>

              {/* Language */}
              <div ref={langRef} className="relative hidden sm:block">
                <button onClick={() => setShowLang(v => !v)}
                  className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-white/60 hover:text-zinc-900 transition-all">
                  <span className="text-base">{current.flag}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showLang && 'rotate-180')} />
                </button>
                {showLang && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 animate-scale-in overflow-hidden rounded-2xl min-w-[156px]"
                    style={{
                      background: 'rgba(255,255,255,0.96)',
                      backdropFilter: 'blur(32px)',
                      border: '1px solid rgba(255,255,255,0.88)',
                      boxShadow: '0 20px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)',
                    }}>
                    {LOCALES_CONFIG.map(l => (
                      <button key={l.value}
                        onClick={() => { setLocale(l.value); setShowLang(false) }}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors',
                          locale === l.value
                            ? 'bg-red-50 text-red-600 font-semibold'
                            : 'text-zinc-700 hover:bg-zinc-50'
                        )}>
                        <span>{l.flag}</span><span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark mode */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Sell */}
              <Link href="/seller"
                className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all">
                <Store className="h-4 w-4" />Sell
              </Link>

              {/* Account */}
              <Link href={isAuthed ? ROUTES.account : ROUTES.login}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-white/60 transition-all">
                {isAuthed ? (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#E4002B,#b8001f)' }}>
                    {(user?.name?.[0] ?? 'U').toUpperCase()}
                  </div>
                ) : <User className="h-4 w-4" />}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative h-9 w-9 flex items-center justify-center rounded-xl text-zinc-600 hover:bg-white/60 transition-all">
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className={cn(
                    'absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center',
                    'rounded-full text-[9.5px] font-bold text-white px-1',
                    'animate-bounce-subtle',
                  )}
                    style={{
                      background: 'linear-gradient(135deg,#E4002B,#b8001f)',
                      boxShadow: '0 2px 8px rgba(228,0,43,0.45)',
                    }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button onClick={() => setMobileMenuOpen(true)}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-white/60 transition-all lg:hidden">
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile search bar ─────────────────────────────────────────── */}
        {mobileSearch && (
          <div className="sm:hidden px-4 pb-3 animate-fade-down">
            <form onSubmit={handleSearch}>
              <div className="relative flex items-center rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.88)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                }}>
                <Search className="ml-3.5 h-4 w-4 text-zinc-400" />
                <input
                  autoFocus
                  type="search" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 h-10 bg-transparent px-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none"
                />
                <button type="button" onClick={() => { setMobileSearch(false); setQuery('') }}
                  className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-500">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Category sub-nav ──────────────────────────────────────────── */}
        <div className="hidden lg:block border-t border-white/50 dark:border-white/5">
          <div className="container-main">
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none h-10">
              {CATEGORIES.map(cat => (
                <Link key={cat.value} href={ROUTES.category(cat.value)}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all',
                    pathname.includes(`category=${cat.value}`)
                      ? 'bg-red-50 text-red-600'
                      : 'text-zinc-500 hover:text-red-600 hover:bg-red-50/70'
                  )}>
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.en}</span>
                </Link>
              ))}
              <div className="flex-1" />
              <Link href={ROUTES.origin('KR')}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-zinc-500 hover:text-blue-600 hover:bg-blue-50/70 transition-all">
                🇰🇷 Korean
              </Link>
              <Link href={ROUTES.origin('UZ')}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-zinc-500 hover:text-blue-600 hover:bg-blue-50/70 transition-all">
                🇺🇿 Uzbek
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
