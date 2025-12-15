import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
        // Call backend to upgrade user to Pro
        await api.put('/user/me/upgrade');
        
        // Simulate payment processing delay for better UX
        setTimeout(() => {
            setIsProcessing(false);
            navigate('/preparation/nodejs');
        }, 1500);
    } catch (error) {
        console.error("Payment failed:", error);
        setIsProcessing(false);
        alert("Failed to process payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green to-green-600 flex items-center justify-center shadow-lg shadow-neon-green/20">
              <Zap className="w-8 h-8 text-black" fill="currentColor" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Upgrade to Pro</h1>
          <p className="text-gray-400 text-center mb-8">Unlock unlimited practice and expert feedback.</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-gray-200">Unlock "Ideal Answers" for all questions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-gray-200">Detailed AI analysis & scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-gray-200">Premium badge & profile customization</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Due</p>
              <p className="text-2xl font-bold text-white">$19.00</p>
            </div>
            <div className="bg-neon-green/10 text-neon-green px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              One-time
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-neon-green hover:bg-[#5ab33e] text-black font-bold text-lg transition-all shadow-lg shadow-neon-green/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Complete Payment
              </>
            )}
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
