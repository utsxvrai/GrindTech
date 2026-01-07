import { useUser, useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Zap, Database } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import TechCard from '../components/TechCard';
import LearningMeter from '../components/LearningMeter';
import api from '../api/axios';
import TechPageLoader from '../components/TechPageLoader';
import TechTopicGenericModal from '../components/TechTopicGenericModal';


export default function DbmsPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [showMeter, setShowMeter] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userData, setUserData] = useState(null);

  // Dialog State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [fetchedTopics, setFetchedTopics] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMeter(true);
    }, 3000);

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            const userResponse = await api.get('/user/me',
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            if (userResponse.data && userResponse.data.data) {
                setUserData(userResponse.data.data);
                setIsPro(userResponse.data.data.plan === 'pro');
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const fetchTopics = async () => {
        try {
            const techResponse = await api.get('/tech/name/DBMS');
            if (techResponse && techResponse.data && techResponse.data.data) {
                const techId = techResponse.data.data.techId;
                const topicsResponse = await api.get(`/topic/tech/${techId}`);
                if (topicsResponse.data && Array.isArray(topicsResponse.data.data)) {
                    setFetchedTopics(topicsResponse.data.data);
                }
            }
        } catch (error) {
            console.error("Failed to initialize topics:", error);
        }
    };

    fetchUserData();
    fetchTopics();

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (module, index) => {
    // Pro users can access all cards, free users have level-based restrictions
    if (!isPro) {
      const isLocked = index > (user?.publicMetadata?.levelsDone || user?.levelsDone || 0);
      if (isLocked) return;
    }

    setSelectedTopic(module);
  };

  const getCleanTopicName = (name) => {
      return name.replace(/[- ]\d+(?:-\d+)?$/, '');
  };

  return (
    <div className="h-screen w-screen bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black/50 to-black pointer-events-none z-0" />

      {/* Floating orbs background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none">
                  Grind<span className="text-blue-500">DBMS</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Database Systems</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-gray-300 hover:text-white">
              <Zap className="w-4 h-4 text-blue-500" />
              Contribute
            </button>

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
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPro ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {isPro ? 'PRO' : 'FREE'}
                    </span>
                    {!isPro && (
                      <button className="text-[10px] font-bold text-blue-500 hover:underline">
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
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPro ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                            {isPro ? 'PRO' : 'FREE'}
                          </span>
                          {!isPro && (
                            <button className="text-[10px] font-bold text-blue-500 hover:underline">
                              UPGRADE
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        <Zap className="w-4 h-4 text-blue-500" />
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
              className="text-gray-400 text-lg font-semibold text-capitalize tracking-wider uppercase"
            >
              Master the concepts of Databases. Level up your knowledge.
            </motion.p>
          ) : (
            <LearningMeter progress={0} accentColor="blue-500" />
          )}
        </div>


        <div className="flex-grow overflow-y-auto w-full pr-2 pb-20 scrollbar-hide">
          {fetchedTopics.length === 0 ? (
             <TechPageLoader accentColor="blue-500" />
          ) : (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {fetchedTopics.map((module, index) => {
                const title = getCleanTopicName(module.name);
                const userLevel = user?.publicMetadata?.levelsDone || user?.levelsDone || 0;
                // Pro users can access all levels, free users have level-based locking
                const isLocked = isPro ? false : index > userLevel;
                
                return (
                  <motion.div
                    key={module.topicId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-28 w-64"
                    onClick={() => handleCardClick(module, index)}
                  >
                    <TechCard 
                      title={title}
                      description={`Master ${title}`}
                      level={index}
                      status={isLocked ? 'locked' : 'unlocked'}
                      isCurrent={!isLocked && index === 0}
                      accentColor="blue-500"
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>


      {/* Dialog Overlay */}
      <TechTopicGenericModal 
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        topic={selectedTopic}
        techName="DBMS"
        isPro={isPro}
        accentColor="blue-500"
      />
    </div>
  );
}
