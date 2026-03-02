import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import WinnersMarquee from '../components/landing/WinnersMarquee'
import BuiltBy from '../components/landing/BuiltBy'
import FooterCTA from '../components/landing/FooterCTA'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <WinnersMarquee />
      <BuiltBy />
      <Features />
      <FooterCTA />
    </main>
  )
}
