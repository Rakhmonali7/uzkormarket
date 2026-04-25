// ────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Single source of truth for all domain types.
// When the backend is connected, these shapes must match API response contracts.
// ────────────────────────────────────────────────────────────────────────────

export type Locale   = 'uz' | 'ru' | 'ko'
export type Currency = 'UZS' | 'KRW'

export type LocalizedString = { uz: string; ru: string; ko: string }

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id:        string
  name:      string
  phone:     string
  email?:    string
  avatarUrl?: string
  locale:    Locale
  createdAt: string
}

// ─── Seller ───────────────────────────────────────────────────────────────────
export type SellerCountry       = 'KR' | 'UZ'
export type VerificationStatus  = 'pending' | 'verified' | 'rejected'

export interface Seller {
  id:                 string
  businessName:       string
  country:            SellerCountry
  logoUrl?:           string
  verificationStatus: VerificationStatus
  rating:             number
  totalSales:         number
}

// ─── Product ──────────────────────────────────────────────────────────────────
export type ProductOrigin   = 'KR' | 'UZ'
export type ProductStatus   = 'active' | 'draft' | 'out_of_stock' | 'archived'
export type ProductCategory =
  | 'beauty' | 'food' | 'electronics' | 'fashion'
  | 'home'   | 'health' | 'sports'   | 'kids' | 'crafts'

export interface ProductImage {
  id:        string
  url:       string
  altText:   string
  isPrimary: boolean
}

export interface Product {
  id:              string
  slug:            string
  title:           LocalizedString
  description:     LocalizedString
  category:        ProductCategory
  origin:          ProductOrigin
  sellerId:        string
  seller?:         Seller
  images:          ProductImage[]

  priceUZS:           number
  priceKRW:           number
  originalPriceUZS?:  number
  originalPriceKRW?:  number
  discountPercent?:   number

  stockQty:    number
  status:      ProductStatus
  tags:        string[]
  rating:      number
  reviewCount: number
  soldCount:   number
  isFeatured:  boolean
  isNew:       boolean
  shippingDays: number
  createdAt:   string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string
  product:   Product
  quantity:  number
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending' | 'payment_confirmed' | 'processing'
  | 'packed'  | 'shipped'          | 'out_for_delivery'
  | 'delivered'| 'cancelled'       | 'returned'

export type PaymentMethod  = 'bank_transfer' | 'payme' | 'click' | 'toss'
export type PaymentStatus  = 'pending' | 'confirmed' | 'failed' | 'refunded'
export type DeliveryMethod = 'standard' | 'express'

export interface DeliveryAddress {
  recipientName: string
  phone:         string
  country:       string
  region:        string
  city:          string
  street:        string
  apartment?:    string
  notes?:        string
}

export interface OrderItem {
  id:        string
  productId: string
  product:   Product
  quantity:  number
  unitPrice: number
  currency:  Currency
}

export interface Order {
  id:              string
  userId:          string
  items:           OrderItem[]
  status:          OrderStatus
  paymentMethod:   PaymentMethod
  paymentStatus:   PaymentStatus
  deliveryMethod:  DeliveryMethod
  deliveryAddress: DeliveryAddress
  subtotal:        number
  deliveryFee:     number
  discount:        number
  total:           number
  currency:        Currency
  trackingNumber?: string
  orderedAt:       string
  estimatedDelivery?: string
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id:               string
  productId:        string
  userId:           string
  userName:         string
  userAvatarUrl?:   string
  rating:           1 | 2 | 3 | 4 | 5
  body:             string
  images?:          string[]
  verifiedPurchase: boolean
  helpful:          number
  createdAt:        string
}

// ─── Pagination & API ─────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data:       T[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?:   T
  error?:  string
  message?: string
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface ProductFilters {
  category?:  ProductCategory
  origin?:    ProductOrigin
  minPrice?:  number
  maxPrice?:  number
  minRating?: number
  inStock?:   boolean
  sortBy?:    'newest' | 'price_asc' | 'price_desc' | 'rating' | 'bestseller'
  search?:    string
  page?:      number
  pageSize?:  number
}
