'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, ShoppingCart, User, Menu, Sun, Moon,
  ChevronDown, X, Store, ArrowRight, Home,
  Package, ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, CATEGORIES } from '@/config'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { useAuthStore } from '@/store'
import { useLocale, useTranslations } from '@/hooks'
import { productsApi }  from '@/lib/api/client'

// ─── Mobile Menu ─────────────────────────────────────────────────────────────
function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, theme, setTheme } = useUIStore()
  const { locale, setLocale, LOCALES, t } = useLocale()
  const { isAuthed } = useAuthStore()
  const { tr } = useTranslations()

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [setMobileMenuOpen])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const navLinks = [
    { href: ROUTES.home,     icon: Home,        label: locale === 'uz' ? 'Bosh sahifa' : 'Home' },
    { href: ROUTES.products, icon: Package,     label: locale === 'uz' ? 'Barcha mahsulotlar' : 'All Products' },
    { href: ROUTES.origin('KR'), icon: ShoppingBag, label: locale === 'uz' ? 'Koreya mahsulotlari' : 'Korean Products' },
    { href: ROUTES.origin('UZ'), icon: ShoppingBag, label: locale === 'uz' ? "O'zbek mahsulotlari" : 'Uzbek Products' },
    { href: isAuthed ? ROUTES.account : ROUTES.login, icon: User, label: tr('my_account') },
    { href: ROUTES.seller, icon: Store, label: locale === 'uz' ? 'Sotuvchi portali' : 'Seller Portal' },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] transition-all duration-300',
          mobileMenuOpen
            ? 'bg-black/50 backdrop-blur-sm pointer-events-auto'
            : 'bg-transparent pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[70] flex w-[300px] flex-col',
          'bg-white/96 dark:bg-zinc-950/96 backdrop-blur-2xl',
          'border-r border-zinc-100 dark:border-zinc-800',
          'shadow-card-lg',
          'transition-transform duration-300 ease-out will-change-transform',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <Link href={ROUTES.home} onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C1C1E] text-white font-bold text-sm shadow-brand">
              K
            </div>
            <span className="font-display text-base font-bold text-zinc-900 dark:text-white">
              KorUz<span className="text-gradient-brand">Market</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-none py-3">
          <div className="px-3 space-y-0.5">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all">
                <Icon className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                {label}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-5 px-3">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {locale === 'uz' ? 'Kategoriyalar' : 'Categories'}
            </p>
            <div className="space-y-0.5">
              {CATEGORIES.map(cat => (
                <Link key={cat.value}
                  href={ROUTES.category(cat.value)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all">
                  <span className="text-base leading-none">{cat.icon}</span>
                  {locale === 'uz' ? cat.uz : cat.en}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer: language + theme */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-4">
          {/* Language picker */}
          <div className="flex items-center gap-2 mb-3">
            {LOCALES.map(l => (
              <button key={l.value}
                onClick={() => setLocale(l.value)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-sm font-semibold transition-all',
                  locale === l.value
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                )}>
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full items-center justify-center gap-2 h-9 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            {theme === 'dark'
              ? <><Sun className="h-4 w-4" /> Light Mode</>
              : <><Moon className="h-4 w-4" /> Dark Mode</>
            }
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const router  = useRouter()
  const { locale, setLocale, current, LOCALES } = useLocale()
  const { tr }  = useTranslations()

  const totalItems = useCartStore(s => s.totalItems)
  const { theme, setTheme, cartOpen, setCartOpen, setMobileMenuOpen } = useUIStore()
  const { isAuthed } = useAuthStore()

  const [scrolled,    setScrolled]    = useState(false)
  const [query,       setQuery]       = useState('')
  const [suggests,    setSuggests]    = useState<string[]>([])
  const [showLang,    setShowLang]    = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const langRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
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
    searchRef.current?.blur()
  }

  const cartCount = totalItems()

  return (
    <>
      <MobileMenu />

      <header className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl',
        'border-b border-zinc-100/80 dark:border-zinc-800/60',
        scrolled && 'shadow-soft dark:shadow-none dark:border-zinc-800'
      )}>

        {/* ── Announcement bar ──────────────────────────────────────────────── */}
        <div className="bg-[#1C1C1E] dark:bg-black/60 text-white/70">
          <div className="container-main flex h-8 items-center justify-center text-xs font-medium tracking-wide">
            <p>🚚 {locale === 'uz' ? "500,000 so'mdan yuqori buyurtmalarga bepul yetkazish" : "Free shipping on orders over 500,000 UZS"} &nbsp;·&nbsp; 🇰🇷 ↔ 🇺🇿</p>
          </div>
        </div>

        {/* ── Main header ───────────────────────────────────────────────────── */}
        <div className="container-main">
          <div className="flex h-16 items-center gap-4">

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all sm:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            {/* Logo */}
            <Link href={ROUTES.home} className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C1C1E] text-white font-bold text-base shadow-brand overflow-hidden">
                K
                <div className="absolute inset-0 bg-gradient-glass opacity-10" />
              </div>
              <span className="font-display text-lg font-bold text-zinc-900 dark:text-white hidden sm:block">
                KorUz<span className="text-gradient-brand">Market</span>
              </span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 relative min-w-0">
              <form onSubmit={handleSearch}>
                <div className={cn(
                  'relative flex items-center rounded-xl transition-all duration-200',
                  'bg-zinc-50 dark:bg-zinc-800/80 border',
                  searchFocus
                    ? 'border-zinc-400 dark:border-zinc-500 ring-2 ring-zinc-400/15 dark:ring-zinc-500/15'
                    : 'border-zinc-200 dark:border-zinc-700/60'
                )}>
                  <Search className="ml-3.5 h-4 w-4 flex-shrink-0 text-zinc-400 dark:text-zinc-500" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
                    placeholder={tr('search_placeholder')}
                    className="flex-1 h-10 bg-transparent px-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
                  />
                  {query && (
                    <button type="button" onClick={() => { setQuery(''); setSuggests([]) }}
                      className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors flex-shrink-0">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </form>

              {/* Suggestions */}
              {suggests.length > 0 && searchFocus && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 animate-scale-in overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-card-lg">
                  {suggests.map(s => (
                    <button key={s}
                      onClick={() => { router.push(ROUTES.search(s)); setSuggests([]) }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left">
                      <Search className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 flex-shrink-0">

              {/* Language picker — hidden on mobile (in mobile menu instead) */}
              <div ref={langRef} className="relative hidden sm:block">
                <button
                  onClick={() => setShowLang(v => !v)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
                >
                  <span>{current.flag}</span>
                  <span className="hidden lg:inline">{current.label}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', showLang && 'rotate-180')} />
                </button>

                {showLang && (
                  <div className="absolute right-0 top-full mt-1.5 z-50 animate-scale-in overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-card-lg min-w-[140px]">
                    {LOCALES.map(l => (
                      <button key={l.value}
                        onClick={() => { setLocale(l.value); setShowLang(false) }}
                        className={cn(
                          'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors',
                          locale === l.value
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        )}>
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark'
                  ? <Sun className="h-4 w-4" />
                  : <Moon className="h-4 w-4" />
                }
              </button>

              {/* Seller link */}
              <Link href="/seller"
                className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-semibold text-cobalt-600 dark:text-cobalt-400 hover:bg-cobalt-50 dark:hover:bg-cobalt-950/30 transition-all">
                <Store className="h-4 w-4" />
                {tr('sell')}
              </Link>

              {/* Account */}
              <Link
                href={isAuthed ? ROUTES.account : ROUTES.login}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                aria-label={tr('my_account')}
              >
                <User className="h-4 w-4" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                aria-label={tr('cart')}
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className={cn(
                    'absolute -right-0.5 -top-0.5',
                    'flex h-[18px] min-w-[18px] items-center justify-center px-1',
                    'rounded-full bg-[#1C1C1E] dark:bg-white text-[10px] font-bold',
                    'text-white dark:text-zinc-900 shadow-brand',
                  )}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Category sub-nav ──────────────────────────────────────────────── */}
        <div className="hidden lg:block border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="container-main">
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none h-10">
              {CATEGORIES.map(cat => (
                <Link key={cat.value} href={ROUTES.category(cat.value)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <span>{cat.icon}</span>
                  <span>{locale === 'uz' ? cat.uz : cat.en}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
