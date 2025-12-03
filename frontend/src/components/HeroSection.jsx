import { motion } from 'framer-motion'
import { Sparkles, Target } from 'lucide-react'
import GrindTechVisual from './GrindTechVisual'

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden py-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-glow/10 via-neon-purple/5 to-neon-pink/10" />

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
            className="text-left"
          >
            {/* GrindTech Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              {/* Logo Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-glow via-neon-purple to-neon-pink flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-black" />
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-glow via-neon-purple to-neon-pink bg-clip-text text-transparent">
                  GrindTech
                </span>
                <span className="text-xs text-gray-400 font-medium -mt-1">AI Interview Prep</span>
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-glow/50 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-glow" />
              <span className="text-xs font-medium">AI Interview Preparation</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                Ace Technical
              </span>
              <br />
              <span className="text-white text-4xl sm:text-5xl md:text-6xl font-black">Interviews</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              Master Node.js, System Design, DevOps & more through real interview questions with instant AI evaluation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white rounded-full font-bold text-lg text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
              >
                Get Started
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
