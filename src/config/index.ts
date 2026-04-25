import type { Locale, ProductCategory } from '@/types'

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:      '/',
  products:  '/products',
  product:   (slug: string) => `/products/${slug}`,
  cart:      '/cart',
  checkout:  '/checkout',
  orders:    '/account/orders',
  account:   '/account',
  login:     '/auth',
  register:  '/auth',
  seller:    '/seller',
  category:  (cat: string)  => `/products?category=${cat}`,
  search:    (q: string)    => `/products?search=${encodeURIComponent(q)}`,
  origin:    (o: string)    => `/products?origin=${o}`,
} as const

// ─── Locales ──────────────────────────────────────────────────────────────────
export const LOCALES = [
  { value: 'en' as Locale, label: 'English', flag: '🌐' },
  { value: 'uz' as Locale, label: "O'zbek",  flag: '🇺🇿' },
  { value: 'ko' as Locale, label: '한국어',   flag: '🇰🇷' },
]
export const DEFAULT_LOCALE: Locale = 'en'

// ─── Categories (with English labels) ────────────────────────────────────────
export const CATEGORIES: {
  value:   ProductCategory
  en: string; uz: string; ko: string
  icon:    string
  color:   string
}[] = [
  { value: 'beauty',      en: 'Beauty',       uz: 'Kosmetika',    ko: '뷰티',    icon: '✨', color: 'bg-pink-50    dark:bg-pink-900/20'    },
  { value: 'food',        en: 'Food',         uz: 'Oziq-ovqat',   ko: '식품',    icon: '🍜', color: 'bg-amber-50   dark:bg-amber-900/20'   },
  { value: 'electronics', en: 'Electronics',  uz: 'Elektronika',  ko: '전자기기', icon: '📱', color: 'bg-blue-50    dark:bg-blue-900/20'    },
  { value: 'fashion',     en: 'Fashion',      uz: 'Moda',         ko: '패션',    icon: '👗', color: 'bg-purple-50  dark:bg-purple-900/20'  },
  { value: 'home',        en: 'Home',         uz: 'Uy uchun',     ko: '홈',      icon: '🏠', color: 'bg-green-50   dark:bg-green-900/20'   },
  { value: 'health',      en: 'Health',       uz: 'Salomatlik',   ko: '건강',    icon: '💊', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { value: 'sports',      en: 'Sports',       uz: 'Sport',        ko: '스포츠',  icon: '⚽', color: 'bg-orange-50  dark:bg-orange-900/20'  },
  { value: 'kids',        en: "Kids",         uz: 'Bolalar',      ko: '유아동',  icon: '🧸', color: 'bg-yellow-50  dark:bg-yellow-900/20'  },
  { value: 'crafts',      en: 'Crafts',       uz: 'Hunarmandlik', ko: '공예',    icon: '🎨', color: 'bg-rose-50    dark:bg-rose-900/20'    },
]

// ─── Feature Flags ────────────────────────────────────────────────────────────
export const FEATURES = {
  darkMode:        true,
  wishlist:        true,
  reviews:         true,
  uniredGateway:   true,   // Active — connect backend API
  paymeGateway:    false,  // Phase 2
  clickGateway:    false,  // Phase 2
  tossGateway:     false,  // Phase 2 (Korea)
  liveTracking:    false,  // Phase 3
  recommendations: false,  // Phase 3
  bnpl:            false,  // Phase 3
} as const

// ─── API ──────────────────────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'
export const USE_REAL_API  = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
