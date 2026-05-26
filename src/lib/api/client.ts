/**
 * API Client
 * ──────────────────────────────────────────────────────────────────────────────
 * Currently uses local mock data.
 * To connect to a real backend: set NEXT_PUBLIC_USE_REAL_API=true in .env.local
 * All function signatures remain identical — only the implementation swaps.
 * ──────────────────────────────────────────────────────────────────────────────
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

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message ?? `HTTP ${res.status}` }
    }
    return { success: true, data: await res.json() }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' }
  }
}

// Simulate realistic async delay in mock mode
const delay = <T>(data: T, ms = 350): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), ms))

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  /**
   * List & filter products.
   * Backend: GET /products?category=...&origin=...&page=...
   */
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

  /** Backend: GET /products/:slug */
  async getBySlug(slug: string): Promise<Product | null> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product>(`/products/${slug}`)
      return res.data ?? null
    }
    return delay(getProductBySlug(slug))
  },

  /** Backend: GET /products?featured=true */
  async getFeatured(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>('/products?featured=true')
      return res.data ?? []
    }
    return delay(getFeatured())
  },

  /** Backend: GET /products?new=true */
  async getNew(): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>('/products?new=true')
      return res.data ?? []
    }
    return delay(getNewArrivals(), 280)
  },

  /** Backend: GET /products?origin=KR|UZ */
  async getByOrigin(origin: 'KR' | 'UZ'): Promise<Product[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Product[]>(`/products?origin=${origin}`)
      return res.data ?? []
    }
    return delay(getByOrigin(origin))
  },

  /** Search autocomplete. Backend: GET /products/suggest?q=... */
  async suggest(query: string): Promise<string[]> {
    if (!query.trim()) return []
    if (USE_REAL_API) {
      const res = await apiFetch<string[]>(`/products/suggest?q=${encodeURIComponent(query)}`)
      return res.data ?? []
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
export const reviewsApi = {
  /** Backend: GET /products/:id/reviews */
  async getForProduct(productId: string): Promise<Review[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Review[]>(`/products/${productId}/reviews`)
      return res.data ?? []
    }
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
        body: "Yaxshi mahsulot, qadoqlash biroz shikastlangan edi. Umuman olganda mamnunman.",
        verifiedPurchase: true, helpful: 6,
        createdAt: '2024-03-20T14:30:00Z',
      },
      {
        id: 'r3', productId, userId: 'u3',
        userName: '김민준', rating: 5,
        body: "정말 좋은 제품이에요! 빨리 배송되었고 품질도 최상급입니다.",
        verifiedPurchase: true, helpful: 9,
        createdAt: '2024-04-02T09:00:00Z',
      },
    ])
  },
}

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  /** Backend: POST /orders */
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
    return delay({ success: true, data: order }, 800)
  },

  /** Backend: GET /orders/me */
  async getMyOrders(): Promise<Order[]> {
    if (USE_REAL_API) {
      const res = await apiFetch<Order[]>('/orders/me')
      return res.data ?? []
    }
    return delay<Order[]>([])
  },
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /** Backend: POST /auth/otp/request */
  async requestOTP(phone: string): Promise<ApiResponse<void>> {
    if (USE_REAL_API) {
      return apiFetch('/auth/otp/request', { method: 'POST', body: JSON.stringify({ phone }) })
    }
    console.log('[mock] OTP sent to', phone)
    return delay({ success: true })
  },

  /** Backend: POST /auth/otp/verify */
  async verifyOTP(phone: string, code: string): Promise<ApiResponse<{ token: string; user: User }>> {
    if (USE_REAL_API) {
      return apiFetch('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) })
    }
    const user: User = {
      id: 'user-me', name: 'Test User', phone,
      locale: 'uz', createdAt: new Date().toISOString(),
    }
    return delay({ success: true, data: { token: 'mock-jwt', user } })
  },
}
