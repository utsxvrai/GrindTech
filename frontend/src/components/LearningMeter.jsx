import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function LearningMeter({ progress = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md mx-auto mb-8"
    >
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-neon-green mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="font-mono text-sm tracking-widest uppercase font-bold">
              LEARNING PROGRESS
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
            Consistency is the key to mastery.
          </span>
        </div>
        <span className="text-white font-mono text-xl font-bold">
          {progress}%
        </span>
      </div>
      
      <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
          className="h-full bg-neon-green shadow-[0_0_20px_rgba(108,194,74,0.6)] relative"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
          
          {/* Tip Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_15px_2px_rgba(255,255,255,0.8)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
