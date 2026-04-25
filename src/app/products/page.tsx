'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/hooks'
import { ProductGrid } from '@/components/product/product-grid'
import { Button } from '@/components/ui'
import { CATEGORIES } from '@/config'
import type { ProductFilters, ProductCategory, ProductOrigin } from '@/types'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Yangi'            },
  { value: 'bestseller', label: "Ko'p sotilgan"    },
  { value: 'price_asc',  label: "Narx: arzon→qimmat" },
  { value: 'price_desc', label: "Narx: qimmat→arzon" },
  { value: 'rating',     label: 'Reyting'          },
] as const

export default function ProductsPage() {
  const router      = useRouter()
  const pathname    = usePathname()
  const sp          = useSearchParams()
  const [sideOpen, setSideOpen] = useState(false)

  const filters: ProductFilters = {
    category: (sp.get('category') as ProductCategory) || undefined,
    origin:   (sp.get('origin')   as ProductOrigin)   || undefined,
    search:    sp.get('search')   || undefined,
    sortBy:   (sp.get('sort') as ProductFilters['sortBy']) || 'newest',
    page:      Number(sp.get('page') || 1),
    pageSize:  24,
  }

  const { data, isLoading } = useProducts(filters)

  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(sp.toString())
    value ? params.set(key, value) : params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params}`, { scroll: false })
  }, [sp, router, pathname])

  const clearAll = () => router.push(pathname, { scroll: false })
  const hasFilters = !!(filters.category || filters.origin || filters.search)

  const pageTitle = filters.search
    ? `"${filters.search}" natijalari`
    : filters.category
      ? (CATEGORIES.find(c => c.value === filters.category)?.uz ?? 'Mahsulotlar')
      : filters.origin === 'KR' ? 'Koreya mahsulotlari 🇰🇷'
      : filters.origin === 'UZ' ? "O'zbek mahsulotlari 🇺🇿"
      : 'Barcha mahsulotlar'

  return (
    <div className="container-main py-8 pb-16">
      {/* Page head */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">
            {pageTitle}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {data.total} ta mahsulot topildi
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => setSideOpen(v => !v)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            className="lg:hidden"
          >
            Filtr
          </Button>

          <div className="relative">
            <select
              value={filters.sortBy ?? 'newest'}
              onChange={e => setParam('sort', e.target.value)}
              className="h-9 appearance-none rounded-xl border border-stone-200 bg-white px-3 pr-8 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className={cn(
          'w-52 flex-shrink-0 space-y-5',
          // Mobile: drawer overlay
          'hidden lg:block',
          sideOpen && 'fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-white dark:bg-stone-950 p-5 shadow-card-lg block lg:relative lg:inset-auto lg:z-auto lg:w-52 lg:shadow-none lg:p-0'
        )}>
          {/* Mobile header */}
          {sideOpen && (
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="font-semibold text-stone-900 dark:text-stone-100">Filtrlar</span>
              <button onClick={() => setSideOpen(false)}>
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>
          )}

          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-brand-500 font-semibold hover:text-brand-700">
              <X className="h-3.5 w-3.5" /> Filtrlni tozalash
            </button>
          )}

          {/* Origin filter */}
          <FilterGroup title="Kelib chiqishi">
            {([
              { v: '',   l: '🌐 Barchasi' },
              { v: 'KR', l: '🇰🇷 Korea'       },
              { v: 'UZ', l: "🇺🇿 O'zbekiston" },
            ] as const).map(opt => (
              <FilterChip
                key={opt.v}
                label={opt.l}
                active={filters.origin === opt.v || (!filters.origin && opt.v === '')}
                onClick={() => setParam('origin', opt.v || null)}
              />
            ))}
          </FilterGroup>

          {/* Category filter */}
          <FilterGroup title="Kategoriya">
            <FilterChip
              label="Barchasi"
              active={!filters.category}
              onClick={() => setParam('category', null)}
            />
            {CATEGORIES.map(cat => (
              <FilterChip
                key={cat.value}
                label={`${cat.icon} ${cat.uz}`}
                active={filters.category === cat.value}
                onClick={() => setParam('category', cat.value)}
              />
            ))}
          </FilterGroup>
        </aside>

        {/* Mobile sidebar backdrop */}
        {sideOpen && (
          <div className="fixed inset-0 z-30 bg-stone-950/40 lg:hidden" onClick={() => setSideOpen(false)} />
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={data?.data} loading={isLoading} skeletons={12} columns={3} />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setParam('page', String(p))}
                  className={cn(
                    'h-9 w-9 rounded-xl text-sm font-semibold transition-all duration-150',
                    filters.page === p
                      ? 'bg-brand-500 text-white shadow-brand'
                      : 'border border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-left transition-all duration-150',
        active
          ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/25 dark:text-brand-300'
          : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
      )}
    >
      {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-500 flex-shrink-0" />}
      {label}
    </button>
  )
}
