import { motion } from 'framer-motion'
import { Sparkles, Target } from 'lucide-react'
import GrindTechVisual from './GrindTechVisual'
import { useNavigate } from 'react-router-dom'

export default function HeroSection({ onGetStarted }) {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/auth');
    }
  }

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-32 pb-20 lg:py-20 bg-black">
      {/* Animated gradient background - High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-glow/20 via-black to-black" />

      {/* Floating orbs background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 bg-indigo-glow/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-neon-pink/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* GrindTech Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-glow via-neon-purple to-neon-pink flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-black" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-glow via-neon-purple to-neon-pink bg-clip-text text-transparent">
                  GrindTech
                </span>
                <span className="text-xs text-gray-400 font-medium -mt-1">Ace Technical Interviews</span>
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-glow/50 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-glow" />
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-glow">AI Interview Preparation</span>
            </motion.div>
 
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
               <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                Ace Technical
              </span>
              <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                Interviews
              </span>
            </motion.h1>
 
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Master Node.js, System Design, DevOps & more through real interview questions with instant AI evaluation.
            </motion.p>
 
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-10 py-4 bg-white rounded-full font-black text-lg text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 font-bold">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer transition-transform duration-1000" />
              </motion.button>
 
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/payment')}
                className="w-full sm:w-auto px-10 py-4 bg-black/40 backdrop-blur-xl rounded-full font-black text-lg text-white border border-white/10 hover:border-white/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                View Pricing
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: GrindTech Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:flex relative h-[500px] items-center justify-center"
          >
            <GrindTechVisual />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-1.5 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
