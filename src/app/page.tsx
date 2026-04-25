import { Hero, PromoBanner, TrustBar, CategoryGrid, FeaturedSection, SellerCTA } from '@/components/home/sections'

export default function HomePage() {
  return (
    <main className="flex flex-col gap-10 pb-20">
      <Hero />
      <PromoBanner />
      <TrustBar />
      <CategoryGrid />
      <FeaturedSection />
      <SellerCTA />
    </main>
  )
}
