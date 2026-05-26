'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Package, Plus, ImagePlus, Tag, DollarSign, AlignLeft,
  ChevronDown, Store, Layers, BarChart2, ShoppingBag,
  CheckCircle2, X, ArrowLeft, Truck, Globe, Star, RefreshCw
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { CATEGORIES } from '@/config'
import { sellerApi } from '@/lib/api/client'
import { useAuthStore } from '@/store'
import { Spinner } from '@/components/ui'
import toast from 'react-hot-toast'
import type { Product, Order } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductForm {
  titleEn:     string
  titleUz:     string
  titleKo:     string
  category:    string
  origin:      'KR' | 'UZ' | ''
  priceUZS:    string
  priceKRW:    string
  originalUZS: string
  originalKRW: string
  description: string
  stockQty:    string
  weight:      string
  tags:        string
  images:      File[]
}

const EMPTY_FORM: ProductForm = {
  titleEn: '', titleUz: '', titleKo: '',
  category: '', origin: '', priceUZS: '', priceKRW: '',
  originalUZS: '', originalKRW: '', description: '',
  stockQty: '10', weight: '', tags: '', images: [],
}

const TABS = [
  { id: 'products',  label: 'My Products',  icon: Package },
  { id: 'add',       label: 'Add Product',  icon: Plus },
  { id: 'orders',    label: 'Orders',       icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics',    icon: BarChart2 },
]

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending:            'Pending',
  paid:               'Paid',
  processing:         'Processing',
  shipped:            'Shipped',
  delivered:          'Delivered',
  cancelled:          'Cancelled',
  refunded:           'Refunded',
}

export default function SellerPage() {
  const router       = useRouter()
  const qc           = useQueryClient()
  const { isAuthed } = useAuthStore()

  const [activeTab,  setActiveTab]  = useState<string>('products')
  const [form,       setForm]       = useState<ProductForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [step,       setStep]       = useState<0|1|2>(0)
  const fileRef = useRef<HTMLInputElement>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthed) router.replace('/auth')
  }, [isAuthed, router])

  function setF<K extends keyof ProductForm>(key: K, val: ProductForm[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleImages(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files).slice(0, 8 - form.images.length)
    setF('images', [...form.images, ...arr])
  }

  // ── Seller products query ─────────────────────────────────────────────────
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['seller', 'products'],
    queryFn:  () => sellerApi.getProducts(1, 50),
    enabled:  isAuthed,
  })

  // ── Seller orders query ───────────────────────────────────────────────────
  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['seller', 'orders'],
    queryFn:  () => sellerApi.getOrders(1, 50),
    enabled:  isAuthed && activeTab === 'orders',
  })

  const myProducts = productsData?.data ?? []
  const myOrders   = ordersData?.data   ?? []

  // ── Seller profile query (for analytics) ─────────────────────────────────
  const { data: profileRes } = useQuery({
    queryKey: ['seller', 'profile'],
    queryFn:  sellerApi.getProfile,
    enabled:  isAuthed && activeTab === 'analytics',
  })
  const sellerProfile = profileRes?.success ? profileRes.data : null

  async function handleSubmit() {
    if (!form.titleEn || !form.category || !form.origin || !form.priceUZS) {
      toast.error('Please fill in all required fields')
      return
    }
    if (!form.priceKRW) {
      toast.error('Please enter the price in KRW')
      return
    }
    setSubmitting(true)
    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      const res = await sellerApi.createProduct({
        title:         form.titleEn,
        description:   form.description,
        category:      form.category,
        priceUZS:      Number(form.priceUZS),
        priceKRW:      Number(form.priceKRW),
        stockQuantity: Number(form.stockQty) || 0,
        origin:        form.origin,
        tags,
      })

      if (!res.success) {
        toast.error(res.error ?? 'Failed to create product')
        return
      }

      toast.success('Product submitted for review! 🎉')
      setForm(EMPTY_FORM)
      setStep(0)
      setActiveTab('products')
      qc.invalidateQueries({ queryKey: ['seller', 'products'] })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthed) return null

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-surface-950">

      {/* ── Top Header ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="container-main">
          <div className="flex items-center gap-4 h-16">
            <button onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C1C1E] text-white shadow-brand">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">Seller Dashboard</div>
                <div className="text-[11px] text-zinc-400">KorUzMarket</div>
              </div>
            </div>

            {/* Live stats pills */}
            <div className="ml-auto hidden sm:flex items-center gap-3">
              {[
                {
                  label: 'Products',
                  value: String(productsData?.total ?? myProducts.length),
                  color: 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400',
                },
                {
                  label: 'Orders',
                  value: String(ordersData?.total ?? 0),
                  color: 'bg-cobalt-50 text-cobalt-700 dark:bg-cobalt-950/30 dark:text-cobalt-400',
                },
              ].map(s => (
                <span key={s.label} className={cn('rounded-full px-3 py-1 text-xs font-bold', s.color)}>
                  {s.value} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 pb-0 -mb-px overflow-x-auto scrollbar-none">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200',
                  activeTab === id
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                )}>
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-8 max-w-4xl">

        {/* ── My Products Tab ──────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">My Products</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetchProducts()}
                  className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button onClick={() => setActiveTab('add')}
                  className={cn(
                    'flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold text-white',
                    'bg-gradient-brand shadow-brand hover:opacity-90 active:scale-95 transition-all',
                    'overflow-hidden shine relative'
                  )}>
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
            </div>

            {productsLoading && (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            )}

            {!productsLoading && myProducts.length === 0 && (
              <div className="card-glass p-10 text-center">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="font-semibold text-zinc-600 dark:text-zinc-400">No products yet</p>
                <p className="text-sm text-zinc-400 mt-1">Click "Add Product" to list your first item</p>
              </div>
            )}

            {myProducts.length > 0 && (
              <div className="space-y-3">
                {myProducts.map((p, i) => (
                  <div key={p.id}
                    className="card-glass p-4 flex items-center gap-4 animate-fade-up"
                    style={{ animationDelay: `${i * 40}ms` }}>

                    <div className="h-14 w-14 rounded-xl flex-shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      {p.images[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.images[0].altText}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {p.origin === 'KR' ? '🇰🇷' : '🇺🇿'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {p.title.en ?? p.title.uz}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-zinc-500">{p.category}</span>
                        <span className="text-xs text-zinc-300 dark:text-zinc-600">·</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {p.priceUZS.toLocaleString()} UZS
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={cn(
                        'text-xs font-bold px-2.5 py-1 rounded-full',
                        p.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      )}>
                        {p.status === 'active' ? `${p.stockQty} in stock` : 'Out of stock'}
                      </span>
                      <span className="text-xs text-zinc-400">{p.soldCount} sold</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {productsError && (
              <div className="card-glass p-6 text-center text-red-500 text-sm">
                Failed to load products. Make sure you are logged in as a seller.
              </div>
            )}
          </div>
        )}

        {/* ── Add Product Tab ───────────────────────────────────────────── */}
        {activeTab === 'add' && (
          <div className="animate-fade-up space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">List a Product</h2>
              <p className="text-sm text-zinc-500 mt-1">Fill in the details below to list your product on KorUzMarket</p>
            </div>

            {/* Step progress */}
            <div className="flex items-center gap-2">
              {['Product Info', 'Pricing & Stock', 'Review & Publish'].map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all',
                    i < step   ? 'bg-emerald-500 text-white' :
                    i === step ? 'bg-gradient-brand text-white shadow-brand' :
                                 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                  )}>
                    {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={cn(
                    'text-xs font-semibold hidden sm:block whitespace-nowrap',
                    i === step ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'
                  )}>{s}</span>
                  {i < 2 && <div className={cn('flex-1 h-0.5 rounded-full', i < step ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700')} />}
                </div>
              ))}
            </div>

            {/* ── Step 0: Basic Info ────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="card-glass p-6 space-y-5">
                  <SectionTitle icon={<Package className="h-4 w-4" />} title="Product Details" />

                  {/* Origin selector */}
                  <div>
                    <label className="label">Product Origin *</label>
                    <div className="flex gap-3">
                      {([
                        { val: 'KR' as const, flag: '🇰🇷', label: 'Made in Korea' },
                        { val: 'UZ' as const, flag: '🇺🇿', label: 'Made in Uzbekistan' },
                      ] as const).map(({ val, flag, label }) => (
                        <button key={val} type="button" onClick={() => setF('origin', val)}
                          className={cn(
                            'flex-1 flex items-center gap-3 rounded-xl border-2 p-3.5 transition-all text-left',
                            form.origin === val
                              ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                          )}>
                          <span className="text-2xl">{flag}</span>
                          <div>
                            <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{val}</div>
                            <div className="text-xs text-zinc-500">{label}</div>
                          </div>
                          {form.origin === val && <CheckCircle2 className="h-5 w-5 ml-auto text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="label">Product Name (English) *</label>
                    <input type="text" value={form.titleEn}
                      onChange={e => setF('titleEn', e.target.value)}
                      placeholder="Korean Red Ginseng Extract 100ml"
                      className="input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Name in Uzbek</label>
                      <input type="text" value={form.titleUz}
                        onChange={e => setF('titleUz', e.target.value)}
                        placeholder="Koreya qizil ginseng…"
                        className="input" />
                    </div>
                    <div>
                      <label className="label">Name in Korean</label>
                      <input type="text" value={form.titleKo}
                        onChange={e => setF('titleKo', e.target.value)}
                        placeholder="한국 홍삼 추출물…"
                        className="input" />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="label">Category *</label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <select value={form.category}
                        onChange={e => setF('category', e.target.value)}
                        className="input pl-10 appearance-none">
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.icon} {c.en}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="label">Product Description</label>
                    <textarea value={form.description}
                      onChange={e => setF('description', e.target.value)}
                      placeholder="Describe your product — ingredients, benefits, usage instructions…"
                      rows={4}
                      className="input !h-auto py-3 resize-none" />
                    <p className="mt-1 text-xs text-zinc-400">{form.description.length}/2000 characters</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="label">Tags <span className="text-xs font-normal text-zinc-400">(comma-separated)</span></label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <input type="text" value={form.tags}
                        onChange={e => setF('tags', e.target.value)}
                        placeholder="ginseng, health, organic"
                        className="input pl-10" />
                    </div>
                  </div>
                </div>

                <StepNav onNext={() => {
                  if (!form.titleEn || !form.category || !form.origin) {
                    toast.error('Please fill in required fields')
                    return
                  }
                  setStep(1)
                }} />
              </div>
            )}

            {/* ── Step 1: Pricing & Stock ──────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="card-glass p-6 space-y-5">
                  <SectionTitle icon={<DollarSign className="h-4 w-4" />} title="Pricing & Inventory" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Price in UZS (som) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500">UZS</span>
                        <input type="number" value={form.priceUZS}
                          onChange={e => setF('priceUZS', e.target.value)}
                          placeholder="150000" min="0"
                          className="input pl-14" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Price in KRW (₩) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500">₩</span>
                        <input type="number" value={form.priceKRW}
                          onChange={e => setF('priceKRW', e.target.value)}
                          placeholder="15000" min="0"
                          className="input pl-10" />
                      </div>
                    </div>
                  </div>

                  {/* Discount preview */}
                  {form.priceUZS && form.originalUZS && Number(form.originalUZS) > Number(form.priceUZS) && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-3">
                      <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                        Discount: <strong>{Math.round((1 - Number(form.priceUZS) / Number(form.originalUZS)) * 100)}% off</strong>
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Stock Quantity *</label>
                      <div className="relative">
                        <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                        <input type="number" value={form.stockQty}
                          onChange={e => setF('stockQty', e.target.value)}
                          placeholder="50" min="0"
                          className="input pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Weight (grams)</label>
                      <div className="relative">
                        <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                        <input type="number" value={form.weight}
                          onChange={e => setF('weight', e.target.value)}
                          placeholder="250" min="0"
                          className="input pl-10" />
                      </div>
                    </div>
                  </div>
                </div>

                <StepNav onBack={() => setStep(0)} onNext={() => {
                  if (!form.priceUZS || !form.priceKRW) {
                    toast.error('Please enter prices in both UZS and KRW')
                    return
                  }
                  setStep(2)
                }} />
              </div>
            )}

            {/* ── Step 2: Review & Publish ─────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="card-glass p-6 space-y-5">
                  <SectionTitle icon={<ImagePlus className="h-4 w-4" />} title="Product Images" />

                  <div
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
                      'border-zinc-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700',
                      'hover:bg-brand-50/50 dark:hover:bg-brand-900/10'
                    )}>
                    <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                      onChange={e => handleImages(e.target.files)} />
                    <ImagePlus className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                    <p className="font-semibold text-sm text-zinc-600 dark:text-zinc-400">
                      Click to upload images
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">PNG, JPG up to 10MB · Up to 8 photos</p>
                    <p className="text-xs text-amber-500 mt-2">Note: Image upload requires MinIO storage to be configured</p>
                  </div>

                  {form.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {form.images.map((file, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
                          <img src={URL.createObjectURL(file)} alt="" className="object-cover w-full h-full" />
                          {i === 0 && (
                            <span className="absolute top-1 left-1 rounded-md bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5">
                              Main
                            </span>
                          )}
                          <button
                            onClick={() => setF('images', form.images.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pre-publish checklist */}
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-2">
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-3">Pre-publish checklist</p>
                    {[
                      { label: 'Product title (English)',  done: !!form.titleEn   },
                      { label: 'Category selected',        done: !!form.category  },
                      { label: 'Origin set (KR or UZ)',    done: !!form.origin    },
                      { label: 'Price in UZS',             done: !!form.priceUZS  },
                      { label: 'Price in KRW',             done: !!form.priceKRW  },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2.5">
                        <div className={cn(
                          'h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0',
                          item.done ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
                        )}>
                          {item.done && <CheckIcon className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <span className={cn('text-sm', item.done ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500')}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 h-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={cn(
                      'flex-1 h-12 rounded-xl font-bold text-sm text-white',
                      'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
                      'shadow-brand transition-all duration-200',
                      'flex items-center justify-center gap-2',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                      'overflow-hidden shine relative'
                    )}>
                    {submitting ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <><Globe className="h-4 w-4" /> Publish Product</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ───────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="animate-fade-up space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Orders</h2>
              <button
                onClick={() => refetchOrders()}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {ordersLoading && (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            )}

            {!ordersLoading && myOrders.length === 0 && (
              <div className="card-glass p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="font-semibold text-zinc-600 dark:text-zinc-400">No orders yet</p>
                <p className="text-sm text-zinc-400 mt-1">Orders for your products will appear here</p>
              </div>
            )}

            {myOrders.length > 0 && (
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div key={order.id} className="card-glass p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {new Date(order.orderedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={cn(
                        'text-xs font-bold px-2.5 py-1 rounded-full',
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      )}>
                        {ORDER_STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>{(order.items ?? []).length} items</span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {order.total.toLocaleString()} UZS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Analytics Tab ────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-up space-y-4">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: 'Listed Products',
                  value: String(productsData?.total ?? myProducts.length),
                  sub:   'Total listings',
                  color: 'from-zinc-800 to-zinc-900',
                },
                {
                  label: 'Total Orders',
                  value: String(ordersData?.total ?? 0),
                  sub:   'All time',
                  color: 'from-cobalt-500 to-cobalt-700',
                },
                {
                  label: 'Approval Status',
                  value: sellerProfile?.status ?? 'Check profile',
                  sub:   sellerProfile ? `Since ${new Date(sellerProfile.created_at ?? Date.now()).getFullYear()}` : 'Login as seller',
                  color: 'from-amber-500 to-orange-600',
                },
              ].map((s, i) => (
                <div key={s.label}
                  className={cn('rounded-2xl bg-gradient-to-br p-5 text-white shadow-card', s.color)}
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="text-white/70 text-sm font-medium mb-2">{s.label}</div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-white/60 text-xs mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card-glass p-8 text-center">
              <BarChart2 className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="font-semibold text-zinc-600 dark:text-zinc-400">Detailed analytics coming soon</p>
              <p className="text-sm text-zinc-400 mt-1">Revenue charts and conversion metrics will be shown here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helper components ────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-700/50">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C1C1E] text-white">
        {icon}
      </div>
      <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{title}</span>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StepNav({ onBack, onNext }: { onBack?: () => void; onNext: () => void }) {
  return (
    <div className="flex gap-3">
      {onBack && (
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 h-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}
      <button onClick={onNext}
        className={cn(
          'flex-1 h-12 rounded-xl font-semibold text-sm text-white',
          'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
          'shadow-brand transition-all duration-200',
          'flex items-center justify-center gap-2',
          'overflow-hidden shine relative'
        )}>
        Continue →
      </button>
    </div>
  )
}
