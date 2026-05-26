'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowLeft, MapPin, CreditCard, ClipboardCheck, ExternalLink, Shield, Zap } from 'lucide-react'
import { cn, formatPrice, getCurrency } from '@/lib/utils'
import { useCartStore } from '@/store'
import { useLocale, useTranslations } from '@/hooks'
import { ordersApi } from '@/lib/api/client'
import { Button, Divider } from '@/components/ui'
import { ROUTES } from '@/config'
import type { DeliveryAddress } from '@/types'
import toast from 'react-hot-toast'

type Step = 0 | 1 | 2

const STEPS = [
  { label: 'Delivery',  icon: MapPin },
  { label: 'Payment',   icon: CreditCard },
  { label: 'Confirm',   icon: ClipboardCheck },
]

// ─── Unired payment config — replace with your actual bank account ─────────
const UNIRED_CONFIG = {
  // Your Unired merchant account. Replace with your actual data when connecting backend.
  // Payment link format: https://unired.uz/pay?merchant_id=YOUR_ID&amount=AMOUNT&order_id=ORDER_ID
  merchantId:  'YOUR_MERCHANT_ID',   // TODO: set your Unired merchant ID
  merchantName: 'KorUzMarket',
  currency:    'UZS',
  baseUrl:     'https://unired.uz/pay',
}

function buildUniredLink(orderId: string, amount: number) {
  // TODO: When backend is connected, generate this server-side for security.
  // This is a placeholder redirect URL structure for Unired payment gateway.
  const params = new URLSearchParams({
    merchant_id: UNIRED_CONFIG.merchantId,
    amount:      String(amount),
    order_id:    orderId,
    currency:    UNIRED_CONFIG.currency,
    description: `KorUzMarket Order #${orderId}`,
    return_url:  `${typeof window !== 'undefined' ? window.location.origin : ''}/orders`,
  })
  return `${UNIRED_CONFIG.baseUrl}?${params.toString()}`
}

export default function CheckoutPage() {
  const router     = useRouter()
  const { locale } = useLocale()
  const { tr }     = useTranslations()
  const { items, totalUZS, clearCart } = useCartStore()

  const currency = getCurrency(locale)
  const subtotal = totalUZS()
  const DELIVERY = 20_000
  const total    = subtotal + DELIVERY

  const [step,    setStep]    = useState<Step>(0)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [address, setAddress] = useState<DeliveryAddress>({
    recipientName: '',
    phone:         '',
    country:       'Uzbekistan',
    region:        '',
    city:          '',
    street:        '',
    apartment:     '',
    notes:         '',
  })

  useEffect(() => {
    if (!items.length) router.replace(ROUTES.cart)
  }, [items.length, router])

  if (!items.length) return null

  async function placeOrder() {
    setPlacing(true)
    try {
      const res = await ordersApi.create({
        items: items.map(i => ({
          productId: i.productId,
          quantity:  i.quantity,
        })),
        shippingAddress: {
          fullName:    address.recipientName,
          phoneNumber: address.phone,
          region:      address.region || address.city,
          city:        address.city,
          addressLine: [address.street, address.apartment].filter(Boolean).join(', '),
          notes:       address.notes,
        },
        paymentMethod: 'UNIRED',
      })
      if (res.success && res.data) {
        const newOrderId = res.data.id ?? `ORD-${Date.now()}`
        setOrderId(newOrderId)
        clearCart()
        setStep(2)
      } else {
        toast.error(res.error ?? 'Failed to place order. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  function handleUniredPay() {
    if (!orderId) return
    const link = buildUniredLink(orderId, total)
    window.open(link, '_blank', 'noopener,noreferrer')
    // After a delay, redirect to orders page
    setTimeout(() => router.push(ROUTES.orders ?? '/'), 3000)
  }

  const canNext0 = address.recipientName && address.phone && address.city && address.street

  return (
    <div className="container-main py-8 pb-20 max-w-4xl">

      {/* Back */}
      <button
        onClick={() => step === 0 ? router.push(ROUTES.cart) : setStep(s => (s - 1) as Step)}
        className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {step === 0 ? 'Back to Cart' : 'Back'}
      </button>

      {/* Step indicator */}
      <div className="mb-10 flex items-center">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                i < step   ? 'bg-gradient-brand text-white shadow-brand' :
                i === step ? 'bg-gradient-brand text-white shadow-brand ring-4 ring-brand-200 dark:ring-brand-900/40' :
                             'border-2 border-zinc-200 dark:border-zinc-700 text-zinc-400'
              )}>
                {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={cn(
                'hidden sm:block text-sm font-semibold transition-colors',
                i === step ? 'text-zinc-900 dark:text-zinc-100' : i < step ? 'text-brand-600' : 'text-zinc-400'
              )}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 mx-3 h-0.5 rounded-full transition-all duration-500',
                i < step ? 'bg-gradient-brand' : 'bg-zinc-200 dark:bg-zinc-800'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-10">

        {/* ── Form ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Step 0: Delivery Address */}
          {step === 0 && (
            <div className="animate-fade-up space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                  Delivery Address
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Where should we send your order?</p>
              </div>

              <div className="card-glass p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name" required colSpan="full"
                    value={address.recipientName}
                    onChange={v => setAddress(a => ({ ...a, recipientName: v }))}
                    placeholder="Aziza Karimova" />
                  <Field label="Phone Number" required
                    value={address.phone}
                    onChange={v => setAddress(a => ({ ...a, phone: v }))}
                    placeholder="+998 90 123 45 67" />
                  <Field label="City" required
                    value={address.city}
                    onChange={v => setAddress(a => ({ ...a, city: v }))}
                    placeholder="Tashkent" />
                  <Field label="Region / Province" colSpan="full"
                    value={address.region}
                    onChange={v => setAddress(a => ({ ...a, region: v }))}
                    placeholder="Tashkent Region" />
                  <Field label="Street Address" required colSpan="full"
                    value={address.street}
                    onChange={v => setAddress(a => ({ ...a, street: v }))}
                    placeholder="Amir Temur Street, 15" />
                  <Field label="Apartment / Office"
                    value={address.apartment ?? ''}
                    onChange={v => setAddress(a => ({ ...a, apartment: v }))}
                    placeholder="Apt 4B" />
                  <Field label="Delivery Notes" colSpan="full"
                    value={address.notes ?? ''}
                    onChange={v => setAddress(a => ({ ...a, notes: v }))}
                    placeholder="Leave at door, call on arrival…" />
                </div>
              </div>

              <button
                disabled={!canNext0}
                onClick={() => setStep(1)}
                className={cn(
                  'w-full h-12 rounded-xl font-semibold text-sm text-white',
                  'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
                  'shadow-brand transition-all duration-200',
                  'flex items-center justify-center gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'overflow-hidden shine relative'
                )}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment via Unired */}
          {step === 1 && (
            <div className="animate-fade-up space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                  Payment
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Secure payment via Unired gateway</p>
              </div>

              {/* Unired payment card */}
              <div className="card-glass p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cobalt text-white text-2xl font-bold shadow-cobalt flex-shrink-0" style={{ background: 'linear-gradient(135deg,#007AFF,#0052b0)' }}>
                    U
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white text-base">Unired Payment</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Fast & secure Uzbek payment gateway</div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-cobalt-50 dark:bg-cobalt-950/30 border border-cobalt-100 dark:border-cobalt-900/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-cobalt-700 dark:text-cobalt-400 font-semibold text-sm">
                    <Zap className="h-4 w-4" />
                    How it works
                  </div>
                  <ol className="text-sm text-cobalt-600 dark:text-cobalt-400 space-y-1 list-decimal list-inside">
                    <li>Click "Place Order & Pay" below</li>
                    <li>You will be redirected to Unired's secure payment page</li>
                    <li>Pay via your Uzbek bank card or account</li>
                    <li>Return here — your order will be confirmed automatically</li>
                  </ol>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                  <Shield className="h-3.5 w-3.5" />
                  Payments are processed securely by Unired. KorUzMarket does not store your card details.
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className={cn(
                  'relative w-full h-12 rounded-xl font-semibold text-sm text-white',
                  'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
                  'shadow-brand transition-all duration-200',
                  'flex items-center justify-center gap-2',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                  'overflow-hidden shine'
                )}
              >
                {placing ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>Place Order & Pay via Unired <ExternalLink className="h-4 w-4" /></>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Redirecting to Unired */}
          {step === 2 && (
            <div className="animate-fade-up space-y-5 text-center">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-300 dark:border-emerald-700 animate-ping opacity-50" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                    Order Created!
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1.5">
                    Order <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">#{orderId}</span> is ready.
                    <br />Complete your payment via Unired to confirm.
                  </p>
                </div>
              </div>

              <button
                onClick={handleUniredPay}
                className={cn(
                  'relative w-full h-14 rounded-2xl font-bold text-base text-white',
                  'bg-gradient-cobalt hover:opacity-90 active:scale-[0.98]',
                  'shadow-cobalt transition-all duration-200',
                  'flex items-center justify-center gap-3',
                  'overflow-hidden shine'
                )}
              >
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">U</div>
                Pay {formatPrice(total, currency, locale)} via Unired
                <ExternalLink className="h-4 w-4" />
              </button>

              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                You'll be redirected to Unired's secure payment page in a new tab.
                Your order will be confirmed once payment is received.
              </p>
            </div>
          )}
        </div>

        {/* ── Order Summary ─────────────────────────────────────────── */}
        <aside className="lg:col-span-2">
          <div className="card-glass p-5 space-y-4 sticky top-28">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Order Summary</h3>

            <div className="space-y-2.5 max-h-52 overflow-y-auto scrollbar-none">
              {items.map(item => (
                <div key={item.productId} className="flex gap-2 text-sm">
                  <span className="flex-1 clamp-2 text-zinc-600 dark:text-zinc-400">
                    {item.product.title[locale] ?? item.product.title.uz}
                    <span className="text-zinc-400 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="flex-shrink-0 font-bold text-zinc-900 dark:text-zinc-100">
                    {formatPrice(item.product.priceUZS * item.quantity, currency, locale)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency, locale)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>Delivery</span>
                <span>{formatPrice(DELIVERY, currency, locale)}</span>
              </div>
              <div className="flex justify-between font-bold text-zinc-900 dark:text-white pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <span>Total</span>
                <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(total, currency, locale)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 pt-1">
              <Shield className="h-3.5 w-3.5 flex-shrink-0" />
              Secure checkout powered by Unired
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ─── Field helper ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, required, colSpan }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; colSpan?: 'full'
}) {
  return (
    <div className={cn(colSpan === 'full' && 'col-span-2')}>
      <label className="label">
        {label}{required && <span className="ml-0.5 text-cobalt-500">*</span>}
      </label>
      <input
        type="text" value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  )
}
