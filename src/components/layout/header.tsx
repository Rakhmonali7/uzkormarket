'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, Sun, Moon, ChevronDown, X, Store, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, CATEGORIES, FEATURES } from '@/config'
import { useCartStore } from '@/store'
import { useUIStore }   from '@/store'
import { useAuthStore } from '@/store'
import { useLocale, useTranslations } from '@/hooks'
import { productsApi }  from '@/lib/api/client'

export function Header() {
  const router  = useRouter()
  const { locale, setLocale, current, LOCALES } = useLocale()
  const { tr }  = useTranslations()

  const totalItems         = useCartStore(s => s.totalItems)
  const { theme, setTheme, cartOpen, setCartOpen, setMobileMenuOpen } = useUIStore()
  const { isAuthed, user } = useAuthStore()

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
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-200',
      'bg-white/90 dark:bg-surface-950/90 backdrop-blur-xl',
      'border-b border-zinc-100/80 dark:border-zinc-900/80',
      scrolled && 'shadow-soft'
    )}>

      {/* ── Announcement bar ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-brand-500 to-cobalt-500 text-white">
        <div className="container-main flex h-8 items-center justify-center text-xs font-medium">
          <p>🚚 Free shipping on orders over 500,000 UZS · Korea ↔ Uzbekistan</p>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────────────────────── */}
      <div className="container-main">
        <div className="flex h-16 items-center gap-4">

          {/* Logo */}
          <Link href={ROUTES.home} className="flex-shrink-0 flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white font-bold text-base shadow-brand overflow-hidden">
              K
              <div className="absolute inset-0 bg-gradient-glass opacity-20" />
            </div>
            <span className="font-display text-lg font-bold text-zinc-900 dark:text-white hidden sm:block">
              KorUz<span className="text-gradient-brand">Market</span>
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 relative max-w-xl mx-4">
            <form onSubmit={handleSearch}>
              <div className={cn(
                'relative flex items-center rounded-xl transition-all duration-200',
                'bg-zinc-50 dark:bg-zinc-800/80 border',
                searchFocus
                  ? 'border-brand-400 ring-2 ring-brand-400/20 shadow-soft'
                  : 'border-zinc-200 dark:border-zinc-700'
              )}>
                <Search className="ml-3.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
                  placeholder="Search products, brands…"
                  className={cn(
                    'flex-1 h-10 bg-transparent px-3 text-sm text-zinc-800 dark:text-zinc-200',
                    'placeholder:text-zinc-400 outline-none'
                  )}
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); setSuggests([]) }}
                    className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions dropdown */}
            {suggests.length > 0 && searchFocus && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 animate-scale-in overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-card-lg">
                {suggests.map(s => (
                  <button key={s}
                    onClick={() => { router.push(ROUTES.search(s)); setSuggests([]) }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left">
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Language picker */}
            <div ref={langRef} className="relative hidden sm:block">
              <button
                onClick={() => setShowLang(v => !v)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
              >
                <span>{current.flag}</span>
                <span className="hidden lg:inline">{current.label}</span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showLang && 'rotate-180')} />
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-1.5 z-50 animate-scale-in overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-card-lg min-w-[150px]">
                  {LOCALES.map(l => (
                    <button key={l.value}
                      onClick={() => { setLocale(l.value); setShowLang(false) }}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors',
                        locale === l.value
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      )}>
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Seller link */}
            <Link href="/seller"
              className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-semibold text-cobalt-600 dark:text-cobalt-400 hover:bg-cobalt-50 dark:hover:bg-cobalt-950/30 transition-all">
              <Store className="h-4 w-4" />
              Sell
            </Link>

            {/* Account */}
            <Link
              href={isAuthed ? ROUTES.account : ROUTES.login}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className={cn(
                  'absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center',
                  'rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-brand',
                  'animate-bounce-subtle'
                )}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all sm:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-nav categories ───────────────────────────────────────── */}
      <div className="hidden lg:block border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="container-main">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none h-10">
            {CATEGORIES.slice(0, 10).map(cat => (
              <Link key={cat.value} href={ROUTES.category(cat.value)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all">
                <span>{cat.icon}</span>
                <span>{cat.en ?? cat.uz}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
