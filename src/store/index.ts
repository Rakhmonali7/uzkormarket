import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, User } from '@/types'
import type { Locale } from '@/types'
import { DEFAULT_LOCALE } from '@/config'

// ─── Cart Store ───────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[]
  addItem:    (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty:  (productId: string, qty: number) => void
  clearCart:  () => void
  // Computed helpers
  totalItems:    () => number
  totalUZS:      () => number
  totalKRW:      () => number
  hasItem:       (productId: string) => boolean
  getItemQty:    (productId: string) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(product, qty = 1) {
        set(state => {
          const existing = state.items.find(i => i.productId === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === product.id
                  ? { ...i, quantity: Math.min(i.quantity + qty, product.stockQty) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { productId: product.id, product, quantity: qty }] }
        })
      },

      removeItem(productId) {
        set(s => ({ items: s.items.filter(i => i.productId !== productId) }))
      },

      updateQty(productId, qty) {
        if (qty <= 0) { get().removeItem(productId); return }
        set(s => ({
          items: s.items.map(i => i.productId === productId ? { ...i, quantity: qty } : i),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalUZS:   () => get().items.reduce((s, i) => s + i.product.priceUZS * i.quantity, 0),
      totalKRW:   () => get().items.reduce((s, i) => s + i.product.priceKRW * i.quantity, 0),
      hasItem:    (id) => get().items.some(i => i.productId === id),
      getItemQty: (id) => get().items.find(i => i.productId === id)?.quantity ?? 0,
    }),
    {
      name:       'kum-cart',
      storage:    createJSONStorage(() => localStorage),
      partialize: s => ({ items: s.items }),
    }
  )
)

// ─── UI Store ─────────────────────────────────────────────────────────────────
interface UIState {
  theme:    'light' | 'dark'
  locale:   Locale
  cartOpen: boolean
  mobileMenuOpen: boolean
  authModalOpen:  boolean

  setTheme:          (t: UIState['theme']) => void
  setLocale:         (l: Locale) => void
  setCartOpen:       (v: boolean) => void
  setMobileMenuOpen: (v: boolean) => void
  setAuthModalOpen:  (v: boolean) => void
  toggleCart:        () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme:          'light',
      locale:         DEFAULT_LOCALE,
      cartOpen:       false,
      mobileMenuOpen: false,
      authModalOpen:  false,

      setTheme:          (theme)  => set({ theme }),
      setLocale:         (locale) => set({ locale }),
      setCartOpen:       (v)      => set({ cartOpen: v }),
      setMobileMenuOpen: (v)      => set({ mobileMenuOpen: v }),
      setAuthModalOpen:  (v)      => set({ authModalOpen: v }),
      toggleCart:        ()       => set({ cartOpen: !get().cartOpen }),
    }),
    {
      name:       'kum-ui',
      storage:    createJSONStorage(() => localStorage),
      partialize: s => ({ theme: s.theme, locale: s.locale }),
    }
  )
)

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user:     User | null
  token:    string | null
  isAuthed: boolean
  setAuth:    (user: User, token: string) => void
  clearAuth:  () => void
  updateUser: (partial: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      isAuthed: false,
      setAuth(user, token) { set({ user, token, isAuthed: true }) },
      clearAuth()          { set({ user: null, token: null, isAuthed: false }) },
      updateUser(partial)  { set(s => ({ user: s.user ? { ...s.user, ...partial } : null })) },
    }),
    {
      name:       'kum-auth',
      storage:    createJSONStorage(() => localStorage),
      partialize: s => ({ user: s.user, token: s.token, isAuthed: s.isAuthed }),
    }
  )
)
