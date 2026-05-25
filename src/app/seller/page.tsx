'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Store, CheckCircle, TrendingUp, Users,
  Globe, Zap, ShieldCheck, Star, ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sellersApi } from '@/lib/api/client'
import { ROUTES } from '@/config'
import toast from 'react-hot-toast'

export default function SellerPage() {
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [applied,  setApplied]  = useState(false)

  const [form, setForm] = useState({
    businessName: '', email: '', phone: '',
    country: 'KR' as 'KR' | 'UZ', description: '',
  })

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await sellersApi.apply(form)
      if (!res.success) { toast.error(res.error ?? 'Application failed'); return }
      setApplied(true)
      toast.success("Application submitted! We'll contact you within 48 hours.")
    } finally {
      setLoading(false)
    }
  }

  const BENEFITS = [
    { icon: Users,      title: '50,000+ Customers',    desc: 'Access a growing customer base across Korea and Uzbekistan' },
    { icon: Globe,      title: 'Cross-Border Sales',   desc: 'Sell from Korea to Uzbekistan and vice versa with ease' },
    { icon: TrendingUp, title: 'Analytics Dashboard',  desc: 'Real-time sales analytics, trends, and performance insights' },
    { icon: ShieldCheck, title: 'Seller Protection',  desc: 'Secure payments, dispute resolution, and seller guarantees' },
    { icon: Zap,        title: 'Fast Onboarding',     desc: 'Get verified and start selling within 48 hours' },
    { icon: Star,       title: 'Featured Placement',  desc: 'Top sellers get featured on our homepage and promotions' },
  ]

  const TESTIMONIALS = [
    { name: 'Seoul Beauty Co.', country: '🇰🇷', stars: 5, text: 'KorUzMarket opened an entirely new market for us. Sales tripled in 3 months!' },
    { name: "O'zbek Taomi",     country: '🇺🇿', stars: 5, text: 'I can now reach Korean customers with our traditional Uzbek food products.' },
    { name: 'K-Food Direct',    country: '🇰🇷', stars: 5, text: 'The platform is easy to use and the support team is very responsive.' },
  ]

  if (applied) {
    return (
      <div className="container-main py-24 text-center">
        <div className="max-w-[440px] mx-auto animate-fade-up">
          <div className="gl rounded-[32px] p-10">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))', border: '2px solid rgba(16,185,129,0.25)' }}>
              🎉
            </div>
            <h2 className="font-display text-2xl font-bold text-zinc-900 mb-3">Application Submitted!</h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              Thank you <strong>{form.businessName}</strong>! Our team will review your application and get back to you within 48 hours at <strong>{form.email}</strong>.
            </p>
            <Link href={ROUTES.home}>
              <button className="btn-brand w-full h-12 flex items-center justify-center gap-2 text-sm font-bold">
                Back to Home <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="container-main py-10 pb-24">
        <button onClick={() => setShowForm(false)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-700 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="max-w-[560px] mx-auto">
          <div className="gl rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg,rgba(228,0,43,0.10),rgba(228,0,43,0.04))', border: '1px solid rgba(228,0,43,0.14)' }}>
                🏪
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-900">Apply to Sell</h2>
                <p className="text-sm text-zinc-400">We review applications within 48 hours</p>
              </div>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="label">Business / Store Name</label>
                <input className="input" required placeholder="Seoul Beauty Co."
                  value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address</label>
                  <input className="input" type="email" required placeholder="seller@business.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" required placeholder="+82 10 1234 5678"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Your Country</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'KR' as const, label: '🇰🇷 Korea',      desc: 'Korean seller' },
                    { id: 'UZ' as const, label: '🇺🇿 Uzbekistan', desc: 'Uzbek seller' },
                  ].map(opt => (
                    <button key={opt.id} type="button" onClick={() => setForm(f => ({ ...f, country: opt.id }))}
                      className={cn('p-3.5 rounded-2xl text-left transition-all', form.country === opt.id ? 'ring-2 ring-red-500' : '')}
                      style={{
                        background: form.country === opt.id ? 'rgba(228,0,43,0.07)' : 'rgba(255,255,255,0.60)',
                        backdropFilter: 'blur(16px)',
                        border: form.country === opt.id ? '1px solid rgba(228,0,43,0.20)' : '1px solid rgba(255,255,255,0.78)',
                      }}>
                      <p className="text-sm font-bold text-zinc-800">{opt.label}</p>
                      <p className="text-xs text-zinc-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Tell us about your business (optional)</label>
                <textarea className="input h-28 py-3 resize-none" placeholder="What products do you sell? What makes them unique?"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <button type="submit" disabled={loading}
                className="btn-brand w-full h-12 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-60">
                {loading
                  ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  : <><Store className="h-4 w-4" />Submit Application</>
                }
              </button>

              <p className="text-center text-xs text-zinc-400">
                By applying, you agree to our <a href="#" className="underline hover:text-zinc-600">Seller Terms</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="container-main pt-8 pb-6">
        <div className="hero-banner relative rounded-[32px] px-8 sm:px-14 py-14 text-center overflow-hidden">
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-[120px] opacity-[0.07] pointer-events-none select-none animate-drift">🛒</div>
          <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-[100px] opacity-[0.07] pointer-events-none select-none animate-drift" style={{ animationDelay: '5s' }}>📦</div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-[11px] font-bold text-white"
              style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.24)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now accepting sellers from Korea & Uzbekistan
            </div>
            <h1 className="font-display font-bold text-white text-balance mb-5"
              style={{ fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '-1px' }}>
              Grow Your Business<br />Across Borders
            </h1>
            <p className="text-base text-white/65 max-w-[500px] mx-auto mb-8 leading-relaxed">
              Join 200+ sellers on KorUzMarket and reach thousands of customers in Korea and Uzbekistan. Free to start, zero listing fees.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2.5 h-13 px-8 rounded-full text-sm font-bold text-zinc-900 transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', height: 52 }}>
                <Store className="h-4.5 w-4.5" />
                Apply to Sell Free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-sm font-semibold text-white/80 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="container-main">
        <div className="gl rounded-[24px] px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
            {[
              { value: '200+',   label: 'Active Sellers'   },
              { value: '50K+',   label: 'Customers'        },
              { value: '0%',     label: 'Listing Fees'     },
              { value: '48hr',   label: 'Approval Time'    },
            ].map(({ value, label }, i) => (
              <div key={label} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <p className="font-display text-2xl font-bold text-gradient-brand">{value}</p>
                <p className="text-xs font-semibold text-zinc-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-main">
        <h2 className="font-display text-3xl font-bold text-zinc-900 mb-2 text-center">Why Sell on KorUzMarket?</h2>
        <p className="text-sm text-zinc-400 text-center mb-8">Everything you need to succeed in cross-border commerce</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="gl-card rounded-[24px] p-6 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(228,0,43,0.08)', border: '1px solid rgba(228,0,43,0.12)' }}>
                <Icon className="h-5.5 w-5.5 text-red-500" />
              </div>
              <h3 className="font-display text-lg font-bold text-zinc-900 mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-main">
        <h2 className="font-display text-3xl font-bold text-zinc-900 mb-2 text-center">Seller Stories</h2>
        <p className="text-sm text-zinc-400 text-center mb-8">Hear from our top sellers</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ name, country, stars, text }, i) => (
            <div key={name} className="gl rounded-[24px] p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex mb-3">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={s <= stars ? 'text-amber-400' : 'text-zinc-200'}>★</span>
                ))}
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">"{text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#E4002B,#0052A2)' }}>
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">{name}</p>
                  <p className="text-xs text-zinc-400">{country} Seller</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-main">
        <div className="gl rounded-[32px] p-10 sm:p-14 text-center">
          <h2 className="font-display text-3xl font-bold text-zinc-900 mb-3">
            Ready to Start Selling?
          </h2>
          <p className="text-sm text-zinc-400 mb-7 max-w-sm mx-auto">
            Join KorUzMarket today. Free registration, zero listing fees, and a dedicated support team.
          </p>
          <button onClick={() => setShowForm(true)}
            className="btn-brand h-13 px-10 inline-flex items-center gap-2.5 text-sm font-bold"
            style={{ height: 52 }}>
            <Store className="h-4.5 w-4.5" />
            Apply to Sell — It's Free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
