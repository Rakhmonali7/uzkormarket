# KorUzMarket — Frontend

Cross-border marketplace connecting Korea 🇰🇷 and Uzbekistan 🇺🇿.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## Stack

| Layer        | Tech                              |
|--------------|-----------------------------------|
| Framework    | Next.js 14 (App Router)           |
| Language     | TypeScript (strict)               |
| Styling      | Tailwind CSS + custom tokens      |
| State        | Zustand (cart, UI, auth)          |
| Server state | TanStack Query v5                 |
| Fonts        | Playfair Display + Plus Jakarta Sans |
| Toasts       | react-hot-toast                   |
| Icons        | lucide-react                      |

---

## File Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── layout.tsx         # Root layout — fonts, providers, header, footer
│   ├── page.tsx           # Homepage
│   ├── products/
│   │   ├── page.tsx       # Products listing + filters
│   │   └── slug/page.tsx  # Product detail (rename folder to [slug])
│   ├── cart/page.tsx      # Cart
│   ├── checkout/page.tsx  # Checkout (3-step)
│   ├── account/page.tsx   # Orders history
│   └── auth/page.tsx      # Login / OTP
│
├── components/
│   ├── ui/                # Primitives: Button, Badge, Skeleton, Rating…
│   ├── layout/            # Header, Footer
│   ├── cart/              # CartDrawer
│   ├── product/           # ProductCard, ProductGrid
│   ├── home/              # Homepage sections
│   └── shared/            # Providers
│
├── hooks/index.ts         # useLocale, useTranslations, useProducts…
├── store/index.ts         # Zustand: cart, UI, auth
├── lib/
│   ├── api/
│   │   ├── client.ts      # API functions (mock + real toggle)
│   │   └── mock-data.ts   # 14 realistic products, 4 sellers
│   └── utils/index.ts     # cn, formatPrice, formatDate…
│
├── types/index.ts         # All TypeScript types
└── config/index.ts        # Routes, categories, feature flags
```

---

## Connect to Backend

1. Set `NEXT_PUBLIC_USE_REAL_API=true` in `.env.local`
2. Set `NEXT_PUBLIC_API_URL=https://your-api.com/api`
3. All API calls in `src/lib/api/client.ts` automatically switch to real endpoints

No other code needs to change. All function signatures stay identical.

---

## Feature Flags

In `src/config/index.ts`:

```ts
export const FEATURES = {
  darkMode:       true,
  wishlist:       true,
  paymeGateway:   false,   // flip to true in Phase 2
  clickGateway:   false,
  tossGateway:    false,
  liveTracking:   false,   // Phase 3
  recommendations:false,
  bnpl:           false,
}
```

---

## Rename for Dynamic Routes

The `products/slug/` folder must be renamed to `products/[slug]/` after download:

```bash
mv src/app/products/slug src/app/products/\[slug\]
```

---

## Deploy

```bash
# Vercel (recommended)
npx vercel

# Or build manually
npm run build
npm start
```

---

## Internationalization

Currently three locales: `uz`, `ru`, `ko`.

- UI strings: `src/hooks/index.ts` → `UI_STRINGS`
- Product titles/descriptions: `LocalizedString` type in every product
- Language switcher: in Header — persisted to localStorage via Zustand

---

## Adding a New Page

1. Create `src/app/your-page/page.tsx`
2. Add route to `src/config/index.ts` → `ROUTES`
3. Add nav link in `src/components/layout/header.tsx`

---

## Environment Variables

| Variable                    | Description                              |
|-----------------------------|------------------------------------------|
| `NEXT_PUBLIC_USE_REAL_API`  | `false` = mock data, `true` = real API   |
| `NEXT_PUBLIC_API_URL`       | Backend base URL                         |
| `NEXT_PUBLIC_R2_URL`        | Cloudflare R2 image CDN URL              |
