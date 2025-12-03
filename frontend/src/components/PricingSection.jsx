import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Start your interview prep journey',
    features: [
      'Unlimited text answering',
      '1 voice token per level',
      'Basic AI evaluation',
      'Access to 10 levels per domain',
      'Daily progress tracking',
    ],
    isPro: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Unlock your full potential',
    features: [
      'Unlimited voice answering',
      'Advanced AI evaluation (GPT-4)',
      'Access to all 30 levels',
      'Detailed analytics & weak topics',
      'Personalized improvement roadmap',
      'Priority support',
      'PRO badge on profile',
    ],
    isPro: true,
  },
]

export default function PricingSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-dark via-indigo-glow/3 to-deep-dark" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-indigo-glow to-neon-pink bg-clip-text text-transparent">
              Interview Prep Plan
            </span>
          </h2>
          <p className="text-lg text-gray-300">
            Start free, upgrade when you're ready to ace every technical interview
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeInOut" } }}
              className="relative group"
            >
              {/* Pro glow effect */}
              {plan.isPro && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-glow/40 via-neon-purple/40 to-neon-pink/40 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              )}

              <div className={`relative h-full glass-strong p-8 rounded-3xl transition-all duration-300 ${
                plan.isPro ? 'border-2 border-indigo-glow/30' : 'border border-white/10'
              }`}>
                {/* Pro badge */}
                {plan.isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-indigo-glow to-neon-purple rounded-full text-sm font-bold shadow-lg">
                      <Sparkles className="w-4 h-4" color="black" />
                      <span className="text-black">Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-3">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1 mb-4">
                    <span className="text-5xl font-black bg-gradient-to-r from-indigo-glow to-neon-purple bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-gray-400 mb-2">{plan.period}</span>}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + i * 0.05, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-6 h-6 rounded-full ${
                        plan.isPro ? 'bg-gradient-to-r from-indigo-glow to-neon-purple' : 'bg-white/20'
                      } flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                        <Check className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                    plan.isPro
                      ? 'bg-gradient-to-r from-indigo-glow to-neon-purple text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]'
                      : 'glass border-2 border-white/20 hover:border-indigo-glow/40'
                  }`}
                >
                  {plan.isPro ? 'Upgrade to Pro' : 'Get Started Free'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
