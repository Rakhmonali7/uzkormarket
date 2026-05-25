import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Currency, Locale, Product } from '@/types'

// ─── Class name merger ────────────────────────────────────────────────────────
// Use everywhere instead of template literals for Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price formatting ─────────────────────────────────────────────────────────
export function formatPrice(amount: number, currency: Currency, locale: Locale = 'uz'): string {
  if (currency === 'UZS') {
    return `${amount.toLocaleString('uz-UZ')} so'm`
  }
  return `₩${amount.toLocaleString('ko-KR')}`
}

export function getProductPrice(product: Product, locale: Locale): number {
  return locale === 'ko' ? product.priceKRW : product.priceUZS
}

export function getProductOriginalPrice(product: Product, locale: Locale): number | undefined {
  return locale === 'ko' ? product.originalPriceKRW : product.originalPriceUZS
}

export function getCurrency(locale: Locale): Currency {
  return locale === 'ko' ? 'KRW' : 'UZS'
}

// ─── Date utilities ───────────────────────────────────────────────────────────
const LOCALE_MAP: Record<Locale, string> = { uz: 'uz-UZ', ru: 'ru-RU', ko: 'ko-KR', en: 'en-US' }

export function formatDate(iso: string, locale: Locale = 'uz'): string {
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
export function isValidKrPhone(phone: string): boolean {
  return /^01[0-9]-?\d{4}-?\d{4}$/.test(phone.replace(/\s/g, ''))
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
