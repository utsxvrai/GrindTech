import { motion } from 'framer-motion'
import { Code, Database, Server, Cpu, Brain, FileJson, Globe, GitBranch } from 'lucide-react'

const questionCards = [
  {
    icon: Code,
    title: 'Node.js',
    snippet: 'async/await',
    color: 'from-green-400 to-emerald-500',
    level: 'Level 3'
  },
  {
    icon: Database,
    title: 'System Design',
    snippet: 'Load Balancer',
    color: 'from-blue-400 to-cyan-500',
    level: 'Level 5'
  },
  {
    icon: Server,
    title: 'DevOps',
    snippet: 'Docker & K8s',
    color: 'from-purple-400 to-pink-500',
    level: 'Level 4'
  },
  {
    icon: Cpu,
    title: 'DSA',
    snippet: 'Binary Search',
    color: 'from-orange-400 to-red-500',
    level: 'Level 2'
  },
  {
    icon: FileJson,
    title: 'JavaScript',
    snippet: 'Closures',
    color: 'from-yellow-400 to-orange-500',
    level: 'Level 2'
  },
  {
    icon: Brain,
    title: 'ML/AI',
    snippet: 'Neural Nets',
    color: 'from-indigo-400 to-purple-500',
    level: 'Level 6'
  },
  {
    icon: Globe,
    title: 'Python',
    snippet: 'Decorators',
    color: 'from-sky-400 to-blue-500',
    level: 'Level 3'
  },
  {
    icon: GitBranch,
    title: 'Cloud',
    snippet: 'AWS/Azure',
    color: 'from-teal-400 to-cyan-500',
    level: 'Level 4'
  },
]

export default function GrindTechVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-indigo-glow/20 rounded-full blur-3xl" />
      </div>

      {/* Floating Question Cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {questionCards.map((card, index) => {
          const angle = (index * 360) / questionCards.length
          const radius = 180 // Increased from 150 for more spacing
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius

          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                delay: index * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 8, zIndex: 50 }}
                className="relative group"
              >
                {/* Card */}
                <div className="w-28 h-36 glass-strong rounded-xl p-3 border border-white/20 group-hover:border-white/40 transition-all cursor-pointer backdrop-blur-xl">
                  {/* Level badge */}
                  <div className="text-[9px] text-gray-400 mb-1.5">{card.level}</div>

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}>
                    <card.icon className="w-4 h-4 text-black" />
                  </div>

                  {/* Title */}
                  <div className="text-xs font-bold text-white mb-1.5">{card.title}</div>

                  {/* Code snippet */}
                  <div className="text-[10px] font-mono text-gray-400 bg-black/30 px-1.5 py-1 rounded leading-tight">
                    {card.snippet}
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-25 blur-xl rounded-xl transition-opacity`} />
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
