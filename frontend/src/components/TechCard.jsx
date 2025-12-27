import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function TechCard({ title, description, status, level, isCurrent, accentColor = 'neon-green' }) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const colorMap = {
    'neon-green': {
      border: 'border-neon-green/30',
      borderHover: 'hover:border-neon-green/60',
      shadow: 'hover:shadow-[0_0_25px_rgba(108,194,74,0.25)]',
      badge: 'bg-neon-green text-black',
      dot: 'bg-neon-green',
      dotShadow: 'shadow-[0_0_10px_2px_rgba(108,194,74,0.9)]',
      text: 'text-neon-green',
      textHover: 'group-hover:text-neon-green',
      gradient: 'from-neon-green/30',
      bottomLine: 'via-neon-green/50',
      dynamicColor: '#6cc24a'
    },
    'blue-500': {
      border: 'border-blue-500/30',
      borderHover: 'hover:border-blue-500/60',
      shadow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]',
      badge: 'bg-blue-500 text-white',
      dot: 'bg-blue-500',
      dotShadow: 'shadow-[0_0_10px_2px_rgba(59,130,246,0.9)]',
      text: 'text-blue-500',
      textHover: 'group-hover:text-blue-500',
      gradient: 'from-blue-500/30',
      bottomLine: 'via-blue-500/50',
      dynamicColor: '#3b82f6'
    }
  };

  const colors = colorMap[accentColor] || colorMap['neon-green'];

  return (
    <motion.div
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={`
        relative h-full w-full rounded-lg p-4 border transition-all duration-300 flex flex-col justify-between overflow-hidden
        ${isLocked
          ? 'bg-zinc-900 border-white/10 opacity-100 cursor-not-allowed'
          : `bg-black/80 ${colors.border} ${colors.borderHover} ${colors.shadow} cursor-pointer group backdrop-blur-md`}
      `}
    >
      {/* Background Texture/Gradient for Unlocked */}
      {!isLocked && (
        <>
          {/* Dot Grid Pattern */}
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${colors.dynamicColor} 1px, transparent 1px)`,
              backgroundSize: '12px 12px'
            }}
          />
          {/* Subtle Gradient Overlay */}
          <div className={`absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] ${colors.gradient} via-transparent to-transparent`} />
        </>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          {/* Level Badge */}
          {!isLocked && (
            <span className={`px-1.5 py-0.5 rounded ${colors.badge} text-[10px] font-bold tracking-wider`}>
              LVL {level}
            </span>
          )}

          {/* Blinking Dot for Current */}
          {isCurrent && (
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot} ${colors.dotShadow}`}></span>
            </div>
          )}
        </div>

        {isLocked && <Lock className="w-3.5 h-3.5 text-gray-500" />}
        {isCompleted && <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text}`} />}
      </div>

      <h3 className={`relative z-10 text-sm font-bold tracking-wide uppercase mt-1 ${isLocked ? 'text-gray-400' : `text-white ${colors.textHover} transition-colors`}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`relative z-10 text-[10px] leading-relaxed line-clamp-2 ${isLocked ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-300'}`}>
        {description}
      </p>

      {/* Decorative Elements for Unlocked */}
      {!isLocked && (
        <>
          <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent ${colors.bottomLine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        </>
      )}
    </motion.div>
  );
}
