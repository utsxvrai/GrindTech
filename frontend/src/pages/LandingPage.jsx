import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import VoiceDemo from '../components/VoiceDemo'
import PricingSection from '../components/PricingSection'
import SocialProof from '../components/SocialProof'
import Footer from '../components/Footer'
import ScrollIndicator from '../components/ScrollIndicator'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-deep-dark text-white">
      <ScrollIndicator />
      <HeroSection />
      <FeaturesSection />
      <VoiceDemo />
      <PricingSection />
      <SocialProof />
      <Footer />
    </div>
  )
}
