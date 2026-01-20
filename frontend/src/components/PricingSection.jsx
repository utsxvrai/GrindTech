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
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {plan.isPro && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-glow/40 via-neon-purple/40 to-neon-pink/40 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              )}

              <div className={`relative h-full glass-strong p-8 rounded-3xl transition-all duration-300 ${
                plan.isPro ? 'border-2 border-indigo-glow/30' : 'border border-white/10'
              }`}>
                {plan.isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-indigo-glow to-neon-purple rounded-full text-sm font-bold shadow-lg">
                      <Sparkles className="w-4 h-4 text-black" />
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
                      className="flex items-start gap-3"
                    >
                      <div className={`w-6 h-6 rounded-full ${
                        plan.isPro ? 'bg-gradient-to-r from-indigo-glow to-neon-purple' : 'bg-white/20'
                      } flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
                    plan.isPro
                      ? 'bg-gradient-to-r from-indigo-glow to-neon-purple text-black'
                      : 'glass border-2 border-white/20 hover:border-indigo-glow/40'
                  }`}
                  onClick={() => handlePayment(plan)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    plan.isPro ? 'Upgrade to Pro' : 'Get Started Free'
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