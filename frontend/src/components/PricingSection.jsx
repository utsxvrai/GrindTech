import { Check, Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { createOrder, verifyPayment } from '../api/payment'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion' // Fixed: Added missing import

const plans = [
  {
    name: 'Free',
    price: '0',
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
    price: '199',
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
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handlePayment = async (plan) => {
    if (!isSignedIn) {
      navigate('/auth')
      return
    }

    if (!plan.isPro) {
      navigate('/preparation/nodejs')
      return
    }

    setLoading(true)
    try {
      const orderAmount = 199; 
      const orderResponse = await createOrder(orderAmount)
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "GrindTech",
        description: "Upgrade to Pro Plan",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              clerkId: user.id
            }
            
            const verifyRes = await verifyPayment(verificationData)
            
            if (verifyRes.success) {
              alert("Payment Successful! You are now a Pro user.")
              window.location.reload()
            }
          } catch (err) {
            console.error("Verification failed", err)
            alert("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#6366f1",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment initiation failed", error)
      alert("Failed to initiate payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-deep-dark overflow-hidden">
      {/* Background Ambience - Enhanced */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-glow" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-glow">Flexible Pricing</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Ready to <span className="bg-gradient-to-r from-indigo-glow via-neon-purple to-neon-pink bg-clip-text text-transparent italic">Level Up?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Choose the plan that fits your ambition. Start for free, upgrade to dominate your next technical interview.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group flex flex-col h-full"
            >
              {plan.isPro && (
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-glow via-neon-purple to-neon-pink rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              )}

              <div className={`relative flex-1 flex flex-col p-8 sm:p-12 rounded-[2.5rem] transition-all duration-500 h-full backdrop-blur-xl ${
                plan.isPro 
                  ? 'bg-zinc-900/40 border-2 border-indigo-glow/30 shadow-[0_0_50px_rgba(99,102,241,0.1)]' 
                  : 'bg-zinc-900/20 border border-white/10'
              }`}>
                {plan.isPro && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-glow to-neon-purple rounded-full text-xs font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(99,102,241,0.4)] text-black">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended
                    </div>
                  </div>
                )}

                <div className="mb-10 text-center lg:text-left">
                  <h3 className={`text-2xl font-black uppercase tracking-widest mb-4 ${plan.isPro ? 'text-indigo-glow' : 'text-gray-400'}`}>
                    {plan.name} Plan
                  </h3>
                  <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-4">
                    <span className="text-6xl font-black text-white leading-none">
                      {plan.price === '0' ? 'Free' : `₹${plan.price}`}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">{plan.description}</p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05) }}
                      className="flex items-start gap-4"
                    >
                      <div className={`mt-1 w-6 h-6 rounded-lg ${
                        plan.isPro ? 'bg-indigo-glow/20 text-indigo-glow' : 'bg-white/5 text-gray-500'
                      } flex items-center justify-center flex-shrink-0 border border-white/5`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-300 font-medium leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
                    plan.isPro
                      ? 'bg-gradient-to-r from-indigo-glow to-neon-purple text-black shadow-indigo-glow/20'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                  onClick={() => handlePayment(plan)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    plan.isPro ? 'Dominate with Pro' : 'Started Journey'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
