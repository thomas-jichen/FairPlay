import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import TeamSection from '../components/landing/TeamSection'
import FooterCTA from '../components/landing/FooterCTA'

export default function LandingPage() {
  return (
    <main>
      {/* Page 1: Hero */}
      <section className="snap-page flex items-center justify-center">
        <Hero />
      </section>

      {/* Page 2: Team */}
      <section id="team" className="snap-page flex flex-col items-center justify-center w-full h-full py-8 max-w-[100vw] overflow-hidden">
        <TeamSection />
      </section>

      {/* Page 3: Features & Footer */}
      <section id="features" className="snap-page flex flex-col justify-between w-full h-full max-w-[100vw] overflow-hidden">
        <div className="flex-grow flex flex-col justify-center">
          <Features />
        </div>
        <div className="w-full shrink-0">
          <FooterCTA />
        </div>
      </section>
    </main>
  )
}
