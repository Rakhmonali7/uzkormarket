'use client'

import { ProductCard }  from './product-card'
import { SkeletonCard, EmptyState } from '@/components/ui'
import { cn }           from '@/lib/utils'
import { Button }       from '@/components/ui'
import type { Product } from '@/types'
import Link from 'next/link'
import { ROUTES } from '@/config'
import { useLocale, useTranslations } from '@/hooks'

interface ProductGridProps {
  products?:  Product[]
  loading?:   boolean
  skeletons?: number
  className?: string
  columns?:   2 | 3 | 4
}

export function ProductGrid({ products = [], loading, skeletons = 8, className, columns = 4 }: ProductGridProps) {
  const { locale } = useLocale()
  const { tr } = useTranslations()

  const cols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }

  if (loading) {
    return (
      <div className={cn('grid gap-3 sm:gap-4', cols[columns], className)}>
        {Array.from({ length: skeletons }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        icon="🔍"
        title={tr('product_not_found')}
        description={tr('change_filters')}
        action={
          <Link href={ROUTES.products}>
            <Button variant="outline" size="sm">{tr('see_all')}</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className={cn('grid gap-3 sm:gap-4', cols[columns], className)}>
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 45}ms`, animationFillMode: 'both' } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
