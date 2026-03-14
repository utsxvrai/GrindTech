import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Server, Database, Globe, Cpu, Code2, Terminal, X } from 'lucide-react';

const technologies = [
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: Server,
    description: 'Master backend development with Node.js runtime',
    available: true,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    hover: 'hover:border-green-500/50'
  },
  {
    id: 'react',
    name: 'React',
    icon: Globe,
    description: 'Build modern user interfaces with React',
    available: true,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    hover: 'hover:border-cyan-400/50'
  },
  {
    id: 'python',
    name: 'Python',
    icon: Code2,
    description: 'Data structures and algorithms in Python',
    available: true,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    hover: 'hover:border-yellow-500/50'
  },
  {
    id: 'dbms',
    name: 'DBMS',
    icon: Database,
    description: 'Master core database management system concepts',
    available: true,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-500/50'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: Cpu,
    description: 'High-performance computing and algorithms',
    available: true,
    color: 'text-gray-300',
    bg: 'bg-gray-300/10',
    border: 'border-gray-300/20',
    hover: 'hover:border-gray-300/50'
  },
  {
    id: 'java',
    name: 'Java',
    icon: Terminal,
    description: 'Enterprise application development',
    available: true,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    hover: 'hover:border-orange-500/50'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: Code2,
    description: 'Master core JavaScript fundamentals',
    available: true,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    hover: 'hover:border-yellow-400/50'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: Code2,
    description: 'Type-safe JavaScript development',
    available: true,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-500/50'
  }
];

export default function TechSelection({ onClose }) {
  const navigate = useNavigate();

  const handleTechClick = (techId) => {
    navigate(`/preparation/${techId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-5xl bg-black/90 border border-white/90 rounded-2xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center mb-6 shrink-0">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Choose Your Path
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Select a technology to start your interview preparation journey.
            </p>
          </div>

          <div className="flex-grow overflow-y-auto p-2 scrollbar-hide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {technologies.map((tech) => (
                <motion.div
                  key={tech.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => tech.available && handleTechClick(tech.id)}
                  className={`
                    relative group p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-4
                    ${tech.available 
                      ? `${tech.bg} ${tech.border} ${tech.hover} cursor-pointer` 
                      : 'bg-gray-800/50 border-gray-700/50 opacity-60 cursor-not-allowed'}
                  `}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${tech.available ? 'bg-black/20' : 'bg-gray-700/20'}`}>
                    <tech.icon className={`w-6 h-6 ${tech.available ? tech.color : 'text-gray-500'}`} />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-base font-bold truncate ${tech.available ? 'text-white' : 'text-gray-400'}`}>
                        {tech.name}
                      </h3>
                      {!tech.available && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-800 rounded-full border border-gray-700 shrink-0">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 hidden sm:block">
                      {tech.description}
                    </p>
                  </div>

                  {tech.available && (
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
