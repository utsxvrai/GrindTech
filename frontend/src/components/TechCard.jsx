import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function TechCard({ title, description, status, level, isCurrent }) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={`
        relative h-full w-full rounded-lg p-4 border transition-all duration-300 flex flex-col justify-between overflow-hidden
        ${isLocked
          ? 'bg-zinc-900 border-white/10 opacity-100 cursor-not-allowed'
          : 'bg-black/80 border-neon-green/30 hover:border-neon-green/60 hover:shadow-[0_0_25px_rgba(108,194,74,0.25)] cursor-pointer group backdrop-blur-md'}
      `}
    >
      {/* Background Texture/Gradient for Unlocked */}
      {/* Background Texture/Gradient for Unlocked */}
      {!isLocked && (
        <>
          {/* Dot Grid Pattern */}
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#6cc24a 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neon-green/30 via-transparent to-transparent" />
        </>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          {!isLocked && (
            <span className="px-1.5 py-0.5 rounded bg-neon-green text-black text-[10px] font-bold tracking-wider">
              LVL {level}
            </span>
          )}

          {/* Blinking Dot for Current */}
          {/* Blinking Dot for Current */}
          {isCurrent && (
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green shadow-[0_0_10px_2px_rgba(108,194,74,0.9)]"></span>
            </div>
          )}
        </div>

        {isLocked && <Lock className="w-3.5 h-3.5 text-gray-500" />}
        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />}
      </div>

      <h3 className={`relative z-10 text-sm font-bold tracking-wide uppercase mt-1 ${isLocked ? 'text-gray-400' : 'text-white group-hover:text-neon-green transition-colors'}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`relative z-10 text-[10px] leading-relaxed line-clamp-2 ${isLocked ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-300'}`}>
        {description}
      </p>

      {/* Decorative Elements for Unlocked */}
      {!isLocked && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-green/0 via-neon-green/50 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
    </motion.div>
  );
}
