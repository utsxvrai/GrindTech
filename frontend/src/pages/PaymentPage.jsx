import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, Loader2, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { createOrder, verifyPayment } from '../api/payment';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!isSignedIn) {
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      const orderAmount = 199; // Same as PricingSection (Pro plan)
      const orderResponse = await createOrder(orderAmount);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.amount, // backend returns object from createOrder
        currency: orderResponse.currency,
        name: "GrindTech",
        description: "Upgrade to Pro Plan",
        order_id: orderResponse.id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              clerkId: user.id
            };
            
            const verifyRes = await verifyPayment(verificationData);
            
            if (verifyRes.success) {
              alert("Payment Successful! You are now a Pro user.");
              // Successful upgrade, redirect to a meaningful page
              navigate('/preparation/nodejs');
              window.location.reload(); // Refresh to update Clerk user metadata if needed
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#6366f1", // Match PricingSection (indigo-glow)
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Ambience - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-black pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full relative z-10 flex items-center justify-center"
      >
        <div className="glass-strong border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(99,102,241,0.1)] relative overflow-hidden flex flex-col lg:flex-row w-full max-h-[90vh]">
          {/* Subtle top light effect */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-glow/50 to-transparent opacity-50" />

          {/* LEFT COLUMN: FEATURES & BRANDING */}
          <div className="flex-1 p-6 sm:p-8 lg:p-12 lg:border-r border-white/5 bg-white/[0.02] overflow-y-auto custom-scrollbar">
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <motion.div 
                   animate={{ rotate: [0, 5, -5, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="relative inline-block mb-4"
                >
                   <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-glow to-neon-purple flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                     <Zap className="w-6 h-6 text-black fill-current" />
                   </div>
                   <div className="absolute -top-1 -right-1">
                     <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                   </div>
                </motion.div>
                
                <h1 className="text-3xl lg:text-4xl font-black mb-3 tracking-tight leading-tight">
                  Upgrade to <br />
                  <span className="bg-gradient-to-r from-indigo-glow to-neon-purple bg-clip-text text-transparent italic">GrindTech Pro</span>
                </h1>
                <p className="text-gray-400 text-base max-w-sm">
                  Everything you need to master your technical interviews and land your dream role.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-6">
                {[
                  { text: "Unlimited Voice Answering (STT)", desc: "Talk naturally, just like a real interview.", icon: <Star className="w-4 h-4" /> },
                  { text: "GPT-4 Technical Analysis", desc: "Expert feedback on every single answer.", icon: <Star className="w-4 h-4" /> },
                  { text: "30+ Advanced Mastery Levels", desc: "Progressive difficulty across 10+ techs.", icon: <Star className="w-4 h-4" /> },
                  { text: "Pro Performance Dashboard", desc: "Detailed breakdown of your strengths.", icon: <Star className="w-4 h-4" /> }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all"
                  >
                    <div className="p-2 rounded-xl bg-indigo-glow/20 text-indigo-glow group-hover:scale-110 transition-transform flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm mb-0.5">{feature.text}</p>
                      <p className="text-gray-500 text-[10px] leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICE & CHECKOUT */}
          <div className="w-full lg:w-[380px] p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center bg-black/40 backdrop-blur-md">
            <div className="w-full max-w-xs">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                  <Shield className="w-3 h-3 text-indigo-glow" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">One-Time Payment</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-500 text-xl font-bold">₹</span>
                    <span className="text-6xl font-black text-white tracking-tighter">199</span>
                  </div>
                  <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">Lifetime Unlimited Access</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-glow to-neon-purple hover:scale-[1.02] active:scale-[0.98] text-black font-black text-lg transition-all shadow-[0_20px_40px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      INITIATING...
                    </>
                  ) : (
                    <>
                      UNLOCK PRO NOW
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                    <Shield className="w-4 h-4 text-indigo-glow" />
                    <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">Safe</span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4 text-indigo-glow" />
                    <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">Instant</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-glow/5 border border-indigo-glow/10 text-center mb-6">
                <p className="text-[9px] text-indigo-glow/80 font-medium leading-relaxed">
                  Join 1,000+ developers crushing their interviews with GrindTech Pro.
                </p>
              </div>

              <button 
                onClick={() => navigate(-1)}
                className="w-full py-1 text-xs text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest"
              >
                Cancel and return
              </button>
            </div>
          </div>
        </div>

        <p className="fixed bottom-4 left-0 right-0 text-center text-gray-600 text-[10px] font-medium pointer-events-none">
          Secure payment experience by Razorpay. Need help? <span className="text-indigo-glow hover:underline cursor-pointer pointer-events-auto">Support</span>
        </p>
      </motion.div>
    </div>
  );
}
