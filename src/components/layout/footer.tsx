'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ROUTES, CATEGORIES } from '@/config'
import { useLocale, useTranslations } from '@/hooks'

export function Footer() {
  const { locale } = useLocale()
  const { tr } = useTranslations()

  const catLabel  = locale === 'uz' ? 'Kategoriyalar' : 'Categories'
  const linkLabel = locale === 'uz' ? 'Tezkor havolalar' : 'Quick Links'
  const suppLabel = locale === 'uz' ? 'Yordam' : 'Support'

  const quickLinks = [
    { href: ROUTES.products,      label: locale === 'uz' ? 'Barcha mahsulotlar' : 'All Products' },
    { href: ROUTES.origin('KR'),  label: locale === 'uz' ? 'Koreya mahsulotlari' : 'Korean Products' },
    { href: ROUTES.origin('UZ'),  label: locale === 'uz' ? "O'zbek mahsulotlari" : 'Uzbek Products' },
    { href: '/seller',            label: locale === 'uz' ? "KorUzMarket'da soting" : 'Sell on KorUzMarket' },
    { href: ROUTES.account,       label: tr('my_account') },
    { href: ROUTES.cart,          label: tr('cart') },
  ]

  const supportLinks = [
    { href: '#', label: locale === 'uz' ? 'Yordam markazi' : 'Help Center' },
    { href: '#', label: locale === 'uz' ? "Yetkazish haqida" : 'Shipping Info' },
    { href: '#', label: locale === 'uz' ? 'Qaytarish siyosati' : 'Returns Policy' },
    { href: '#', label: locale === 'uz' ? 'Foydalanish shartlari' : 'Terms of Service' },
    { href: '#', label: locale === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy' },
    { href: '#', label: locale === 'uz' ? 'Biz bilan bog\'lanish' : 'Contact Us' },
  ]

  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
      <div className="container-main py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <Link href={ROUTES.home} className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C1C1E] text-white font-bold shadow-brand">
                K
              </div>
              <span className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                KorUz<span className="text-gradient-brand">Market</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              {locale === 'uz'
                ? "Koreya va O'zbek mahsulotlari uchun ishonchli bozor. Chegaralar orqali ishonch bilan xarid qiling."
                : "Your trusted marketplace for Korean and Uzbek products. Shop across borders with confidence."
              }
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                🇰🇷 Korea
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
              <span className="rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                🇺🇿 Uzbekistan
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{catLabel}</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.value}>
                  <Link href={ROUTES.category(cat.value)}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    {locale === 'uz' ? cat.uz : cat.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{linkLabel}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{suppLabel}</h3>
            <ul className="space-y-2.5">
              {supportLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} KorUzMarket. {locale === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {locale === 'uz' ? "To'lov:" : 'Payment via'}
            </span>
            <span className="rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-xs font-bold text-cobalt-600 dark:text-cobalt-400">
              Unired
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
