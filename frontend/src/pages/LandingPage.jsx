import { SignedIn, useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import SocialProof from '../components/SocialProof'
import Footer from '../components/Footer'
import ScrollIndicator from '../components/ScrollIndicator'
import TechSelection from '../components/TechSelection'

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [showTechSelection, setShowTechSelection] = useState(false);

  // Show tech selection automatically when logged in
  useEffect(() => {
    if (isSignedIn) {
      setShowTechSelection(true);
    }
  }, [isSignedIn]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      setShowTechSelection(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SignedIn>
        {showTechSelection && (
          <TechSelection onClose={() => setShowTechSelection(false)} />
        )}
      </SignedIn>

      <ScrollIndicator />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <SocialProof />
      <Footer />
    </div>
  )
}
