import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mic2, Layers, Coins, Zap } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Level-Based Learning',
    description: '20-30 structured levels per domain. Progress from basics to advanced with real interview questions at each level.',
    gradient: 'from-indigo-glow to-neon-purple',
  },
  {
    icon: Zap,
    title: 'AI-Powered Evaluation',
    description: 'Get instant feedback on your answers with 1-10 scoring, correctness checks, and comparison with ideal interviewer responses.',
    gradient: 'from-neon-purple to-neon-pink',
  },
  {
    icon: Mic2,
    title: 'Voice & Text Answers',
    description: 'Answer interview questions via voice (with token system) or unlimited text. Practice like a real technical interview.',
    gradient: 'from-neon-pink to-indigo-glow',
  },
  {
    icon: Coins,
    title: 'Progress Analytics',
    description: 'Track daily streaks, weak topics, completion rates, and get personalized improvement roadmaps powered by AI.',
    gradient: 'from-indigo-glow via-neon-purple to-neon-pink',
  },
]

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-dark via-indigo-glow/5 to-deep-dark" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-indigo-glow via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Master Every Domain
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Node.js • System Design • DevOps • Cloud • DSA • Frontend • Databases & More
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="h-full glass-strong p-8 rounded-3xl border border-white/10 hover:border-indigo-glow/50 transition-all duration-300 relative overflow-hidden">
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-glow to-neon-purple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-black" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-glow">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-full blur-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
