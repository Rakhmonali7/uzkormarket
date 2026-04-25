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
      ru: 'COSRX Эссенция с муцином улитки 96%',
      ko: 'COSRX 어드밴시드 스네일 뮤신 에센스 96%',
    },
    description: {
      uz: "Koreya parvarishining eng mashhur mahsuloti. Terini tiklash, namlantirishga yordam beradi.",
      ru: "Самое популярное корейское средство ухода. Восстанавливает и увлажняет кожу.",
      ko: "피부 재생과 보습에 탁월한 한국 스킨케어의 베스트셀러.",
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
      ru: 'Laneige Ночная маска для губ',
      ko: '라네즈 립 슬리핑 마스크',
    },
    description: {
      uz: "Tungi parvarishdagi eng mashhur koreya lab mahsuloti. 8 ta vitamini bilan lablarni tiklaydi.",
      ru: "Самая популярная ночная маска для губ из Кореи. Восстанавливает с 8 витаминами.",
      ko: "한국에서 가장 인기 있는 립 나이트 케어. 8가지 비타민으로 입술을 회복.",
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
      ru: 'Samyang Buldak рамен (набор 5 шт)',
      ko: '삼양 불닭볶음면 (5개입)',
    },
    description: {
      uz: "Jahon bo'ylab mashhur koreya o'tkir ramen. Har bir quti qo'shimcha sous bilan.",
      ru: "Всемирно известный корейский острый рамен. Каждый пакет с дополнительным соусом.",
      ko: "세계적으로 유명한 불닭볶음면. 각 팩마다 추가 소스 포함.",
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
      ru: 'Innisfree Сыворотка с зелёным чаем',
      ko: 'innisfree 제주 그린티 씨드 세럼',
    },
    description: {
      uz: "Jejudo organik yashil choyi bilan antioxidant serum. Porlarni toraytiradi.",
      ru: "Антиоксидантная сыворотка с органическим зелёным чаем с Чеджудо.",
      ko: "제주도 유기농 녹차로 만든 안티옥시던트 세럼. 모공을 줄여줍니다.",
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
      ru: 'Корейские маски для лица (набор 20 шт)',
      ko: '한국 시트 마스크팩 세트 (20매)',
    },
    description: {
      uz: "Turli xil formula: namlantirich, yorqinlik va qarishga qarshi. Dermatolog tomonidan sinovdan o'tgan.",
      ru: "Разные формулы: увлажнение, сияние и антивозрастной уход. Дерматологически протестированы.",
      ko: "보습, 미백, 안티에이징 다양한 포뮬라. 피부과 테스트 완료.",
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
      ru: 'Органическая матча Чеджудо 100г',
      ko: '제주 유기농 말차 파우더 100g',
    },
    description: {
      uz: "Jejudo orolidan keltirilgan organik matcha. Sutli ichimliklar va desertlar uchun.",
      ru: "Органическая матча с острова Чеджудо. Для молочных напитков и десертов.",
      ko: "제주도 산 유기농 말차. 라떼와 디저트에 최적.",
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
      ru: 'Anker PowerCore 20000mAh внешний аккумулятор',
      ko: 'Anker PowerCore 보조배터리 20000mAh',
    },
    description: {
      uz: "3 qurilmani bir vaqtda zaryadlaydi. USB-C va USB-A portlari. Samolyotga ruxsat etilgan.",
      ru: "Заряжает 3 устройства одновременно. Порты USB-C и USB-A. Разрешён на борту.",
      ko: "3개 기기 동시 충전. USB-C, USB-A 포트. 기내 반입 허용.",
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
      ru: 'Корейский ферментированный чёрный чеснок с мёдом',
      ko: '한국 발효 흑마늘 꿀',
    },
    description: {
      uz: "90 kun davomida fermentlangan qora sarimsoq. Immunitetni mustahkamlaydi. 100% tabiiy.",
      ru: "Ферментирован 90 дней. Укрепляет иммунитет. 100% натуральный.",
      ko: "90일 숙성 발효 흑마늘. 면역 강화. 100% 천연.",
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
      ru: 'Шёлковый платок атлас из Самарканда (ручная работа)',
      ko: '사마르칸트 아틀라스 실크 스카프 (수공예)',
    },
    description: {
      uz: "500 yillik an'anaviy Samarqand atlasi. Har biri qo'lda to'qilgan, noyob naqshlar bilan.",
      ru: "Традиционный самаркандский атлас. Каждый соткан вручную с уникальными узорами.",
      ko: "500년 전통 사마르칸트 아틀라스. 각각 수작업으로 짠 독특한 패턴.",
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
      ru: 'Набор специй для узбекского плова (8 видов)',
      ko: '우즈베크 플로프 향신료 세트 (8종)',
    },
    description: {
      uz: "Haqiqiy o'zbek oshi ta'mini yaratish uchun Farg'ona vodiysidan 8 xil ziravor.",
      ru: "8 специй из Ферганской долины для настоящего плова.",
      ko: "정통 우즈베크 플로프를 위한 페르가나 계곡산 향신료 8종.",
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
      ru: 'Бухарский керамический набор пиал (6 шт)',
      ko: '부하라 세라믹 볼 세트 (6개)',
    },
    description: {
      uz: "An'anaviy Buxoro keramikasi. Har biri qo'lda bo'yalgan. Samsa, lag'mon uchun ideal.",
      ru: "Традиционная бухарская керамика. Каждая расписана вручную. Идеально для самсы и лагмана.",
      ko: "전통 부하라 도자기. 각각 손으로 그린 그림. 삼사, 라그만에 완벽.",
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
      ru: "Узбекские сухофрукты премиум 1 кг",
      ko: "우즈베크 프리미엄 말린 과일 세트 1kg",
    },
    description: {
      uz: "Qo'qon bozoridan: o'rik, anjir, mayiz, xurmo. Qand qo'shilmagan, 100% tabiiy.",
      ru: "С Кокандского базара: абрикос, инжир, изюм, хурма. Без сахара, 100% натуральный.",
      ko: "코칸드 시장에서: 살구, 무화과, 건포도, 감. 무설탕, 100% 천연.",
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
      ru: "Сюзане настенное украшение (ручная вышивка)",
      ko: "수자니 벽 장식 (수제 자수)",
    },
    description: {
      uz: "O'zbek ayollari tomonidan qo'lda tikilgan suzanna. Har biri noyob san'at asari.",
      ru: "Традиционное сюзане, вышитое вручную. Каждое — уникальное произведение искусства.",
      ko: "우즈베크 여성이 손으로 수놓은 수자니. 각각 독특한 예술 작품.",
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
      ru: "Узбекский шёлковый ковёр мини (50×80 см)",
      ko: "우즈베크 실크 미니 카펫 (50×80cm)",
    },
    description: {
      uz: "Buxoro ustaxonasidan 100% ipak gilamcha. Naqshlar qo'lda chizilgan.",
      ru: "100% шёлковый коврик из бухарской мастерской. Узоры нанесены вручную.",
      ko: "부하라 공방의 100% 실크 미니 카펫. 문양은 수작업으로 그림.",
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
