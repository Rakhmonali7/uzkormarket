import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Currency, Locale, Product } from '@/types'

// ─── Class name merger ────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price formatting ─────────────────────────────────────────────────────────
export function formatPrice(amount: number, _currency: Currency = 'UZS', _locale: Locale = 'en'): string {
  return `${amount.toLocaleString('uz-UZ')} so'm`
}

export function getProductPrice(product: Product, _locale: Locale): number {
  return product.priceUZS
}

export function getProductOriginalPrice(product: Product, _locale: Locale): number | undefined {
  return product.originalPriceUZS
}

export function getCurrency(_locale: Locale): Currency {
  return 'UZS'
}

// ─── Date utilities ───────────────────────────────────────────────────────────
const LOCALE_MAP: Record<Locale, string> = { uz: 'uz-UZ', en: 'en-US' }

export function formatDate(iso: string, locale: Locale = 'en'): string {
  return new Date(iso).toLocaleDateString(LOCALE_MAP[locale], {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function timeAgo(iso: string): string {
  const diff    = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours   = Math.floor(diff / 3_600_000)
  const days    = Math.floor(diff / 86_400_000)
  if (minutes < 60) return `${minutes}m ago`
  if (hours   < 24) return `${hours}h ago`
  if (days    < 30) return `${days}d ago`
  return formatDate(iso)
}

// ─── String utilities ─────────────────────────────────────────────────────────
export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + '…'
}

// ─── Validation ───────────────────────────────────────────────────────────────
export function isValidUzPhone(phone: string): boolean {
  return /^\+998\d{9}$/.test(phone.replace(/\s/g, ''))
}

// ─── localStorage (SSR-safe) ──────────────────────────────────────────────────
export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T } catch { return null }
  },
  set(key: string, value: unknown): void {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove(key: string): void {
    if (typeof window === 'undefined') return
    try { localStorage.removeItem(key) } catch {}
  },
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
