import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

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

function MeteorShower() {
  const meteors = useMemo(() => (
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: Math.random() * 60 + '%',
      left: Math.random() * 40 + '%',
      delay: Math.random() * 8,
      duration: Math.random() * 3 + 5,
      size: Math.random() * 1.5 + 0.5,
    }))
  ), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map(m => (
        <div
          key={m.id}
          className="absolute animate-meteor"
          style={{
            top: m.top,
            left: m.left,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        >
          <div
            className="rounded-full bg-gradient-to-r from-white/80 to-transparent"
            style={{
              width: `${m.size * 80}px`,
              height: `${m.size}px`,
              boxShadow: `0 0 ${m.size * 4}px rgba(255,255,255,0.3)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function FloatingParticles() {
  const particles = useMemo(() => (
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }))
  ), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
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

      {/* === Animated background layers === */}

      {/* Aurora blobs - slow morphing gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-indigo-600/[0.07] rounded-full blur-[150px] animate-aurora" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/[0.05] rounded-full blur-[150px] animate-aurora" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-purple-600/[0.04] rounded-full blur-[130px] animate-aurora" style={{ animationDelay: '8s' }} />
        <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-green-500/[0.03] rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '6s' }} />
      </div>

      {/* Animated grid */}
      <div className="absolute inset-0 animate-grid-fade" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Meteor shower */}
      <MeteorShower />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Radial spotlight from top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.1)_0%,_transparent_60%)]" />

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

        {/* Main headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
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

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 flex-wrap">
            <motion.span variants={wordVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              Interview
            </motion.span>
            <motion.span variants={wordVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight">
              Questions
            </motion.span>
          </div>

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

        {/* Tech pills */}
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
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: tech.color, boxShadow: `0 0 6px ${tech.shadow}` }}
              />
              <span className="text-sm font-medium text-gray-300">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons - polished */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-5 mb-16"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGetStarted}
            className="group relative w-full sm:w-auto overflow-hidden rounded-2xl"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-[2px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
            </div>
            <div className="relative bg-white rounded-[14px] px-10 py-4 flex items-center justify-center gap-3">
              <Zap className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-base text-black">Start Grinding</span>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1.5 group-hover:text-indigo-600 transition-all duration-300" />
            </div>
            {/* Shimmer sweep */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </div>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/payment')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-2xl"
          >
            {/* Subtle border */}
            <div className="absolute inset-0 rounded-2xl border border-white/[0.12] group-hover:border-white/[0.25] transition-colors duration-300" />
            <div className="relative px-10 py-4 flex items-center justify-center gap-2 bg-white/[0.03] group-hover:bg-white/[0.06] rounded-2xl backdrop-blur-sm transition-all duration-300">
              <span className="font-bold text-base text-gray-300 group-hover:text-white transition-colors duration-300">View Pricing</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex items-center justify-center gap-0 flex-wrap"
        >
          {[
            { value: '500+', label: 'Developers' },
            { value: '8', label: 'Technologies' },
            { value: '100+', label: 'Questions / tech' },
          ].map((stat, i, arr) => (
            <div key={i} className="flex items-center">
              <div className="text-center px-6 sm:px-10">
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1.5">{stat.label}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}
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
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
