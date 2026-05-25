'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Check, ArrowLeft, MapPin, CreditCard, ClipboardCheck,
  ExternalLink, Shield, Zap, Package, ChevronRight, ArrowRight,
} from 'lucide-react'
import { cn, formatPrice, getCurrency } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useLocale } from '@/hooks'
import { ordersApi } from '@/lib/api/client'
import { ROUTES } from '@/config'
import type { DeliveryAddress } from '@/types'
import toast from 'react-hot-toast'

type Step = 0 | 1 | 2

const STEPS = [
  { label: 'Delivery', icon: MapPin },
  { label: 'Payment',  icon: CreditCard },
  { label: 'Confirm',  icon: ClipboardCheck },
]

export default function CheckoutPage() {
  const router     = useRouter()
  const { locale } = useLocale()
  const { items, totalUZS, totalKRW, clearCart } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = locale === 'ko' ? totalKRW() : totalUZS()
  const DELIVERY = locale === 'ko' ? 3_000 : 20_000
  const total    = subtotal + DELIVERY

  const [step,    setStep]    = useState<Step>(0)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [address, setAddress] = useState<DeliveryAddress>({
    recipientName: '', phone: '', country: locale === 'ko' ? 'Korea' : 'Uzbekistan',
    region: '', city: '', street: '', apartment: '', notes: '',
  })
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard')
  const [paymentMethod,  setPaymentMethod]  = useState<'unired' | 'payme' | 'toss'>('unired')

  if (items.length === 0 && !orderId) {
    return (
      <div className="container-main py-24 text-center">
        <div className="text-5xl mb-5">🛒</div>
        <h2 className="font-display text-2xl font-bold text-zinc-800 mb-2">Your cart is empty</h2>
        <p className="text-zinc-400 mb-6 text-sm">Add some products before checking out</p>
        <Link href={ROUTES.products}>
          <button className="btn-brand h-11 px-7 inline-flex items-center gap-2 text-sm font-bold">
            Browse Products <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    )
  }

  async function placeOrder() {
    setPlacing(true)
    try {
      const orderData = {
        items: items.map(i => ({
          id:        `oi-${i.productId}`,
          productId: i.productId,
          product:   i.product,
          quantity:  i.quantity,
          unitPrice: locale === 'ko' ? i.product.priceKRW : i.product.priceUZS,
          currency,
        })),
        deliveryAddress: address,
        deliveryMethod,
        paymentMethod: paymentMethod === 'toss' ? 'toss' : paymentMethod === 'payme' ? 'payme' : 'bank_transfer',
        subtotal, deliveryFee: DELIVERY, discount: 0, total, currency,
        userId: 'user-me',
      }
      const res = await ordersApi.create(orderData as any)
      if (!res.success || !res.data) { toast.error(res.error ?? 'Order failed'); return }
      setOrderId(res.data.id)
      clearCart()
      toast.success('Order placed successfully! 🎉')
    } finally {
      setPlacing(false)
    }
  }

  if (orderId) {
    return (
      <div className="container-main py-16 pb-24">
        <div className="max-w-[500px] mx-auto">
          <div className="gl rounded-[32px] p-10 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 8px 28px rgba(16,185,129,0.38)' }}>
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="font-display text-[28px] font-bold text-zinc-900 mb-2">Order Placed!</h2>
            <p className="text-sm text-zinc-400 mb-5">
              Thank you for your order. We'll send confirmation to your email.
            </p>
            <div className="gl-pill px-5 py-3 inline-flex items-center gap-2 mb-7">
              <Package className="h-4 w-4 text-zinc-500" />
              <span className="text-sm font-bold text-zinc-600">Order #{orderId}</span>
            </div>
            <div className="space-y-3">
              {paymentMethod === 'unired' && (
                <a href={`https://unired.uz/pay?order_id=${orderId}&amount=${total}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-brand flex items-center justify-center gap-2 h-12 w-full text-sm font-bold">
                  Pay via Unired <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {paymentMethod === 'payme' && (
                <a href={`https://payme.uz/checkout/${orderId}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-brand flex items-center justify-center gap-2 h-12 w-full text-sm font-bold">
                  Pay via Payme <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Link href={ROUTES.home}>
                <button className="btn-glass h-12 w-full flex items-center justify-center gap-2 text-sm font-semibold">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-main py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={ROUTES.cart}>
          <button className="gl-icon h-10 w-10">
            <ArrowLeft className="h-4 w-4 text-zinc-500" />
          </button>
        </Link>
        <h1 className="font-display text-2xl font-bold text-zinc-900">Checkout</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-1">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2 flex-shrink-0">
            <div className={cn('step-dot', i < step ? 'done' : i === step ? 'active' : 'pending')}>
              {i < step ? <Check className="h-4 w-4" strokeWidth={3} /> : <span>{i + 1}</span>}
            </div>
            <span className={cn(
              'text-sm font-semibold',
              i === step ? 'text-zinc-800' : i < step ? 'text-emerald-600' : 'text-zinc-400'
            )}>{s.label}</span>
            {i < STEPS.length - 1 && (
              <div className={cn('w-8 h-0.5 rounded-full mx-1', i < step ? 'bg-emerald-400' : 'bg-zinc-200')} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Left: form ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Step 0: Delivery */}
          {step === 0 && (
            <div className="gl rounded-[28px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-zinc-900">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="Aziz Karimov"
                    value={address.recipientName} onChange={e => setAddress(a => ({ ...a, recipientName: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" placeholder="+998 90 123 4567"
                    value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Country</label>
                  <select className="input" value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}>
                    <option>Uzbekistan</option>
                    <option>Korea</option>
                  </select>
                </div>
                <div>
                  <label className="label">Region / Province</label>
                  <input className="input" placeholder="Tashkent"
                    value={address.region} onChange={e => setAddress(a => ({ ...a, region: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" placeholder="Tashkent"
                    value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Street Address</label>
                  <input className="input" placeholder="Amir Temur Street 15"
                    value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Apartment / Flat (optional)</label>
                  <input className="input" placeholder="Apt 4B"
                    value={address.apartment ?? ''} onChange={e => setAddress(a => ({ ...a, apartment: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Delivery Notes (optional)</label>
                  <input className="input" placeholder="Ring bell twice"
                    value={address.notes ?? ''} onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))} />
                </div>
              </div>

              <div>
                <p className="label mb-3">Delivery Method</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'standard' as const, label: 'Standard', desc: '7–14 days', price: DELIVERY, icon: '📦' },
                    { id: 'express'  as const, label: 'Express',  desc: '3–7 days',  price: DELIVERY * 2, icon: '⚡' },
                  ].map(opt => (
                    <button key={opt.id} type="button" onClick={() => setDeliveryMethod(opt.id)}
                      className={cn(
                        'relative flex items-center gap-3 p-4 rounded-2xl transition-all text-left',
                        deliveryMethod === opt.id ? 'ring-2 ring-red-500' : '',
                      )}
                      style={{
                        background: deliveryMethod === opt.id ? 'rgba(228,0,43,0.07)' : 'rgba(255,255,255,0.60)',
                        backdropFilter: 'blur(16px)',
                        border: deliveryMethod === opt.id ? '1px solid rgba(228,0,43,0.20)' : '1px solid rgba(255,255,255,0.80)',
                      }}>
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-zinc-800">{opt.label}</p>
                        <p className="text-xs text-zinc-400">{opt.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-zinc-700">{formatPrice(opt.price, currency, locale)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => {
                if (!address.recipientName || !address.phone || !address.city || !address.street) {
                  toast.error('Please fill in all required fields')
                  return
                }
                setStep(1)
              }} className="btn-brand w-full h-12 flex items-center justify-center gap-2 text-sm font-bold">
                Continue to Payment <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="gl rounded-[28px] p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-zinc-900">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'unired' as const, label: 'Unired',   desc: 'Bank transfer via Unired gateway',  icon: '🏦', available: true },
                  { id: 'payme'  as const, label: 'Payme',    desc: 'Pay via Payme wallet (Uzbekistan)',  icon: '📱', available: true },
                  { id: 'toss'   as const, label: 'Toss Pay', desc: 'Korean payment (Coming soon)',       icon: '🇰🇷', available: false },
                ].map(opt => (
                  <button key={opt.id} type="button"
                    disabled={!opt.available}
                    onClick={() => opt.available && setPaymentMethod(opt.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left',
                      !opt.available ? 'opacity-40 cursor-not-allowed' : '',
                      paymentMethod === opt.id ? 'ring-2 ring-red-500' : '',
                    )}
                    style={{
                      background: paymentMethod === opt.id ? 'rgba(228,0,43,0.07)' : 'rgba(255,255,255,0.60)',
                      backdropFilter: 'blur(16px)',
                      border: paymentMethod === opt.id ? '1px solid rgba(228,0,43,0.20)' : '1px solid rgba(255,255,255,0.80)',
                    }}>
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-zinc-800">{opt.label}</p>
                      <p className="text-xs text-zinc-400">{opt.desc}</p>
                    </div>
                    {paymentMethod === opt.id && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#E4002B,#b8001f)' }}>
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.16)' }}>
                <Shield className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-emerald-700">Your payment information is secure and encrypted</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-glass h-12 px-5 flex items-center gap-2 text-sm font-semibold">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={() => setStep(2)} className="btn-brand flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold">
                  Review Order <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="gl rounded-[28px] p-6 space-y-5">
              <h2 className="font-display text-xl font-bold text-zinc-900">Review & Confirm</h2>

              {/* Delivery summary */}
              <div className="rounded-2xl p-4 space-y-1"
                style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.75)' }}>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">Delivery To</p>
                <p className="text-sm font-semibold text-zinc-800">{address.recipientName}</p>
                <p className="text-sm text-zinc-500">{address.street}{address.apartment ? `, ${address.apartment}` : ''}</p>
                <p className="text-sm text-zinc-500">{address.city}, {address.region}, {address.country}</p>
                <p className="text-sm text-zinc-500">{address.phone}</p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Items ({items.length})</p>
                {items.map(item => {
                  const img = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
                  const price = locale === 'ko' ? item.product.priceKRW : item.product.priceUZS
                  return (
                    <div key={item.productId} className="flex items-center gap-3">
                      {img && (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.80)' }}>
                          <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="48px" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-800 clamp-1">
                          {item.product.title[locale] || item.product.title.uz}
                        </p>
                        <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-zinc-800 flex-shrink-0">
                        {formatPrice(price * item.quantity, currency, locale)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-glass h-12 px-5 flex items-center gap-2 text-sm font-semibold">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={placeOrder} disabled={placing}
                  className="btn-brand flex-1 h-12 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-60">
                  {placing ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  ) : (
                    <><Zap className="h-4 w-4" />Place Order</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ─────────────────────────────────────── */}
        <div>
          <div className="gl rounded-[28px] p-5 sticky top-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-zinc-900">Order Summary</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-none">
              {items.map(item => {
                const img   = item.product.images.find(i => i.isPrimary) ?? item.product.images[0]
                const price = locale === 'ko' ? item.product.priceKRW : item.product.priceUZS
                return (
                  <div key={item.productId} className="flex items-center gap-2.5">
                    {img && (
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(255,255,255,0.75)' }}>
                        <Image src={img.url} alt={img.altText} fill className="object-cover" sizes="44px" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-700 clamp-1">
                        {item.product.title[locale] || item.product.title.uz}
                      </p>
                      <p className="text-[11px] text-zinc-400">×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-700 flex-shrink-0">
                      {formatPrice(price * item.quantity, currency, locale)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-zinc-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Delivery ({deliveryMethod})</span>
                <span>{formatPrice(DELIVERY, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-100">
                <span>Total</span>
                <span className="text-gradient-brand">{formatPrice(total, currency, locale)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.14)' }}>
              <Shield className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-emerald-700 font-medium">Secure & encrypted checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
