import type { Product, Seller } from '@/types'

// ─── Sellers ──────────────────────────────────────────────────────────────────
export const SELLERS: Seller[] = [
  {
    id: 'seller-kr-1', businessName: 'Seoul Beauty Co.',
    country: 'KR', verificationStatus: 'verified',
    rating: 4.8, totalSales: 4820,
    logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop',
  },
  {
    id: 'seller-kr-2', businessName: 'K-Food Direct',
    country: 'KR', verificationStatus: 'verified',
    rating: 4.6, totalSales: 2310,
  },
  {
    id: 'seller-uz-1', businessName: "Samarqand Hunarmand",
    country: 'UZ', verificationStatus: 'verified',
    rating: 4.9, totalSales: 890,
  },
  {
    id: 'seller-uz-2', businessName: "O'zbek Taomi",
    country: 'UZ', verificationStatus: 'verified',
    rating: 4.7, totalSales: 1240,
  },
]

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  // ── Korean → Uzbekistan ────────────────────────────────────────────────────
  {
    id: 'prod-kr-01', slug: 'cosrx-snail-mucin-essence',
    title: {
      uz: 'COSRX Salyangoz essensi 96%',
      en: 'COSRX Advanced Snail 96 Mucin Power Essence',
    },
    description: {
      uz: "Koreya parvarishining eng mashhur mahsuloti. Terini tiklash, namlantirishga yordam beradi.",
      en: "Korea's best-selling skincare. Repairs and deeply hydrates skin with 96% snail secretion filtrate.",
    },
    category: 'beauty', origin: 'KR', sellerId: 'seller-kr-1',
    images: [
      { id: 'i1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=800&fit=crop', altText: 'COSRX Essence', isPrimary: true },
      { id: 'i2', url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=800&fit=crop', altText: 'Product detail', isPrimary: false },
    ],
    priceUZS: 185_000, priceKRW: 12_000,
    originalPriceUZS: 230_000, originalPriceKRW: 15_000,
    discountPercent: 20,
    stockQty: 48, status: 'active',
    tags: ['skincare', 'snail', 'essence'],
    rating: 4.8, reviewCount: 234, soldCount: 1205,
    isFeatured: true, isNew: false, shippingDays: 7,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'prod-kr-02', slug: 'laneige-lip-sleeping-mask',
    title: {
      uz: 'Laneige tungi lab niqobi',
      en: 'Laneige Lip Sleeping Mask',
    },
    description: {
      uz: "Tungi parvarishdagi eng mashhur koreya lab mahsuloti. 8 ta vitamini bilan lablarni tiklaydi.",
      en: "Korea's most popular overnight lip treatment. Repairs and nourishes lips with 8 berry extracts.",
    },
    category: 'beauty', origin: 'KR', sellerId: 'seller-kr-1',
    images: [
      { id: 'i3', url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2b39?w=600&h=800&fit=crop', altText: 'Lip mask', isPrimary: true },
    ],
    priceUZS: 145_000, priceKRW: 9_500,
    stockQty: 62, status: 'active',
    tags: ['beauty', 'lips', 'laneige'],
    rating: 4.9, reviewCount: 445, soldCount: 2180,
    isFeatured: true, isNew: false, shippingDays: 7,
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'prod-kr-03', slug: 'samyang-buldak-ramen-5pack',
    title: {
      uz: "Samyang Buldak ramen (5 ta to'plam)",
      en: 'Samyang Buldak Spicy Ramen (5-Pack)',
    },
    description: {
      uz: "Jahon bo'ylab mashhur koreya o'tkir ramen. Har bir quti qo'shimcha sous bilan.",
      en: "The world-famous Korean fire noodles. Each pack includes extra sauce for maximum heat.",
    },
    category: 'food', origin: 'KR', sellerId: 'seller-kr-2',
    images: [
      { id: 'i4', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=800&fit=crop', altText: 'Buldak ramen', isPrimary: true },
    ],
    priceUZS: 58_000, priceKRW: 3_800,
    originalPriceUZS: 72_000, originalPriceKRW: 4_700,
    discountPercent: 19,
    stockQty: 200, status: 'active',
    tags: ['food', 'ramen', 'spicy', 'samyang'],
    rating: 4.7, reviewCount: 512, soldCount: 3200,
    isFeatured: true, isNew: false, shippingDays: 7,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-kr-04', slug: 'innisfree-green-tea-serum',
    title: {
      uz: 'Innisfree Yashil choy serumi',
      en: 'Innisfree Jeju Green Tea Seed Serum',
    },
    description: {
      uz: "Jejudo organik yashil choyi bilan antioxidant serum. Porlarni toraytiradi.",
      en: "Antioxidant serum with organic green tea from Jeju Island. Minimizes pores and hydrates.",
    },
    category: 'beauty', origin: 'KR', sellerId: 'seller-kr-1',
    images: [
      { id: 'i5', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop', altText: 'Green tea serum', isPrimary: true },
    ],
    priceUZS: 210_000, priceKRW: 13_500,
    stockQty: 37, status: 'active',
    tags: ['skincare', 'serum', 'innisfree', 'green-tea'],
    rating: 4.7, reviewCount: 198, soldCount: 876,
    isFeatured: false, isNew: true, shippingDays: 7,
    createdAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 'prod-kr-05', slug: 'korean-sheet-mask-set-20',
    title: {
      uz: "Koreya yuz niqoblari (20 ta to'plam)",
      en: 'Korean Sheet Mask Set (20 Pack)',
    },
    description: {
      uz: "Turli xil formula: namlantirich, yorqinlik va qarishga qarshi. Dermatolog tomonidan sinovdan o'tgan.",
      en: "Variety formulas: hydrating, brightening, and anti-aging. Dermatologist tested.",
    },
    category: 'beauty', origin: 'KR', sellerId: 'seller-kr-1',
    images: [
      { id: 'i6', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=800&fit=crop', altText: 'Sheet masks', isPrimary: true },
    ],
    priceUZS: 120_000, priceKRW: 7_800,
    originalPriceUZS: 160_000, originalPriceKRW: 10_400,
    discountPercent: 25,
    stockQty: 120, status: 'active',
    tags: ['beauty', 'mask', 'sheet-mask'],
    rating: 4.6, reviewCount: 389, soldCount: 1890,
    isFeatured: false, isNew: false, shippingDays: 7,
    createdAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'prod-kr-06', slug: 'jeju-matcha-powder-100g',
    title: {
      uz: "Jeju organik matcha kukuni 100g",
      en: 'Jeju Organic Matcha Powder 100g',
    },
    description: {
      uz: "Jejudo orolidan keltirilgan organik matcha. Sutli ichimliklar va desertlar uchun.",
      en: "Organic matcha from Jeju Island. Perfect for lattes, desserts, and baking.",
    },
    category: 'food', origin: 'KR', sellerId: 'seller-kr-2',
    images: [
      { id: 'i7', url: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=800&fit=crop', altText: 'Matcha powder', isPrimary: true },
    ],
    priceUZS: 95_000, priceKRW: 6_200,
    stockQty: 85, status: 'active',
    tags: ['food', 'tea', 'matcha', 'organic'],
    rating: 4.6, reviewCount: 167, soldCount: 892,
    isFeatured: false, isNew: false, shippingDays: 7,
    createdAt: '2024-02-14T00:00:00Z',
  },
  {
    id: 'prod-kr-07', slug: 'anker-powercore-20000',
    title: {
      uz: 'Anker PowerCore 20000mAh quvvat banki',
      en: 'Anker PowerCore 20000mAh Portable Charger',
    },
    description: {
      uz: "3 qurilmani bir vaqtda zaryadlaydi. USB-C va USB-A portlari. Samolyotga ruxsat etilgan.",
      en: "Charges 3 devices simultaneously. USB-C and USB-A ports. Airline approved.",
    },
    category: 'electronics', origin: 'KR', sellerId: 'seller-kr-1',
    images: [
      { id: 'i8', url: 'https://images.unsplash.com/photo-1609592806596-b08e4e06e55d?w=600&h=800&fit=crop', altText: 'Powerbank', isPrimary: true },
    ],
    priceUZS: 385_000, priceKRW: 25_000,
    originalPriceUZS: 460_000, originalPriceKRW: 30_000,
    discountPercent: 16,
    stockQty: 23, status: 'active',
    tags: ['electronics', 'anker', 'powerbank'],
    rating: 4.9, reviewCount: 89, soldCount: 340,
    isFeatured: false, isNew: true, shippingDays: 7,
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'prod-kr-08', slug: 'black-garlic-honey-wellness',
    title: {
      uz: "Koreya qora sarimsoq asali (fermentlangan)",
      en: 'Korean Black Garlic Honey (Fermented)',
    },
    description: {
      uz: "90 kun davomida fermentlangan qora sarimsoq. Immunitetni mustahkamlaydi. 100% tabiiy.",
      en: "Fermented for 90 days. Boosts immunity and energy. 100% natural, no additives.",
    },
    category: 'health', origin: 'KR', sellerId: 'seller-kr-2',
    images: [
      { id: 'i9', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=800&fit=crop', altText: 'Black garlic', isPrimary: true },
    ],
    priceUZS: 165_000, priceKRW: 10_800,
    stockQty: 54, status: 'active',
    tags: ['health', 'garlic', 'wellness'],
    rating: 4.6, reviewCount: 112, soldCount: 456,
    isFeatured: false, isNew: false, shippingDays: 7,
    createdAt: '2024-02-28T00:00:00Z',
  },

  // ── Uzbek → Korea ──────────────────────────────────────────────────────────
  {
    id: 'prod-uz-01', slug: 'samarqand-atlas-ipak-shal',
    title: {
      uz: "Samarqand atlas ipak shol (qo'lda to'qilgan)",
      en: 'Samarkand Atlas Silk Scarf (Handwoven)',
    },
    description: {
      uz: "500 yillik an'anaviy Samarqand atlasi. Har biri qo'lda to'qilgan, noyob naqshlar bilan.",
      en: "500-year traditional Samarkand atlas silk. Each piece handwoven with unique patterns.",
    },
    category: 'fashion', origin: 'UZ', sellerId: 'seller-uz-1',
    images: [
      { id: 'i10', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop', altText: 'Silk scarf', isPrimary: true },
    ],
    priceUZS: 450_000, priceKRW: 29_000,
    stockQty: 15, status: 'active',
    tags: ['silk', 'handmade', 'samarkand', 'traditional'],
    rating: 5.0, reviewCount: 42, soldCount: 128,
    isFeatured: true, isNew: false, shippingDays: 10,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'prod-uz-02', slug: 'uzbek-plov-spice-set',
    title: {
      uz: "O'zbek oshi uchun ziravorlar to'plami (8 xil)",
      en: "Uzbek Plov Spice Set (8 Varieties)",
    },
    description: {
      uz: "Haqiqiy o'zbek oshi ta'mini yaratish uchun Farg'ona vodiysidan 8 xil ziravor.",
      en: "8 authentic spices from the Fergana Valley for making perfect Uzbek plov.",
    },
    category: 'food', origin: 'UZ', sellerId: 'seller-uz-2',
    images: [
      { id: 'i11', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=800&fit=crop', altText: 'Spice set', isPrimary: true },
    ],
    priceUZS: 85_000, priceKRW: 5_500,
    stockQty: 95, status: 'active',
    tags: ['food', 'spices', 'plov', 'uzbek'],
    rating: 4.8, reviewCount: 78, soldCount: 310,
    isFeatured: true, isNew: true, shippingDays: 10,
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'prod-uz-03', slug: 'bukhara-ceramic-bowl-set-6',
    title: {
      uz: "Buxoro keramika kosa to'plami (6 ta)",
      en: 'Bukhara Ceramic Bowl Set (6 Pieces)',
    },
    description: {
      uz: "An'anaviy Buxoro keramikasi. Har biri qo'lda bo'yalgan. Samsa, lag'mon uchun ideal.",
      en: "Traditional Bukhara ceramics. Each hand-painted. Perfect for samsa and lagman.",
    },
    category: 'home', origin: 'UZ', sellerId: 'seller-uz-1',
    images: [
      { id: 'i12', url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=800&fit=crop', altText: 'Ceramic bowls', isPrimary: true },
    ],
    priceUZS: 320_000, priceKRW: 20_800,
    stockQty: 22, status: 'active',
    tags: ['ceramic', 'handmade', 'bukhara', 'tableware'],
    rating: 4.9, reviewCount: 56, soldCount: 195,
    isFeatured: false, isNew: false, shippingDays: 12,
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'prod-uz-04', slug: 'uzbek-dried-fruits-premium-1kg',
    title: {
      uz: "O'zbek quritilgan mevalar to'plami 1 kg",
      en: 'Uzbek Premium Dried Fruits Set 1kg',
    },
    description: {
      uz: "Qo'qon bozoridan: o'rik, anjir, mayiz, xurmo. Qand qo'shilmagan, 100% tabiiy.",
      en: "From Kokand bazaar: apricots, figs, raisins, persimmon. No sugar added, 100% natural.",
    },
    category: 'food', origin: 'UZ', sellerId: 'seller-uz-2',
    images: [
      { id: 'i13', url: 'https://images.unsplash.com/photo-1605189430370-5c1efa5ff678?w=600&h=800&fit=crop', altText: 'Dried fruits', isPrimary: true },
    ],
    priceUZS: 110_000, priceKRW: 7_200,
    stockQty: 68, status: 'active',
    tags: ['food', 'dried-fruits', 'organic', 'uzbek'],
    rating: 4.7, reviewCount: 93, soldCount: 420,
    isFeatured: true, isNew: false, shippingDays: 10,
    createdAt: '2024-01-25T00:00:00Z',
  },
  {
    id: 'prod-uz-05', slug: 'suzani-wall-art-handembroidered',
    title: {
      uz: "Suzanna devor bezagi (qo'lda tikilgan)",
      en: 'Suzani Wall Art (Hand-Embroidered)',
    },
    description: {
      uz: "O'zbek ayollari tomonidan qo'lda tikilgan suzanna. Har biri noyob san'at asari.",
      en: "Hand-embroidered by Uzbek artisans. Each piece is a unique work of art.",
    },
    category: 'crafts', origin: 'UZ', sellerId: 'seller-uz-1',
    images: [
      { id: 'i14', url: 'https://images.unsplash.com/photo-1585778584273-bee28dd7dcf0?w=600&h=800&fit=crop', altText: 'Suzani embroidery', isPrimary: true },
    ],
    priceUZS: 680_000, priceKRW: 44_000,
    stockQty: 8, status: 'active',
    tags: ['art', 'handmade', 'embroidery', 'uzbek'],
    rating: 5.0, reviewCount: 28, soldCount: 64,
    isFeatured: true, isNew: false, shippingDays: 14,
    createdAt: '2024-02-08T00:00:00Z',
  },
  {
    id: 'prod-uz-06', slug: 'uzbek-silk-carpet-mini',
    title: {
      uz: "O'zbek ipak gilamlari (mini, 50×80 sm)",
      en: 'Uzbek Silk Mini Carpet (50×80cm)',
    },
    description: {
      uz: "Buxoro ustaxonasidan 100% ipak gilamcha. Naqshlar qo'lda chizilgan.",
      en: "100% silk carpet from Bukhara workshop. Patterns drawn and woven by hand.",
    },
    category: 'home', origin: 'UZ', sellerId: 'seller-uz-1',
    images: [
      { id: 'i15', url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&h=800&fit=crop', altText: 'Silk carpet', isPrimary: true },
    ],
    priceUZS: 890_000, priceKRW: 58_000,
    stockQty: 5, status: 'active',
    tags: ['silk', 'carpet', 'handmade', 'bukhara'],
    rating: 4.9, reviewCount: 19, soldCount: 47,
    isFeatured: false, isNew: true, shippingDays: 14,
    createdAt: '2024-04-01T00:00:00Z',
  },
]

// ─── Accessor helpers (used by mock API) ──────────────────────────────────────
export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug) ?? null
}
export function getFeatured() {
  return PRODUCTS.filter(p => p.isFeatured)
}
export function getNewArrivals() {
  return PRODUCTS.filter(p => p.isNew)
}
export function getByOrigin(origin: 'KR' | 'UZ') {
  return PRODUCTS.filter(p => p.origin === origin)
}
export function getByCategory(cat: string) {
  return PRODUCTS.filter(p => p.category === cat)
}
export function getSellerById(id: string) {
  return SELLERS.find(s => s.id === id) ?? null
}
