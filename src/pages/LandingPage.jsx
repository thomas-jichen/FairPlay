import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import WinnersMarquee from '../components/landing/WinnersMarquee'
import BuiltBy from '../components/landing/BuiltBy'

export default function LandingPage() {
  return (
    <main>
      {/* Page 1: Hero */}
      <section className="snap-page flex items-center justify-center">
        <Hero />
      </section>

      {/* Page 2: Team */}
      <section id="team" className="snap-page flex flex-col justify-center">
        <WinnersMarquee />
        <BuiltBy />
      </section>

      {/* Page 3: Features */}
      <section id="features" className="snap-page flex flex-col justify-center">
        <Features />
      </section>
    </main>
  )
}
