import { motion } from 'framer-motion'
import { Zap, ChevronRight, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const techs = [
  { name: 'Node.js', color: '#6cc24a', shadow: 'rgba(108,194,74,0.4)' },
  { name: 'React', color: '#00FFFF', shadow: 'rgba(0,255,255,0.4)' },
  { name: 'Python', color: '#3776AB', shadow: 'rgba(55,118,171,0.4)' },
  { name: 'Java', color: '#ED8B00', shadow: 'rgba(237,139,0,0.4)' },
  { name: 'JavaScript', color: '#F7DF1E', shadow: 'rgba(247,223,30,0.4)' },
  { name: 'TypeScript', color: '#3178C6', shadow: 'rgba(49,120,198,0.4)' },
  { name: 'C++', color: '#FFFFFF', shadow: 'rgba(255,255,255,0.3)' },
  { name: 'DBMS', color: '#3b82f6', shadow: 'rgba(59,130,246,0.4)' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.3 }
  }
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

export default function HeroSection({ onGetStarted }) {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted()
    } else {
      navigate('/auth')
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4 sm:px-6">

      {/* === Background layers === */}
      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12)_0%,_transparent_70%)]" />
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(0,255,255,0.06)_0%,_transparent_70%)]" />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
      }} />

      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[8%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[130px] animate-float" />
      <div className="absolute bottom-[10%] right-[8%] w-96 h-96 bg-cyan-500/8 rounded-full blur-[130px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-green-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '5s' }} />

      {/* === Content === */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">AI-Powered Interview Preparation</span>
          </div>
        </motion.div>

        {/* Main headline - word-by-word reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {/* Line 1: Grind Top 100 */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <motion.span variants={wordVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              Grind
            </motion.span>
            <motion.span variants={wordVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              Top
            </motion.span>
            <motion.span variants={wordVariants} className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">100</span>
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
              />
            </motion.span>
          </div>

          {/* Line 2: Interview Questions */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 flex-wrap">
            <motion.span variants={wordVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              Interview
            </motion.span>
            <motion.span variants={wordVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              Questions
            </motion.span>
          </div>

          {/* Line 3: of Different Techs */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 flex-wrap">
            <motion.span variants={wordVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-500 tracking-tight">
              of
            </motion.span>
            <motion.span variants={wordVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Different Techs
            </motion.span>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Real interview questions. Instant AI evaluation. Level up across every technology that matters.
        </motion.p>

        {/* Tech pills - horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-12 max-w-3xl"
        >
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.06 }}
              whileHover={{
                scale: 1.08,
                boxShadow: `0 0 20px ${tech.shadow}`,
                borderColor: tech.color + '60'
              }}
              className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm flex items-center gap-2.5 cursor-default transition-all duration-300"
            >
              <div
                className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-offset-black"
                style={{ backgroundColor: tech.color, ringColor: tech.color + '40' }}
              />
              <span className="text-sm font-medium text-gray-300">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGetStarted}
            className="group relative w-full sm:w-auto px-10 py-4.5 bg-white rounded-2xl font-bold text-base text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all overflow-hidden flex items-center justify-center gap-3"
          >
            <Zap className="w-5 h-5" />
            <span>Start Grinding</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.25)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/payment')}
            className="w-full sm:w-auto px-10 py-4.5 bg-white/[0.03] backdrop-blur-sm rounded-2xl font-bold text-base text-white border border-white/[0.1] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2"
          >
            View Pricing
          </motion.button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap"
        >
          {[
            { value: '500+', label: 'Developers' },
            { value: '8', label: 'Technologies' },
            { value: '100+', label: 'Questions per tech' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-white/15 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            className="w-1 h-2 bg-white/40 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
