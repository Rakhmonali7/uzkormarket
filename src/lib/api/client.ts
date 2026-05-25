/**
 * API Client — connects to uzkormarket-backend
 * Backend base URL: process.env.NEXT_PUBLIC_API_URL (default: /api)
 * Set NEXT_PUBLIC_USE_REAL_API=true to use real backend
 */

import type {
  Product, ProductFilters, PaginatedResponse,
  Order, User, Review, ApiResponse,
} from '@/types'
import { API_BASE_URL, USE_REAL_API } from '@/config'
import {
  PRODUCTS, getProductBySlug, getFeatured, getNewArrivals,
  getByOrigin, getByCategory,
} from './mock-data'

// ─── Auth header helper ───────────────────────────────────────────────────────
function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem('kum-auth')
    const token  = stored ? JSON.parse(stored)?.state?.token : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch { return {} }
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...((options?.headers as Record<string, string>) ?? {}),
      },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message ?? `HTTP ${res.status}` }
    }
    const data = await res.json()
    return { success: true, data }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' }
  }
}

const delay = <T>(data: T, ms = 350): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), ms))

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /** POST /auth/register */
  async register(data: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    if (USE_REAL_API) return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) })
    const user: User = {
      id: `user-${Date.now()}`, name: data.name,
      phone: '', email: data.email,
      locale: 'uz', createdAt: new Date().toISOString(),
    }
    return delay({ success: true, data: { token: 'mock-jwt-' + Date.now(), user } }, 700)
  },

  /** POST /auth/login */
  async login(data: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    if (USE_REAL_API) return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) })
    const user: User = {
      id: 'user-me', name: data.email.split('@')[0],
      phone: '', email: data.email,
      locale: 'uz', createdAt: new Date().toISOString(),
    }
    return delay({ success: true, data: { token: 'mock-jwt-' + Date.now(), user } }, 600)
  },

  /** POST /auth/otp/request */
  async requestOTP(phone: string): Promise<ApiResponse<void>> {
    if (USE_REAL_API) return apiFetch('/auth/otp/request', { method: 'POST', body: JSON.stringify({ phone }) })
    return delay({ success: true })
  },

  /** POST /auth/otp/verify */
  async verifyOTP(phone: string, code: string): Promise<ApiResponse<{ token: string; user: User }>> {
    if (USE_REAL_API) return apiFetch('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) })
    const user: User = {
      id: 'user-me', name: 'User', phone,
      locale: 'uz', createdAt: new Date().toISOString(),
    }
    return delay({ success: true, data: { token: 'mock-jwt', user } })
  },

  /** POST /auth/logout */
  async logout(): Promise<ApiResponse<void>> {
    if (USE_REAL_API) return apiFetch('/auth/logout', { method: 'POST' })
    return delay({ success: true })
  },

  /** GET /auth/me */
  async me(): Promise<ApiResponse<User>> {
    if (USE_REAL_API) return apiFetch('/auth/me')
    return delay({ success: false, error: 'Not authenticated' })
  },
}

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  /** GET /products?category=...&origin=...&page=... */
  async list(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    if (USE_REAL_API) {
      const params = new URLSearchParams(
        Object.entries(filters)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
      const res = await apiFetch<PaginatedResponse<Product>>(`/products?${params}`)
      return res.data!
    }

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
        p.title.ru.toLowerCase().includes(q) ||
        p.title.ko.toLowerCase().includes(q) ||
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

  /** GET /products/:slug */
  async getBySlug(slug: string): Promise<Product | null> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product>(`/products/${slug}`)
      return res.data ?? null
    }
    return delay(getProductBySlug(slug))
  },

  /** GET /products?featured=true */
  async getFeatured(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>('/products?featured=true')
      return res.data ?? []
    }
    return delay(getFeatured())
  },

  /** GET /products?new=true */
  async getNew(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>('/products?new=true')
      return res.data ?? []
    }
    return delay(getNewArrivals(), 280)
  },

  /** GET /products?origin=KR|UZ */
  async getByOrigin(origin: 'KR' | 'UZ'): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>(`/products?origin=${origin}`)
      return res.data ?? []
    }
    return delay(getByOrigin(origin))
  },

  /** GET /products/suggest?q=... */
  async suggest(query: string): Promise<string[]> {
    if (!query.trim()) return []
    if (USE_REAL_API) {
      const res = await apiFetch<string[]>(`/products/suggest?q=${encodeURIComponent(query)}`)
      return res.data ?? []
    }
    const q = query.toLowerCase()
    return delay(
      PRODUCTS.filter(p =>
        p.title.uz.toLowerCase().includes(q) || p.title.ru.toLowerCase().includes(q)
      ).slice(0, 6).map(p => p.title.uz),
      180
    )
  },

  /** GET /products/categories */
  async getCategories(): Promise<string[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<string[]>('/products/categories')
      return res.data ?? []
    }
    const cats = Array.from(new Set(PRODUCTS.map(p => p.category)))
    return delay(cats)
  },
}

// ─── Reviews API ──────────────────────────────────────────────────────────────
export const reviewsApi = {
  /** GET /products/:id/reviews */
  async getForProduct(productId: string): Promise<Review[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Review[]>(`/products/${productId}/reviews`)
      return res.data ?? []
    }
    return delay<Review[]>([
      {
        id: 'r1', productId, userId: 'u1',
        userName: 'Aziza T.', rating: 5,
        body: "Juda ajoyib mahsulot! Tezda yetib keldi, sifati a'lo darajada. Qayta buyurtma beraman!",
        verifiedPurchase: true, helpful: 14,
        createdAt: '2024-03-15T10:00:00Z',
      },
      {
        id: 'r2', productId, userId: 'u2',
        userName: 'Sardor M.', rating: 4,
        body: "Yaxshi mahsulot, qadoqlash biroz shikastlangan edi lekin mahsulot o'zi yaxshi. Umuman olganda mamnunman.",
        verifiedPurchase: true, helpful: 6,
        createdAt: '2024-03-20T14:30:00Z',
      },
      {
        id: 'r3', productId, userId: 'u3',
        userName: '김민준', rating: 5,
        body: "정말 좋은 제품이에요! 배송도 빠르고 품질도 최상급입니다. 다시 구매할 예정입니다.",
        verifiedPurchase: true, helpful: 9,
        createdAt: '2024-04-02T09:00:00Z',
      },
      {
        id: 'r4', productId, userId: 'u4',
        userName: 'Malika R.', rating: 4,
        body: "Sifati kutganimdan ham yaxshi chiqdi. Narxi biroz qimmat lekin arziydigan mahsulot.",
        verifiedPurchase: false, helpful: 3,
        createdAt: '2024-04-10T11:00:00Z',
      },
    ])
  },

  /** POST /products/:id/reviews */
  async create(productId: string, data: { rating: number; body: string }): Promise<ApiResponse<Review>> {
    if (USE_REAL_API) {
      return apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) })
    }
    const review: Review = {
      id: `r-${Date.now()}`, productId, userId: 'user-me',
      userName: 'You', rating: data.rating as 1|2|3|4|5,
      body: data.body, verifiedPurchase: false, helpful: 0,
      createdAt: new Date().toISOString(),
    }
    return delay({ success: true, data: review }, 500)
  },
}

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  /** POST /orders */
  async create(data: Partial<Order>): Promise<ApiResponse<Order>> {
    if (USE_REAL_API) {
      return apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(data) })
    }
    const order = {
      id:             `ORD-${Date.now().toString(36).toUpperCase()}`,
      status:         'pending',
      paymentStatus:  'pending',
      deliveryMethod: 'standard',
      orderedAt:      new Date().toISOString(),
      subtotal: 0, deliveryFee: 0, discount: 0, total: 0,
      ...data,
    } as Order
    return delay({ success: true, data: order }, 900)
  },

  /** GET /orders/me */
  async getMyOrders(): Promise<Order[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Order[]>('/orders/me')
      return res.data ?? []
    }
    return delay<Order[]>([])
  },

  /** GET /orders/:id */
  async getById(id: string): Promise<ApiResponse<Order>> {
    if (USE_REAL_API) return apiFetch<Order>(`/orders/${id}`)
    return delay({ success: false, error: 'Not found' })
  },

  /** PATCH /orders/:id/cancel */
  async cancel(id: string): Promise<ApiResponse<Order>> {
    if (USE_REAL_API) return apiFetch<Order>(`/orders/${id}/cancel`, { method: 'PATCH' })
    return delay({ success: true })
  },
}

// ─── Sellers API ──────────────────────────────────────────────────────────────
export const sellersApi = {
  /** POST /sellers/apply */
  async apply(data: {
    businessName: string; email: string; phone: string;
    country: 'KR' | 'UZ'; description?: string
  }): Promise<ApiResponse<{ applicationId: string }>> {
    if (USE_REAL_API) return apiFetch('/sellers/apply', { method: 'POST', body: JSON.stringify(data) })
    return delay({ success: true, data: { applicationId: `APP-${Date.now().toString(36).toUpperCase()}` } }, 800)
  },
}

// ─── Wishlist API ─────────────────────────────────────────────────────────────
export const wishlistApi = {
  /** GET /wishlist */
  async get(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>('/wishlist')
      return res.data ?? []
    }
    return delay<Product[]>([])
  },

  /** POST /wishlist/:productId */
  async add(productId: string): Promise<ApiResponse<void>> {
    if (USE_REAL_API) return apiFetch(`/wishlist/${productId}`, { method: 'POST' })
    return delay({ success: true })
  },

  /** DELETE /wishlist/:productId */
  async remove(productId: string): Promise<ApiResponse<void>> {
    if (USE_REAL_API) return apiFetch(`/wishlist/${productId}`, { method: 'DELETE' })
    return delay({ success: true })
  },
}
