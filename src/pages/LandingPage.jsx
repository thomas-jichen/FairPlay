import Hero from '../components/landing/Hero'
import WinnersMarquee from '../components/landing/WinnersMarquee'
import BuiltByFounders from '../components/landing/BuiltByFounders'
import Features from '../components/landing/Features'
import FooterCTA from '../components/landing/FooterCTA'

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden w-full">
      {/* Hero */}
      <section className="pt-28 pb-6 flex items-center justify-center">
        <Hero />
      </section>

      {/* Winners Marquee */}
      <section className="py-24 w-full">
        <WinnersMarquee />
      </section>

      {/* Features */}
      <section id="features" className="py-24 flex flex-col w-full">
        <Features />
      </section>

      {/* Built by Founders */}
      <section id="team" className="py-24 flex flex-col items-center justify-center w-full">
        <BuiltByFounders />
      </section>

      {/* Privacy & Footer */}
      <FooterCTA />
    </main>
  )
}
