import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Hexagon, User, Zap } from 'lucide-react'; // Using Hexagon as generic Node icon placeholder if specific one not available
import { useState, useEffect } from 'react';
import TechCard from '../components/TechCard';
import LearningMeter from '../components/LearningMeter';

const modules = [
  // ... (modules array remains same, assuming it's outside component or I should preserve it)
  {
    id: 'event-loop',
    title: 'Event Loop',
    description: 'Reactor pattern & non-blocking I/O.',
    level: 0,
    status: 'unlocked'
  },
  {
    id: 'streams',
    title: 'Streams',
    description: 'Efficient data processing.',
    level: 1,
    status: 'locked'
  },
  {
    id: 'file-system',
    title: 'File System',
    description: 'Deep dive into fs module.',
    level: 1,
    status: 'locked'
  },
  {
    id: 'express',
    title: 'Express.js',
    description: 'Robust API development.',
    level: 2,
    status: 'locked'
  },
  {
    id: 'middleware',
    title: 'Middleware',
    description: 'Request-response cycle mastery.',
    level: 2,
    status: 'locked'
  },
  {
    id: 'cluster',
    title: 'Cluster',
    description: 'Multi-core scaling.',
    level: 3,
    status: 'locked'
  },
  {
    id: 'redis',
    title: 'Redis',
    description: 'High-performance caching.',
    level: 3,
    status: 'locked'
  },
  {
    id: 'async',
    title: 'Async Patterns',
    description: 'Advanced control flow.',
    level: 4,
    status: 'locked'
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Scalable system design.',
    level: 5,
    status: 'locked'
  },
  {
    id: 'microservices',
    title: 'Microservices',
    description: 'Distributed services.',
    level: 5,
    status: 'locked'
  }
];

export default function NodeJsPage() {
  const { user } = useUser();
  const [showMeter, setShowMeter] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isPro = false; // Mock status for now

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMeter(true);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-white relative overflow-hidden font-sans selection:bg-neon-green/30 flex flex-col">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 via-black/50 to-black pointer-events-none z-0" />

      {/* Floating orbs background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Header */}
      <header className="relative z-50 bg-transparent shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-green-700 flex items-center justify-center shadow-[0_0_20px_rgba(108,194,74,0.4)]">
                {/* Node JS Icon Placeholder - Hexagon shape is common for JS/Node */}
                <svg  xmlns="http://www.w3.org/2000/svg" width="28" height="28"  
fill="currentColor" viewBox="0 0 24 24" >
<path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314.496-.165.588-.201 1.101-.493.056-.037.129-.02.185.017l1.87 1.12c.074.036.166.036.221 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768c0-.091-.036-.165-.11-.201l-7.319-4.219c-.073-.037-.165-.037-.221 0L4.552 7.566c-.073.036-.11.129-.11.201v8.457c0 .073.037.166.11.202l2 1.157c1.082.548 1.762-.095 1.762-.735V8.502c0-.11.091-.221.22-.221h.936c.108 0 .22.092.22.221v8.347c0 1.449-.788 2.294-2.164 2.294-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 0 1-.771-1.34V7.786c0-.55.293-1.064.771-1.339l7.316-4.237a1.64 1.64 0 0 1 1.544 0l7.317 4.237c.479.274.771.789.771 1.339v8.458c0 .549-.293 1.063-.771 1.34l-7.317 4.236c-.241.11-.516.165-.773.165m2.256-5.816c-3.21 0-3.87-1.468-3.87-2.714 0-.11.092-.221.22-.221h.954c.11 0 .201.073.201.184.147.971.568 1.449 2.514 1.449 1.54 0 2.202-.35 2.202-1.175 0-.477-.185-.825-2.587-1.063-1.999-.2-3.246-.643-3.246-2.238 0-1.485 1.247-2.366 3.339-2.366 2.347 0 3.503.809 3.649 2.568a.3.3 0 0 1-.056.165c-.037.036-.091.073-.146.073h-.953a.21.21 0 0 1-.202-.164c-.221-1.012-.789-1.34-2.292-1.34-1.689 0-1.891.587-1.891 1.027 0 .531.237.696 2.514.99 2.256.293 3.32.715 3.32 2.294-.02 1.615-1.339 2.531-3.67 2.531"></path>
</svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none">
                  Grind<span className="text-neon-green">NodeJS</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Core Module</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Contribute Button */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-gray-300 hover:text-white">
              <Zap className="w-4 h-4 text-neon-green" />
              Contribute
            </button>

            {/* Profile Section with Mobile Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-white leading-none mb-1">
                    {user?.firstName || 'Guest'}
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPro ? 'bg-neon-green text-black' : 'bg-gray-800 text-gray-400'}`}>
                      {isPro ? 'PRO' : 'FREE'}
                    </span>
                    {!isPro && (
                      <button className="text-[10px] font-bold text-neon-green hover:underline">
                        UPGRADE
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden relative z-50">
                   {user?.imageUrl ? (
                     <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-5 h-5 text-gray-400" />
                   )}
                </div>
              </div>

              {/* Mobile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 z-50 md:hidden"
                  >
                    {/* Mobile Profile Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {user?.imageUrl ? (
                          <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-base font-bold text-white leading-none mb-1">
                          {user?.firstName || 'Guest'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPro ? 'bg-neon-green text-black' : 'bg-gray-800 text-gray-400'}`}>
                            {isPro ? 'PRO' : 'FREE'}
                          </span>
                          {!isPro && (
                            <button className="text-[10px] font-bold text-neon-green hover:underline">
                              UPGRADE
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        <Zap className="w-4 h-4 text-neon-green" />
                        Contribute
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col px-6 py-8 max-w-[1600px] mx-auto w-full overflow-hidden">
        
        {/* Learning Meter Area */}
        <div className="h-24 flex flex-col items-center justify-center mb-8 shrink-0">
          {!showMeter ? (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-400 text-lg font-semibold text-capitalize tracking-wider"
            >
              A COMPREHENSIVE PATH TO NODEJS MASTERY. UNLOCK MODULES LEVEL BY LEVEL.
            </motion.p>
          ) : (
            <LearningMeter progress={10} />
          )}
        </div>

        {/* Scrollable Grid Area */}
        <div className="flex-grow overflow-y-auto w-full pr-2 pb-20 scrollbar-hide">
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="h-28 w-64"
              >
                <TechCard 
                  {...module} 
                  isCurrent={index === 0} // Assuming first module is current for now
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
