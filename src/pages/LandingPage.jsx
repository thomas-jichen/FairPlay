import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import TeamSection from '../components/landing/TeamSection'
import FooterCTA from '../components/landing/FooterCTA'

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pt-28 pb-6 flex items-center justify-center">
        <Hero />
      </section>

      {/* Team */}
      <section id="team" className="pt-6 pb-8 flex flex-col items-center justify-center w-full max-w-[100vw] overflow-hidden">
        <TeamSection />
      </section>

      {/* Features & Footer */}
      <section id="features" className="pt-8 pb-16 flex flex-col w-full max-w-[100vw] overflow-hidden">
        <Features />
      </section>

      <FooterCTA />
    </main>
  )
}
