import { ProductCard }  from './product-card'
import { SkeletonCard, EmptyState } from '@/components/ui'
import { cn }           from '@/lib/utils'
import { Button }       from '@/components/ui'
import type { Product } from '@/types'
import Link from 'next/link'
import { ROUTES } from '@/config'

interface ProductGridProps {
  products?:  Product[]
  loading?:   boolean
  skeletons?: number
  className?: string
  columns?:   2 | 3 | 4
}

export function ProductGrid({ products = [], loading, skeletons = 8, className, columns = 4 }: ProductGridProps) {
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
        title="Mahsulot topilmadi"
        description="Filtrlaring o'zgartirib ko'ring"
        action={
          <Link href={ROUTES.products}>
            <Button variant="outline" size="sm">Barchasini ko'rish</Button>
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
