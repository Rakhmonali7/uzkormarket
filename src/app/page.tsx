import {
  Hero, PromoBanner, TrustBar, CategoryGrid,
  OriginCards, StatsBar, FeaturedSection, NewArrivalsSection, SellerCTA,
} from '@/components/home/sections'

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8 pb-24">
      <Hero />
      <PromoBanner />
      <TrustBar />
      <CategoryGrid />
      <OriginCards />
      <FeaturedSection />
      <StatsBar />
      <NewArrivalsSection />
      <SellerCTA />
    </main>
  )
}
