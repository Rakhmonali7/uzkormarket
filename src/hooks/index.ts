import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '@/store'
import { LOCALES, CATEGORIES } from '@/config'
import { productsApi } from '@/lib/api/client'
import type { LocalizedString, Locale, ProductFilters } from '@/types'

// ─── useLocale ────────────────────────────────────────────────────────────────
export function useLocale() {
  const locale    = useUIStore(s => s.locale)
  const setLocale = useUIStore(s => s.setLocale)
  const current   = LOCALES.find(l => l.value === locale)!

  /** Resolve a LocalizedString to the current locale, with fallback */
  function t(str: LocalizedString): string {
    return str[locale] || str.uz || str.ru || Object.values(str)[0] || ''
  }

  return { locale, setLocale, t, current, LOCALES }
}

// ─── useTranslations ──────────────────────────────────────────────────────────
// Central place for all UI strings — extend as you add pages
const UI_STRINGS: Record<string, Partial<Record<Locale, string>>> = {
  add_to_cart:        { uz: "Savatga qo'shish",     ru: 'В корзину',         ko: '장바구니' },
  buy_now:            { uz: 'Hozir sotib olish',     ru: 'Купить сейчас',     ko: '지금 구매' },
  in_stock:           { uz: 'Mavjud',                ru: 'В наличии',         ko: '재고 있음' },
  out_of_stock:       { uz: 'Tugagan',               ru: 'Нет в наличии',     ko: '품절' },
  reviews:            { uz: 'Sharhlar',              ru: 'Отзывы',            ko: '리뷰' },
  search_placeholder: { uz: 'Mahsulot qidiring…',   ru: 'Поиск…',            ko: '상품 검색…' },
  cart:               { uz: 'Savat',                 ru: 'Корзина',           ko: '장바구니' },
  my_account:         { uz: 'Mening hisobim',        ru: 'Мой аккаунт',       ko: '내 계정' },
  login:              { uz: 'Kirish',                ru: 'Войти',             ko: '로그인' },
  see_all:            { uz: "Barchasini ko'rish",    ru: 'Смотреть все',      ko: '모두 보기' },
  featured:           { uz: 'Tanlangan',             ru: 'Избранные',         ko: '추천' },
  new_arrivals:       { uz: 'Yangi',                 ru: 'Новинки',           ko: '신상품' },
  bestsellers:        { uz: "Ko'p sotilgan",         ru: 'Хиты продаж',       ko: '베스트셀러' },
  total:              { uz: 'Jami',                  ru: 'Итого',             ko: '합계' },
  checkout:           { uz: 'Rasmiylashtirish',      ru: 'Оформить',          ko: '결제' },
  continue_shopping:  { uz: 'Xarid davom etish',     ru: 'Продолжить',        ko: '쇼핑 계속' },
  empty_cart:         { uz: "Savat bo'sh",           ru: 'Корзина пуста',     ko: '장바구니 비었음' },
  from_korea:         { uz: 'Koreyadan',             ru: 'Из Кореи',          ko: '한국에서' },
  from_uzbekistan:    { uz: "O'zbekistondan",        ru: 'Из Узбекистана',    ko: '우즈베키스탄에서' },
  free_shipping:      { uz: "Bepul yetkazish",       ru: 'Бесплатная доставка', ko: '무료 배송' },
  verified_seller:    { uz: 'Tasdiqlangan',          ru: 'Верифицирован',     ko: '인증 판매자' },
  filter:             { uz: 'Filtr',                 ru: 'Фильтр',            ko: '필터' },
  sort:               { uz: 'Saralash',              ru: 'Сортировка',        ko: '정렬' },
  qty:                { uz: 'Miqdor',                ru: 'Количество',        ko: '수량' },
  days_delivery:      { uz: 'kun yetkazish',         ru: 'дней доставка',     ko: '일 배송' },
  all_categories:     { uz: 'Barcha',                ru: 'Все категории',     ko: '전체' },
  save_to_wishlist:   { uz: 'Saqlash',               ru: 'Сохранить',         ko: '찜하기' },
  place_order:        { uz: "Buyurtma berish",       ru: 'Оформить заказ',    ko: '주문하기' },
  delivery_address:   { uz: 'Yetkazish manzili',     ru: 'Адрес доставки',    ko: '배송 주소' },
  payment_method:     { uz: "To'lov usuli",          ru: 'Способ оплаты',     ko: '결제 수단' },
  order_summary:      { uz: 'Buyurtma xulosasi',     ru: 'Сводка заказа',     ko: '주문 요약' },
}

export function useTranslations() {
  const locale = useUIStore(s => s.locale)
  function tr(key: keyof typeof UI_STRINGS): string {
    return UI_STRINGS[key]?.[locale] ?? UI_STRINGS[key]?.uz ?? key as string
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
