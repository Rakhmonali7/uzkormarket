'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api/client'
import { formatDate, formatPrice } from '@/lib/utils'
import { Spinner, EmptyState, Button } from '@/components/ui'
import { ROUTES, ORDER_STATUS } from '@/config'
import { useLocale } from '@/hooks'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending:            'bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-300',
  payment_confirmed:  'bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-300',
  processing:         'bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-300',
  packed:             'bg-indigo-100  text-indigo-700  dark:bg-indigo-900/30  dark:text-indigo-300',
  shipped:            'bg-violet-100  text-violet-700  dark:bg-violet-900/30  dark:text-violet-300',
  out_for_delivery:   'bg-brand-100   text-brand-700   dark:bg-brand-900/30   dark:text-brand-300',
  delivered:          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  cancelled:          'bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-300',
  returned:           'bg-stone-100   text-stone-600   dark:bg-stone-800       dark:text-stone-400',
}

export default function OrdersPage() {
  const { locale } = useLocale()
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', 'me'],
    queryFn:  ordersApi.getMyOrders,
  })

  return (
    <div className="container-main py-8 pb-16 max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">
        Mening buyurtmalarim
      </h1>

      {isLoading && (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      )}

      {!isLoading && !orders?.length && (
        <EmptyState
          icon="📦"
          title="Hali buyurtmalar yo'q"
          description="Buyurtma tarixi bu yerda ko'rsatiladi"
          action={
            <Link href={ROUTES.products}>
              <Button variant="primary">Xaridni boshlash</Button>
            </Link>
          }
        />
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderRow key={order.id} order={order} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderRow({ order, locale }: { order: Order; locale: string }) {
  const config = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]
  return (
    <div className="rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3 hover:border-stone-200 dark:hover:border-stone-700 transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-stone-900 dark:text-stone-100">
            Buyurtma #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-0.5">
            {formatDate(order.orderedAt, locale as any)}
          </p>
        </div>
        <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', STATUS_COLORS[order.status] ?? STATUS_COLORS.pending)}>
          {config?.uz ?? order.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
        <span>{order.items?.length ?? 0} ta mahsulot</span>
        <span className="font-bold text-stone-900 dark:text-white">
          {formatPrice(order.total, order.currency, locale as any)}
        </span>
      </div>
    </div>
  )
}
