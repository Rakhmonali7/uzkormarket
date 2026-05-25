'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User, Package, Heart, Settings, LogOut, ChevronRight,
  Edit2, Phone, Mail, Globe, ShoppingBag, Clock, CheckCircle,
  Truck, XCircle, Star,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { useUIStore }   from '@/store'
import { ordersApi }    from '@/lib/api/client'
import { ROUTES }       from '@/config'
import type { Order }   from '@/types'
import toast from 'react-hot-toast'

type Tab = 'overview' | 'orders' | 'wishlist' | 'settings'

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:           { label: 'Pending',       color: 'text-amber-600',   icon: Clock        },
  payment_confirmed: { label: 'Paid',          color: 'text-blue-600',    icon: CheckCircle  },
  processing:        { label: 'Processing',    color: 'text-blue-600',    icon: Package      },
  packed:            { label: 'Packed',        color: 'text-indigo-600',  icon: Package      },
  shipped:           { label: 'Shipped',       color: 'text-purple-600',  icon: Truck        },
  out_for_delivery:  { label: 'Out for delivery', color: 'text-orange-600', icon: Truck      },
  delivered:         { label: 'Delivered',     color: 'text-emerald-600', icon: CheckCircle  },
  cancelled:         { label: 'Cancelled',     color: 'text-red-600',     icon: XCircle      },
  returned:          { label: 'Returned',      color: 'text-zinc-500',    icon: XCircle      },
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthed, clearAuth } = useAuthStore()
  const setAuthModal = useUIStore(s => s.setAuthModalOpen)

  const [tab,    setTab]    = useState<Tab>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthed) { router.push(ROUTES.login); return }
    setLoading(true)
    ordersApi.getMyOrders().then(o => { setOrders(o); setLoading(false) })
  }, [isAuthed, router])

  function handleLogout() {
    clearAuth()
    toast.success('Signed out')
    router.push(ROUTES.home)
  }

  if (!isAuthed || !user) return null

  const initials = user.name
    ? user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'U'

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',  label: 'Overview',  icon: User        },
    { id: 'orders',    label: 'Orders',    icon: ShoppingBag },
    { id: 'wishlist',  label: 'Wishlist',  icon: Heart       },
    { id: 'settings',  label: 'Settings',  icon: Settings    },
  ]

  return (
    <div className="container-main py-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="gl rounded-[28px] p-6 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#E4002B,#0052A2)', boxShadow: '0 8px 24px rgba(228,0,43,0.30)' }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : initials}
            </div>
            <h2 className="font-display text-lg font-bold text-zinc-900">{user.name || 'My Account'}</h2>
            {user.email && <p className="text-sm text-zinc-400 mt-0.5">{user.email}</p>}
            {user.phone && <p className="text-sm text-zinc-400">{user.phone}</p>}
            <div className="mt-4 gl-pill px-3 py-1.5 inline-flex items-center gap-2">
              <Star className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-semibold text-zinc-600">Member since {formatDate(user.createdAt, 'uz')}</span>
            </div>
          </div>

          {/* Nav */}
          <div className="gl rounded-[24px] p-2 space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                  tab === id ? 'text-white' : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60',
                )}
                style={tab === id ? {
                  background: 'linear-gradient(135deg,#E4002B,#b8001f)',
                  boxShadow: '0 4px 14px rgba(228,0,43,0.28)',
                } : {}}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </button>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div>
          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-zinc-900">Account Overview</h2>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Orders',   value: orders.length,                          icon: ShoppingBag, color: '#E4002B' },
                  { label: 'Delivered',      value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: '#10b981' },
                  { label: 'Wishlist Items', value: 0,                                      icon: Heart,       color: '#f59e0b' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="gl rounded-[22px] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-5 w-5" style={{ color }} />
                      <span className="font-display text-2xl font-bold text-zinc-900">{value}</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="gl rounded-[24px] divide-y divide-zinc-100">
                {[
                  { label: 'My Orders',        sub: 'Track and manage your orders', icon: Package,     action: () => setTab('orders')   },
                  { label: 'Wishlist',          sub: 'Saved items for later',        icon: Heart,       action: () => setTab('wishlist') },
                  { label: 'Account Settings',  sub: 'Update profile & password',    icon: Settings,    action: () => setTab('settings') },
                  { label: 'Browse Products',   sub: 'Discover new items',           icon: ShoppingBag, action: () => router.push(ROUTES.products) },
                ].map(({ label, sub, icon: Icon, action }) => (
                  <button key={label} onClick={action}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/40 transition-colors text-left first:rounded-t-[24px] last:rounded-b-[24px]">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(228,0,43,0.08)', border: '1px solid rgba(228,0,43,0.12)' }}>
                      <Icon className="h-4.5 w-4.5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-800">{label}</p>
                      <p className="text-xs text-zinc-400">{sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-zinc-900">My Orders</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-[22px]" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="gl rounded-[28px] p-12 text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="font-display text-lg font-bold text-zinc-700 mb-2">No orders yet</p>
                  <p className="text-sm text-zinc-400 mb-5">Start shopping to see your orders here</p>
                  <Link href={ROUTES.products}>
                    <button className="btn-brand h-10 px-6 inline-flex items-center gap-2 text-sm font-bold">
                      Browse Products
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => {
                    const cfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.pending
                    const Icon = cfg.icon
                    return (
                      <div key={order.id} className="gl rounded-[22px] p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-semibold text-zinc-900 text-sm">Order #{order.id}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">{formatDate(order.orderedAt, 'uz')}</p>
                          </div>
                          <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1', cfg.color)}
                            style={{ background: 'rgba(255,255,255,0.60)', backdropFilter: 'blur(8px)' }}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500">{order.items?.length ?? 0} item(s)</span>
                          <span className="font-bold text-zinc-900">
                            {order.total.toLocaleString()} {order.currency}
                          </span>
                        </div>
                        {order.trackingNumber && (
                          <div className="mt-3 text-xs text-zinc-400 gl-pill px-3 py-1.5 inline-flex items-center gap-1.5">
                            <Truck className="h-3 w-3" />
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          {tab === 'wishlist' && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-zinc-900">Wishlist</h2>
              <div className="gl rounded-[28px] p-12 text-center">
                <div className="text-4xl mb-4">❤️</div>
                <p className="font-display text-lg font-bold text-zinc-700 mb-2">Your wishlist is empty</p>
                <p className="text-sm text-zinc-400 mb-5">Save products you love to buy later</p>
                <Link href={ROUTES.products}>
                  <button className="btn-brand h-10 px-6 inline-flex items-center gap-2 text-sm font-bold">
                    Browse Products
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === 'settings' && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-zinc-900">Account Settings</h2>
              <div className="gl rounded-[28px] p-6 space-y-4">
                <h3 className="font-semibold text-zinc-800">Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input" defaultValue={user.name} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" defaultValue={user.email ?? ''} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" defaultValue={user.phone} placeholder="+998 90 123 4567" />
                  </div>
                  <div>
                    <label className="label">Language</label>
                    <select className="input">
                      <option value="uz">O'zbek</option>
                      <option value="ru">Русский</option>
                      <option value="ko">한국어</option>
                    </select>
                  </div>
                </div>
                <button className="btn-brand h-11 px-6 flex items-center gap-2 text-sm font-bold">
                  <Edit2 className="h-4 w-4" /> Save Changes
                </button>
              </div>

              <div className="gl rounded-[28px] p-6 space-y-4">
                <h3 className="font-semibold text-zinc-800">Security</h3>
                <div className="space-y-3">
                  <div>
                    <label className="label">Current Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <button className="btn-glass h-11 px-6 flex items-center gap-2 text-sm font-semibold">
                  Update Password
                </button>
              </div>

              <div className="gl rounded-[28px] p-6"
                style={{ border: '1px solid rgba(228,0,43,0.15)' }}>
                <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                <p className="text-sm text-zinc-400 mb-4">Permanently delete your account and all your data. This cannot be undone.</p>
                <button className="h-10 px-5 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
