'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Phone, CreditCard, FileText, Globe, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { API_BASE_URL, USE_REAL_API, ROUTES } from '@/config'
import toast from 'react-hot-toast'

interface SellerForm {
  email:                      string
  password:                   string
  fullName:                   string
  businessName:               string
  businessRegistrationNumber: string
  businessAddress:            string
  bankAccountNumber:          string
  bankName:                   string
  phone:                      string
}

const EMPTY: SellerForm = {
  email: '', password: '', fullName: '',
  businessName: '', businessRegistrationNumber: '',
  businessAddress: '', bankAccountNumber: '', bankName: '', phone: '',
}

export default function SellerRegisterPage() {
  const router    = useRouter()
  const [form,    setForm]    = useState<SellerForm>(EMPTY)
  const [loading, setLoading] = useState(false)

  function setF<K extends keyof SellerForm>(key: K, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    if (!form.email || !form.password || !form.businessName || !form.businessRegistrationNumber) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      if (USE_REAL_API) {
        const res = await fetch(`${API_BASE_URL}/sellers/register`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:                        form.email,
            password:                     form.password,
            full_name:                    form.fullName,
            business_name:                form.businessName,
            business_registration_number: form.businessRegistrationNumber,
            business_address:             form.businessAddress,
            bank_account_number:          form.bankAccountNumber || undefined,
            bank_name:                    form.bankName || undefined,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          const detail = data.detail ?? data.message ?? 'Registration failed'
          const msg = Array.isArray(detail) ? detail.map((d: any) => d.msg).join('; ') : String(detail)
          toast.error(msg)
          return
        }
        toast.success('Application submitted! Our team will review it within 1-2 business days.')
        router.push(ROUTES.home)
      } else {
        // Mock mode
        await new Promise(r => setTimeout(r, 1200))
        toast.success('Application submitted! (mock mode)')
        router.push(ROUTES.home)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F2F2F7] dark:bg-surface-950 px-4 py-10">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob-brand w-[500px] h-[500px] -top-24 -right-24 animate-float" />
        <div className="blob-cobalt w-[400px] h-[400px] -bottom-16 -left-16 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      </div>

      <div className="relative w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <Link href={ROUTES.login} className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C1C1E] text-white shadow-brand">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Become a Seller</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Reach thousands of customers in Uzbekistan</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up" style={{ animationDelay: '60ms' }}>

          {/* Account info */}
          <div className="card-glass p-6 space-y-4" style={{ borderRadius: '20px' }}>
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" /> Account Information
            </h2>

            <div>
              <label className="label">Full Name *</label>
              <input type="text" value={form.fullName} onChange={e => setF('fullName', e.target.value)}
                placeholder="Kim Minjun" className="input" required />
            </div>
            <div>
              <label className="label">Email Address *</label>
              <input type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                placeholder="you@business.com" className="input" required autoComplete="email" />
            </div>
            <div>
              <label className="label">Password * <span className="text-xs font-normal text-zinc-400">(min. 8 characters)</span></label>
              <input type="password" value={form.password} onChange={e => setF('password', e.target.value)}
                placeholder="••••••••" className="input" required autoComplete="new-password" />
            </div>
          </div>

          {/* Business info */}
          <div className="card-glass p-6 space-y-4" style={{ borderRadius: '20px' }}>
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" /> Business Information
            </h2>

            <div>
              <label className="label">Business Name *</label>
              <input type="text" value={form.businessName} onChange={e => setF('businessName', e.target.value)}
                placeholder="Seoul Beauty Co., Ltd." className="input" required />
            </div>
            <div>
              <label className="label">Business Registration Number *</label>
              <input type="text" value={form.businessRegistrationNumber}
                onChange={e => setF('businessRegistrationNumber', e.target.value)}
                placeholder="123-45-67890" className="input" required />
            </div>
            <div>
              <label className="label">Business Address *</label>
              <input type="text" value={form.businessAddress}
                onChange={e => setF('businessAddress', e.target.value)}
                placeholder="123 Gangnam-daero, Seoul, South Korea" className="input" required />
            </div>
          </div>

          {/* Banking */}
          <div className="card-glass p-6 space-y-4" style={{ borderRadius: '20px' }}>
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Banking Details <span className="text-xs font-normal text-zinc-400">(optional)</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Bank Name</label>
                <input type="text" value={form.bankName}
                  onChange={e => setF('bankName', e.target.value)}
                  placeholder="KB Kookmin Bank" className="input" />
              </div>
              <div>
                <label className="label">Account Number</label>
                <input type="text" value={form.bankAccountNumber}
                  onChange={e => setF('bankAccountNumber', e.target.value)}
                  placeholder="123-456-78901234" className="input" />
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className={cn(
              'w-full h-12 rounded-xl font-semibold text-sm text-white',
              'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
              'shadow-brand transition-all duration-200',
              'flex items-center justify-center gap-2',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'overflow-hidden shine'
            )}>
            {loading ? (
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <><Sparkles className="h-4 w-4" /> Submit Application <ArrowRight className="h-4 w-4" /></>
            )}
          </button>

          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            Applications are reviewed within 1-2 business days. You'll receive an email with the next steps.
          </p>
        </form>
      </div>
    </div>
  )
}
