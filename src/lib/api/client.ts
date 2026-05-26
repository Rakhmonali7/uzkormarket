/**
 * API Client
 * ──────────────────────────────────────────────────────────────────────────────
 * Connects to the KorUZ Mall FastAPI backend (prefix: /api/v1).
 * Set NEXT_PUBLIC_USE_REAL_API=true to use the real backend.
 * Set NEXT_PUBLIC_API_URL to point at the backend (default: /api/v1).
 * ──────────────────────────────────────────────────────────────────────────────
 */

import type {
  Product, ProductFilters, PaginatedResponse,
  Order, User, Review, ApiResponse,
  ProductCategory, ProductOrigin, OrderStatus, Currency,
} from '@/types'
import { API_BASE_URL, USE_REAL_API } from '@/config'
import {
  PRODUCTS, getProductBySlug, getFeatured, getNewArrivals, getByOrigin,
} from './mock-data'

// ─── Auth token accessor (avoids circular dep with Zustand store) ─────────────
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('kum-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const token = getStoredToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> ?? {}),
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const detail = err.detail ?? err.message ?? `HTTP ${res.status}`
      const message = Array.isArray(detail)
        ? detail.map((d: any) => d.msg ?? d).join('; ')
        : String(detail)
      return { success: false, error: message }
    }

    const data = await res.json()
    return { success: true, data }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' }
  }
}

// Simulate realistic async delay in mock mode
const delay = <T>(data: T, ms = 350): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), ms))

// ─── Backend → Frontend type mappers ─────────────────────────────────────────
const MINIO_PUBLIC = process.env.NEXT_PUBLIC_MINIO_URL ?? 'http://localhost:9000'
const MINIO_IMAGES_BUCKET = process.env.NEXT_PUBLIC_MINIO_BUCKET ?? 'product-images'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'

function buildImageUrl(key: string | null | undefined): string {
  if (!key) return FALLBACK_IMAGE
  if (key.startsWith('http')) return key
  return `${MINIO_PUBLIC}/${MINIO_IMAGES_BUCKET}/${key}`
}

function mapBackendProduct(p: any): Product {
  const isNew =
    Date.now() - new Date(p.created_at ?? 0).getTime() < 30 * 24 * 60 * 60 * 1000

  const rawImages: string[] = Array.isArray(p.image_keys) ? p.image_keys : []
  const images =
    rawImages.length > 0
      ? rawImages.map((k: string, i: number) => ({
          id: `${p.id}-${i}`,
          url: buildImageUrl(k),
          altText: p.title ?? '',
          isPrimary: i === 0,
        }))
      : [{ id: `${p.id}-thumb`, url: buildImageUrl(p.thumbnail_key), altText: p.title ?? '', isPrimary: true }]

  const attrs = p.attributes ?? {}
  return {
    id: p.id,
    slug: p.id,
    title: { uz: p.title ?? '', en: p.title ?? '' },
    description: { uz: p.description ?? '', en: p.description ?? '' },
    category: (p.category ?? 'beauty') as ProductCategory,
    origin: ((attrs.origin as ProductOrigin) ?? 'KR') as ProductOrigin,
    sellerId: p.seller_id ?? '',
    images,
    priceUZS: Number(p.price_uzs ?? 0),
    priceKRW: Number(p.price_krw ?? 0),
    originalPriceUZS: attrs.original_price_uzs ? Number(attrs.original_price_uzs) : undefined,
    originalPriceKRW: attrs.original_price_krw ? Number(attrs.original_price_krw) : undefined,
    discountPercent: attrs.discount_percent ? Number(attrs.discount_percent) : undefined,
    stockQty: p.stock_quantity ?? 0,
    status: (p.stock_quantity ?? 0) > 0 ? 'active' : 'out_of_stock',
    tags: Array.isArray(attrs.tags) ? attrs.tags : [],
    rating: Number(attrs.rating ?? 0),
    reviewCount: Number(attrs.review_count ?? 0),
    soldCount: Number(attrs.sold_count ?? 0),
    isFeatured: Boolean(attrs.is_featured),
    isNew,
    shippingDays: Number(attrs.shipping_days ?? 5),
    createdAt: p.created_at ?? new Date().toISOString(),
  }
}

function mapBackendOrder(o: any): Order {
  const addr = o.shipping_address ?? {}
  return {
    id: o.id,
    userId: o.buyer_id ?? '',
    items: (o.items ?? []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      product: { id: item.product_id, title: { uz: '', en: '' } } as any,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price_uzs ?? 0),
      currency: 'UZS' as Currency,
    })),
    status: (o.status ?? 'pending') as OrderStatus,
    paymentMethod: (o.payment_method ?? 'unired') as any,
    paymentStatus: 'pending' as any,
    deliveryMethod: 'standard' as any,
    deliveryAddress: {
      recipientName: addr.full_name ?? '',
      phone: addr.phone_number ?? '',
      country: addr.country ?? 'UZ',
      region: addr.region ?? '',
      city: addr.city ?? '',
      street: addr.address_line ?? '',
      apartment: addr.district ?? '',
      notes: addr.notes ?? '',
    },
    subtotal: Number(o.total_amount_uzs ?? 0),
    deliveryFee: 0,
    discount: 0,
    total: Number(o.total_amount_uzs ?? 0),
    currency: 'UZS' as Currency,
    orderedAt: o.created_at ?? new Date().toISOString(),
  }
}

function mapBackendUser(u: any): User {
  return {
    id: u.id,
    name: u.full_name ?? u.email ?? 'User',
    phone: u.phone_number ?? '',
    email: u.email,
    locale: 'uz',
    createdAt: u.created_at ?? new Date().toISOString(),
    role: u.role,
    isVerified: u.is_verified ?? false,
  } as any
}

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  async list(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    if (USE_REAL_API) {
      const params = new URLSearchParams()
      if (filters.page) params.set('page', String(filters.page))
      params.set('page_size', String(filters.pageSize ?? 24))
      if (filters.category) params.set('category', filters.category)
      if (filters.search) params.set('search', filters.search)

      const res = await apiFetch<any>(`/products?${params}`)
      if (!res.success || !res.data) {
        return { data: [], total: 0, page: 1, pageSize: 24, totalPages: 0 }
      }

      const { items = [], meta = {} } = res.data
      let products: Product[] = items.map(mapBackendProduct)

      // Client-side filters for fields backend doesn't natively support
      if (filters.origin) products = products.filter(p => p.origin === filters.origin)
      if (filters.inStock) products = products.filter(p => p.stockQty > 0)
      if (filters.minRating) products = products.filter(p => p.rating >= filters.minRating!)
      if (filters.minPrice) products = products.filter(p => p.priceUZS >= filters.minPrice!)
      if (filters.maxPrice) products = products.filter(p => p.priceUZS <= filters.maxPrice!)
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':  products.sort((a, b) => a.priceUZS - b.priceUZS); break
          case 'price_desc': products.sort((a, b) => b.priceUZS - a.priceUZS); break
          case 'rating':     products.sort((a, b) => b.rating - a.rating);      break
          case 'bestseller': products.sort((a, b) => b.soldCount - a.soldCount); break
        }
      }

      return {
        data: products,
        total: meta.total ?? products.length,
        page: meta.page ?? 1,
        pageSize: meta.page_size ?? 24,
        totalPages: meta.total_pages ?? 1,
      }
    }

    // ── Mock filtering ──────────────────────────────────────────────────────
    let results = [...PRODUCTS]
    if (filters.category)  results = results.filter(p => p.category === filters.category)
    if (filters.origin)    results = results.filter(p => p.origin   === filters.origin)
    if (filters.inStock)   results = results.filter(p => p.stockQty  > 0)
    if (filters.minRating) results = results.filter(p => p.rating   >= filters.minRating!)
    if (filters.minPrice)  results = results.filter(p => p.priceUZS >= filters.minPrice!)
    if (filters.maxPrice)  results = results.filter(p => p.priceUZS <= filters.maxPrice!)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      results = results.filter(p =>
        p.title.uz.toLowerCase().includes(q) ||
        (p.title.en ?? '').toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }
    switch (filters.sortBy) {
      case 'price_asc':  results.sort((a, b) => a.priceUZS - b.priceUZS);  break
      case 'price_desc': results.sort((a, b) => b.priceUZS - a.priceUZS);  break
      case 'rating':     results.sort((a, b) => b.rating   - a.rating);    break
      case 'bestseller': results.sort((a, b) => b.soldCount - a.soldCount); break
      default:           results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    const page     = filters.page     ?? 1
    const pageSize = filters.pageSize ?? 24
    const total    = results.length
    return delay({
      data:       results.slice((page - 1) * pageSize, page * pageSize),
      total, page, pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  },

  /** Backend: GET /products/{id} (UUID). In mock mode uses slug lookup. */
  async getBySlug(slug: string): Promise<Product | null> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>(`/products/${slug}`)
      return res.success && res.data ? mapBackendProduct(res.data) : null
    }
    return delay(getProductBySlug(slug))
  },

  /** Backend: GET /products?page_size=8 (first page as "featured") */
  async getFeatured(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/products?page_size=8')
      if (!res.success || !res.data) return []
      return (res.data.items ?? []).map(mapBackendProduct)
    }
    return delay(getFeatured())
  },

  /** Backend: GET /products?page_size=8 (newest by created_at) */
  async getNew(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/products?page_size=8')
      if (!res.success || !res.data) return []
      return (res.data.items ?? []).map(mapBackendProduct)
    }
    return delay(getNewArrivals(), 280)
  },

  /** Backend: GET /products — client-side filtered by origin attribute */
  async getByOrigin(origin: 'KR' | 'UZ'): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/products?page_size=20')
      if (!res.success || !res.data) return []
      return (res.data.items ?? [])
        .map(mapBackendProduct)
        .filter((p: Product) => p.origin === origin)
    }
    return delay(getByOrigin(origin))
  },

  /** Backend: GET /products?search=... (titles as autocomplete suggestions) */
  async suggest(query: string): Promise<string[]> {
    if (!query.trim()) return []
    if (USE_REAL_API) {
      const res = await apiFetch<any>(
        `/products?search=${encodeURIComponent(query)}&page_size=6`
      )
      if (!res.success || !res.data) return []
      return (res.data.items ?? []).map((p: any) => p.title as string)
    }
    const q = query.toLowerCase()
    return delay(
      PRODUCTS
        .filter(p =>
          p.title.uz.toLowerCase().includes(q) ||
          (p.title.en ?? '').toLowerCase().includes(q)
        )
        .slice(0, 6)
        .map(p => p.title.uz),
      180
    )
  },
}

// ─── Reviews API ──────────────────────────────────────────────────────────────
// Backend does not yet have a /reviews endpoint; always returns curated mock data.
export const reviewsApi = {
  async getForProduct(productId: string): Promise<Review[]> {
    return delay<Review[]>([
      {
        id: 'r1', productId, userId: 'u1',
        userName: 'Aziza T.', rating: 5,
        body: "Juda ajoyib mahsulot! Tezda yetib keldi, sifati a'lo.",
        verifiedPurchase: true, helpful: 14,
        createdAt: '2024-03-15T10:00:00Z',
      },
      {
        id: 'r2', productId, userId: 'u2',
        userName: 'Sardor M.', rating: 4,
        body: 'Yaxshi mahsulot, qadoqlash biroz shikastlangan edi. Umuman olganda mamnunman.',
        verifiedPurchase: true, helpful: 6,
        createdAt: '2024-03-20T14:30:00Z',
      },
      {
        id: 'r3', productId, userId: 'u3',
        userName: '김민준', rating: 5,
        body: '정말 좋은 제품이에요! 빨리 배송되었고 품질도 최상급입니다.',
        verifiedPurchase: true, helpful: 9,
        createdAt: '2024-04-02T09:00:00Z',
      },
    ])
  },
}

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  /** Backend: POST /orders */
  async create(data: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: {
      fullName: string
      phoneNumber: string
      region: string
      city: string
      addressLine: string
      district?: string
      notes?: string
    }
    paymentMethod: string
  }): Promise<ApiResponse<Order>> {
    if (USE_REAL_API) {
      const payload = {
        items: data.items.map(i => ({
          product_id: i.productId,
          quantity:   i.quantity,
        })),
        shipping_address: {
          full_name:    data.shippingAddress.fullName,
          phone_number: data.shippingAddress.phoneNumber,
          country:      'UZ',
          region:       data.shippingAddress.region,
          city:         data.shippingAddress.city,
          address_line: data.shippingAddress.addressLine,
          district:     data.shippingAddress.district,
          notes:        data.shippingAddress.notes,
        },
        payment_method: data.paymentMethod,
      }
      const res = await apiFetch<any>('/orders', {
        method: 'POST',
        body:   JSON.stringify(payload),
      })
      if (!res.success || !res.data) return { success: false, error: res.error }
      return { success: true, data: mapBackendOrder(res.data) }
    }
    // Mock
    const order = {
      id:              `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId:          'user-me',
      items:           [],
      status:          'pending' as OrderStatus,
      paymentMethod:   data.paymentMethod as any,
      paymentStatus:   'pending' as any,
      deliveryMethod:  'standard' as any,
      deliveryAddress: {
        recipientName: data.shippingAddress.fullName,
        phone:         data.shippingAddress.phoneNumber,
        country:       'UZ',
        region:        data.shippingAddress.region,
        city:          data.shippingAddress.city,
        street:        data.shippingAddress.addressLine,
        notes:         data.shippingAddress.notes,
      },
      subtotal: 0, deliveryFee: 0, discount: 0, total: 0,
      currency:  'UZS' as Currency,
      orderedAt: new Date().toISOString(),
    } as Order
    return delay({ success: true, data: order }, 800)
  },

  /** Backend: GET /orders (paginated, returns buyer's own orders) */
  async getMyOrders(): Promise<Order[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/orders?page_size=50')
      if (!res.success || !res.data) return []
      return (res.data.items ?? []).map(mapBackendOrder)
    }
    return delay<Order[]>([])
  },

  /** Backend: POST /orders/{id}/cancel */
  async cancel(orderId: string): Promise<ApiResponse<Order>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>(`/orders/${orderId}/cancel`, { method: 'POST' })
      if (!res.success || !res.data) return { success: false, error: res.error }
      return { success: true, data: mapBackendOrder(res.data) }
    }
    return delay({ success: true, data: {} as Order })
  },
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /** Backend: POST /auth/login → access + refresh tokens, then GET /users/me */
  async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/auth/login', {
        method: 'POST',
        body:   JSON.stringify({ email, password }),
      })
      if (!res.success || !res.data) return { success: false, error: res.error }

      const { access_token, refresh_token } = res.data
      const meRes = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      const meData = meRes.ok ? await meRes.json() : null

      return {
        success: true,
        data: {
          accessToken:  access_token,
          refreshToken: refresh_token,
          user: meData
            ? mapBackendUser(meData)
            : {
                id:        'unknown',
                name:      email.split('@')[0],
                phone:     '',
                email,
                locale:    'uz',
                createdAt: new Date().toISOString(),
              },
        },
      }
    }
    // Mock
    const user: User = {
      id: 'user-me', name: email.split('@')[0], phone: '',
      email, locale: 'uz', createdAt: new Date().toISOString(),
    }
    return delay({ success: true, data: { accessToken: 'mock-jwt', refreshToken: 'mock-refresh', user } })
  },

  /** Backend: POST /auth/register (buyer only; sellers use /sellers/register) */
  async register(
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string,
  ): Promise<ApiResponse<User>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/auth/register', {
        method: 'POST',
        body:   JSON.stringify({
          email,
          password,
          full_name:    fullName,
          phone_number: phoneNumber ?? undefined,
        }),
      })
      if (!res.success || !res.data) return { success: false, error: res.error }
      return { success: true, data: mapBackendUser(res.data) }
    }
    return delay({
      success: true,
      data: {
        id: 'new-user', name: fullName, phone: phoneNumber ?? '',
        email, locale: 'uz', createdAt: new Date().toISOString(),
      },
    })
  },

  /** Backend: POST /auth/logout — best-effort revoke */
  async logout(refreshToken: string): Promise<ApiResponse<void>> {
    if (USE_REAL_API) {
      return apiFetch('/auth/logout', {
        method: 'POST',
        body:   JSON.stringify({ refresh_token: refreshToken }),
      })
    }
    return delay({ success: true })
  },

  /** Backend: POST /auth/refresh — rotate the refresh token */
  async refresh(
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/auth/refresh', {
        method: 'POST',
        body:   JSON.stringify({ refresh_token: refreshToken }),
      })
      if (!res.success || !res.data) return { success: false, error: res.error }
      return {
        success: true,
        data: {
          accessToken:  res.data.access_token,
          refreshToken: res.data.refresh_token,
        },
      }
    }
    return delay({ success: true, data: { accessToken: 'mock-jwt', refreshToken: 'mock-refresh' } })
  },

  /** Backend: GET /users/me */
  async getMe(): Promise<ApiResponse<User>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>('/users/me')
      if (!res.success || !res.data) return { success: false, error: res.error }
      return { success: true, data: mapBackendUser(res.data) }
    }
    return delay({ success: false, error: 'Not authenticated' })
  },
}

// ─── Seller API ───────────────────────────────────────────────────────────────
export const sellerApi = {
  /** Backend: GET /sellers/me */
  async getProfile(): Promise<ApiResponse<any>> {
    if (USE_REAL_API) return apiFetch('/sellers/me')
    return delay({ success: false, error: 'Not a seller' })
  },

  /** Backend: GET /sellers/me/products */
  async getProducts(page = 1, pageSize = 20): Promise<PaginatedResponse<Product>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>(
        `/sellers/me/products?page=${page}&page_size=${pageSize}`
      )
      if (!res.success || !res.data) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 }
      }
      return {
        data:       (res.data.items ?? []).map(mapBackendProduct),
        total:      res.data.meta?.total ?? 0,
        page:       res.data.meta?.page  ?? page,
        pageSize:   res.data.meta?.page_size ?? pageSize,
        totalPages: res.data.meta?.total_pages ?? 0,
      }
    }
    return delay({ data: [], total: 0, page, pageSize, totalPages: 0 })
  },

  /** Backend: POST /products (requires APPROVED seller) */
  async createProduct(data: {
    title: string
    description: string
    category: string
    priceUZS: number
    priceKRW: number
    stockQuantity: number
    origin?: string
    tags?: string[]
    thumbnailKey?: string
    imageKeys?: string[]
  }): Promise<ApiResponse<Product>> {
    if (USE_REAL_API) {
      const payload = {
        title:          data.title,
        description:    data.description,
        category:       data.category,
        price_uzs:      data.priceUZS,
        price_krw:      data.priceKRW,
        stock_quantity: data.stockQuantity,
        thumbnail_key:  data.thumbnailKey,
        image_keys:     data.imageKeys ?? [],
        attributes: {
          origin: data.origin ?? 'KR',
          tags:   data.tags ?? [],
        },
      }
      const res = await apiFetch<any>('/products', {
        method: 'POST',
        body:   JSON.stringify(payload),
      })
      if (!res.success || !res.data) return { success: false, error: res.error }
      return { success: true, data: mapBackendProduct(res.data) }
    }
    return delay({ success: false, error: 'Mock mode: product creation requires a real backend' })
  },

  /** Backend: GET /sellers/me/orders */
  async getOrders(page = 1, pageSize = 20): Promise<PaginatedResponse<Order>> {
    if (USE_REAL_API) {
      const res = await apiFetch<any>(
        `/sellers/me/orders?page=${page}&page_size=${pageSize}`
      )
      if (!res.success || !res.data) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 }
      }
      return {
        data:       (res.data.items ?? []).map(mapBackendOrder),
        total:      res.data.meta?.total ?? 0,
        page:       res.data.meta?.page  ?? page,
        pageSize:   res.data.meta?.page_size ?? pageSize,
        totalPages: res.data.meta?.total_pages ?? 0,
      }
    }
    return delay({ data: [], total: 0, page, pageSize, totalPages: 0 })
  },
}
