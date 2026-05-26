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
]
export const DEFAULT_LOCALE: Locale = 'en'

// ─── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES: {
  value: ProductCategory
  en:    string
  uz:    string
  icon:  string
  color: string
}[] = [
  { value: 'beauty',      en: 'Beauty',       uz: 'Kosmetika',    icon: '✨', color: 'bg-pink-50    dark:bg-pink-900/20'    },
  { value: 'food',        en: 'Food',         uz: 'Oziq-ovqat',   icon: '🍜', color: 'bg-amber-50   dark:bg-amber-900/20'   },
  { value: 'electronics', en: 'Electronics',  uz: 'Elektronika',  icon: '📱', color: 'bg-blue-50    dark:bg-blue-900/20'    },
  { value: 'fashion',     en: 'Fashion',      uz: 'Moda',         icon: '👗', color: 'bg-purple-50  dark:bg-purple-900/20'  },
  { value: 'home',        en: 'Home',         uz: 'Uy uchun',     icon: '🏠', color: 'bg-green-50   dark:bg-green-900/20'   },
  { value: 'health',      en: 'Health',       uz: 'Salomatlik',   icon: '💊', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { value: 'sports',      en: 'Sports',       uz: 'Sport',        icon: '⚽', color: 'bg-orange-50  dark:bg-orange-900/20'  },
  { value: 'kids',        en: 'Kids',         uz: 'Bolalar',      icon: '🧸', color: 'bg-yellow-50  dark:bg-yellow-900/20'  },
  { value: 'crafts',      en: 'Crafts',       uz: 'Hunarmandlik', icon: '🎨', color: 'bg-rose-50    dark:bg-rose-900/20'    },
]

// ─── Feature Flags ────────────────────────────────────────────────────────────
export const FEATURES = {
  darkMode:        true,
  wishlist:        true,
  reviews:         true,
  uniredGateway:   true,
  paymeGateway:    false,
  clickGateway:    false,
  tossGateway:     false,
  liveTracking:    false,
  recommendations: false,
  bnpl:            false,
} as const

// ─── Order status labels ──────────────────────────────────────────────────────
export const ORDER_STATUS: Record<string, { en: string; uz: string }> = {
  pending:           { en: 'Pending',           uz: 'Kutilmoqda'            },
  payment_confirmed: { en: 'Payment Confirmed', uz: "To'lov tasdiqlandi"    },
  processing:        { en: 'Processing',        uz: 'Jarayonda'             },
  packed:            { en: 'Packed',            uz: 'Qadoqlandi'            },
  shipped:           { en: 'Shipped',           uz: "Yo'lda"               },
  out_for_delivery:  { en: 'Out for Delivery',  uz: 'Yetkazilmoqda'         },
  delivered:         { en: 'Delivered',         uz: 'Yetkazildi'            },
  cancelled:         { en: 'Cancelled',         uz: 'Bekor qilindi'         },
  returned:          { en: 'Returned',          uz: 'Qaytarildi'            },
}

// ─── API ──────────────────────────────────────────────────────────────────────
// Default to /api/v1 which is proxied to the backend by next.config.js rewrites.
// In production set NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1'
export const USE_REAL_API  = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
