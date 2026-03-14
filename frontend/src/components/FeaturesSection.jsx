import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mic2, Layers, Zap, BarChart3, BookOpen, Shield } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Level-Based Learning',
    description: 'Structured levels per technology. Progress from basics to advanced with real interview questions at every step.',
    color: '#6cc24a',
  },
  {
    icon: Zap,
    title: 'AI-Powered Evaluation',
    description: 'Get instant feedback with scoring, correctness checks, and comparison with ideal interviewer responses.',
    color: '#00FFFF',
  },
  {
    icon: Mic2,
    title: 'Voice & Text Answers',
    description: 'Answer via voice or unlimited text. Practice explaining concepts clearly, just like a real interview.',
    color: '#F7DF1E',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Track completion rates across all technologies. See your growth and identify weak areas instantly.',
    color: '#3178C6',
  },
  {
    icon: BookOpen,
    title: 'Curated Resources',
    description: 'Each topic comes with handpicked learning resources so you can study before you get tested.',
    color: '#ED8B00',
  },
  {
    icon: Shield,
    title: 'Interview Experience Feed',
    description: 'Read and share real interview experiences. Learn what companies ask and how others approached it.',
    color: '#3776AB',
  },
]

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.05)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Why GrindTech</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Crack Interviews
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A complete system designed to take you from unprepared to unstoppable.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="h-full p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden">
                {/* Hover glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: feature.color + '15' }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: feature.color + '12' }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
