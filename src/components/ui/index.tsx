'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Button ───────────────────────────────────────────────────────────────────
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?:      'xs' | 'sm' | 'md' | 'lg'
  loading?:   boolean
  fullWidth?: boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary', size = 'md', loading = false,
  fullWidth, leftIcon, rightIcon, children, className, disabled, ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary:   'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-brand hover:shadow-brand-lg',
    secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
    ghost:     'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
    outline:   'border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-600',
    danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  }

  const sizes = {
    xs: 'h-7  px-2.5 text-xs  gap-1',
    sm: 'h-8  px-3   text-sm  gap-1.5',
    md: 'h-10 px-4   text-sm',
    lg: 'h-12 px-6   text-base',
  }

  return (
    <button ref={ref} disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading
        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        : leftIcon
      }
      {children}
      {!loading && rightIcon}
    </button>
  )
})
Button.displayName = 'Button'

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'brand' | 'success' | 'muted' | 'kr' | 'uz' | 'warning' | 'danger' | 'new'
  size?:    'sm' | 'md'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'muted', size = 'sm', children, className }: BadgeProps) {
  const variants = {
    brand:   'bg-zinc-100   text-zinc-700   dark:bg-zinc-800       dark:text-zinc-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    muted:   'bg-zinc-100   text-zinc-600   dark:bg-zinc-800       dark:text-zinc-400',
    kr:      'bg-red-50     text-red-700    dark:bg-red-900/30     dark:text-red-300',
    uz:      'bg-blue-50    text-blue-700   dark:bg-blue-900/30    dark:text-blue-300',
    warning: 'bg-amber-100  text-amber-700  dark:bg-amber-900/40   dark:text-amber-300',
    danger:  'bg-red-100    text-red-700    dark:bg-red-900/40     dark:text-red-300',
    new:     'bg-cobalt-500 text-white shadow-sm',
  }
  const sizes = { sm: 'px-2 py-0.5 text-[11px]', md: 'px-2.5 py-1 text-xs' }

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-semibold', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

// ─── Origin Badge ─────────────────────────────────────────────────────────────
export function OriginBadge({ origin }: { origin: 'KR' | 'UZ' }) {
  return origin === 'KR'
    ? <Badge variant="kr" size="sm">🇰🇷 Korea</Badge>
    : <Badge variant="uz" size="sm">🇺🇿 Uzbekistan</Badge>
}

// ─── Rating Stars ─────────────────────────────────────────────────────────────
export function Rating({ value, count, size = 'sm' }: { value: number; count?: number; size?: 'sm' | 'md' }) {
  const full  = Math.floor(value)
  const half  = value - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const sz    = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className={cn('text-amber-400', sz)}>
        {'★'.repeat(full)}{half ? '½' : ''}
        <span className="text-zinc-200 dark:text-zinc-700">{'★'.repeat(empty)}</span>
      </span>
      {count !== undefined && (
        <span className="text-zinc-400 dark:text-zinc-500 ml-0.5" style={{ fontSize: size === 'sm' ? 10 : 12 }}>
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-product w-full" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3.5 w-3/4 rounded-lg" />
        <Skeleton className="h-3.5 w-1/2 rounded-lg" />
        <Skeleton className="h-5 w-2/5 rounded-lg" />
      </div>
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const s = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return (
    <span className={cn('animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800 dark:border-zinc-700 dark:border-t-zinc-300 block', s[size], className)} />
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-4xl">
          {icon}
        </div>
      )}
      <div>
        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{title}</p>
        {description && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) return <hr className={cn('border-zinc-100 dark:border-zinc-800', className)} />
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800" />
      <span className="text-xs text-zinc-400 dark:text-zinc-500">{label}</span>
      <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800" />
    </div>
  )
}
