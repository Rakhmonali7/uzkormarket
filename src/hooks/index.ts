import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '@/store'
import { LOCALES, CATEGORIES } from '@/config'
import { productsApi } from '@/lib/api/client'
import type { LocalizedString, Locale, ProductFilters } from '@/types'

// ─── useLocale ────────────────────────────────────────────────────────────────
export function useLocale() {
  const locale    = useUIStore(s => s.locale)
  const setLocale = useUIStore(s => s.setLocale)
  const current   = LOCALES.find(l => l.value === locale) ?? LOCALES[0]

  /** Resolve a LocalizedString to the current locale, with fallback chain */
  function t(str: LocalizedString): string {
    return str[locale] ?? str.en ?? str.uz ?? Object.values(str).find(Boolean) ?? ''
  }

  return { locale, setLocale, t, current, LOCALES }
}

// ─── useTranslations ──────────────────────────────────────────────────────────
const UI_STRINGS: Record<string, Partial<Record<Locale, string>>> = {
  // Cart & Shopping
  add_to_cart:        { en: 'Add to Cart',          uz: "Savatga qo'shish"    },
  buy_now:            { en: 'Buy Now',               uz: 'Hozir sotib olish'   },
  in_stock:           { en: 'In Stock',              uz: 'Mavjud'              },
  out_of_stock:       { en: 'Out of Stock',          uz: 'Tugagan'             },
  cart:               { en: 'Cart',                  uz: 'Savat'               },
  empty_cart:         { en: 'Cart is empty',         uz: "Savat bo'sh"         },
  empty_cart_hint:    { en: 'Add items and come back', uz: "Mahsulot qo'shing va qaytib keling" },
  continue_shopping:  { en: 'Continue Shopping',     uz: 'Xarid davom etish'   },
  checkout:           { en: 'Checkout',              uz: 'Rasmiylashtirish'    },
  subtotal:           { en: 'Subtotal',              uz: 'Oraliq summa'        },
  delivery:           { en: 'Delivery',              uz: 'Yetkazib berish'     },
  total:              { en: 'Total',                 uz: 'Jami'                },
  place_order:        { en: 'Place Order',           uz: 'Buyurtma berish'     },

  // Navigation & Account
  my_account:         { en: 'My Account',            uz: 'Mening hisobim'      },
  login:              { en: 'Login',                 uz: 'Kirish'              },
  sell:               { en: 'Sell',                  uz: 'Sotish'              },

  // Product display
  reviews:            { en: 'Reviews',               uz: 'Sharhlar'            },
  search_placeholder: { en: 'Search products, brands…', uz: 'Mahsulot qidiring…' },
  see_all:            { en: 'See All',               uz: "Barchasini ko'rish"  },
  view_all:           { en: 'View all',              uz: "Barchasini ko'rish"  },
  featured:           { en: 'Featured',              uz: 'Tanlangan'           },
  new_arrivals:       { en: 'New Arrivals',          uz: 'Yangi mahsulotlar'   },
  bestsellers:        { en: 'Bestsellers',           uz: "Ko'p sotilgan"       },
  from_korea:         { en: 'From Korea',            uz: 'Koreyadan'           },
  from_uzbekistan:    { en: 'From Uzbekistan',       uz: "O'zbekistondan"      },
  free_shipping:      { en: 'Free Shipping',         uz: 'Bepul yetkazish'     },
  verified_seller:    { en: 'Verified Seller',       uz: 'Tasdiqlangan'        },

  // Filters
  filter:             { en: 'Filter',                uz: 'Filtr'               },
  sort:               { en: 'Sort',                  uz: 'Saralash'            },
  qty:                { en: 'Qty',                   uz: 'Miqdor'              },
  days_delivery:      { en: 'day delivery',          uz: 'kun yetkazish'       },
  all_categories:     { en: 'All',                   uz: 'Barcha'              },
  save_to_wishlist:   { en: 'Save',                  uz: 'Saqlash'             },

  // Checkout & Orders
  delivery_address:   { en: 'Delivery Address',      uz: 'Yetkazish manzili'   },
  payment_method:     { en: 'Payment Method',        uz: "To'lov usuli"        },
  order_summary:      { en: 'Order Summary',         uz: 'Buyurtma xulosasi'   },

  // Sections
  shop_categories:    { en: 'Shop by Category',      uz: "Kategoriya bo'yicha" },
  featured_products:  { en: 'Featured Products',     uz: 'Tanlangan mahsulotlar' },
  sell_banner_title:  { en: 'Sell Your Products Here', uz: "Mahsulotlaringizni bu yerda soting" },
  sell_banner_desc:   { en: 'Are you a seller? Reach thousands of customers. List for free.',
                        uz: "Sotuvchimisiz? Minglab mijozlarga yeting. Tekin joylashtiring." },
  open_store:         { en: 'Open Your Store',       uz: "Do'koningizni oching" },
  browse_products:    { en: 'Browse All Products',   uz: 'Barcha mahsulotlar'  },
  sale_items:         { en: 'Sale Items',            uz: 'Chegirma mahsulotlar'},
  product_not_found:  { en: 'No products found',     uz: 'Mahsulot topilmadi'  },
  change_filters:     { en: 'Try changing your filters', uz: "Filtrlaringizni o'zgartiring" },
}

export function useTranslations() {
  const locale = useUIStore(s => s.locale)
  function tr(key: keyof typeof UI_STRINGS): string {
    return UI_STRINGS[key]?.[locale] ?? UI_STRINGS[key]?.en ?? UI_STRINGS[key]?.uz ?? key as string
  }
  return { tr, locale }
}

// ─── Product query hooks ──────────────────────────────────────────────────────
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey:  ['products', filters],
    queryFn:   () => productsApi.list(filters),
    staleTime: 60_000,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey:  ['product', slug],
    queryFn:   () => productsApi.getBySlug(slug),
    enabled:   Boolean(slug),
    staleTime: 120_000,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey:  ['products', 'featured'],
    queryFn:   productsApi.getFeatured,
    staleTime: 300_000,
  })
}

export function useNewProducts() {
  return useQuery({
    queryKey:  ['products', 'new'],
    queryFn:   productsApi.getNew,
    staleTime: 300_000,
  })
}

export function useProductsByOrigin(origin: 'KR' | 'UZ') {
  return useQuery({
    queryKey:  ['products', 'origin', origin],
    queryFn:   () => productsApi.getByOrigin(origin),
    staleTime: 120_000,
  })
}
