import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Zap, Database, LogOut, X } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import TechCard from '../components/TechCard';
import LearningMeter from '../components/LearningMeter';
import api from '../api/axios';
import TechPageLoader from '../components/TechPageLoader';
import TechTopicGenericModal from '../components/TechTopicGenericModal';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map(e => e.trim());


export default function DbmsPage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.primaryEmailAddress?.emailAddress && ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress);

  const handleContributeClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };
  const [showMeter, setShowMeter] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Dialog State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [fetchedTopics, setFetchedTopics] = useState([]);
  const [completedTopicIds, setCompletedTopicIds] = useState(new Set());
  const [techId, setTechId] = useState(null);

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
                setTechId(techId);
                const topicsResponse = await api.get(`/topic/tech/${techId}`);
                if (topicsResponse.data && Array.isArray(topicsResponse.data.data)) {
                    setFetchedTopics(topicsResponse.data.data);
                }
                
                // Fetch completed topics for this tech
                try {
                    const token = await getToken();
                    const progressResponse = await api.get(`/progress/tech/${techId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (progressResponse?.data?.data?.completedTopicIds) {
                        const completedIds = Array.isArray(progressResponse.data.data.completedTopicIds)
                            ? progressResponse.data.data.completedTopicIds
                            : [];
                        setCompletedTopicIds(new Set(completedIds));
                        console.log('✅ Completed topics loaded:', completedIds);
                    }
                } catch (progressError) {
                    console.error("Failed to fetch completed topics:", progressError);
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
      const userLevelsDone = userData?.levelsDone || user?.publicMetadata?.levelsDone || user?.levelsDone || 0;
      // If levelsDone is X, level X is the next one to complete
      // Robust check: Is the previous level completed?
      const isLocked = index > 0 && !completedTopicIds.has(fetchedTopics[index - 1]?.topicId);
      if (isLocked) return;
    }

    setSelectedTopic({ ...module, levelIndex: index });
  };

  const handleLevelComplete = async (completedLevelIndex) => {
    if (isPro) {
      console.log('✅ Pro user - no level unlocking needed');
      return; // Pro users don't need level unlocking
    }
    
    try {
      console.log('🔓 Completing level:', completedLevelIndex);
      const token = await getToken();
      const currentLevelsDone = userData?.levelsDone || 0;
      
      // Simple: increment levelsDone by 1
      const newLevelsDone = currentLevelsDone + 1;
      console.log(`📊 Incrementing levelsDone: ${currentLevelsDone} → ${newLevelsDone}`);
      
      // Update user's levelsDone
      await api.put('/user/me/levels', 
        { levelsDone: newLevelsDone },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('✅ LevelsDone updated to:', newLevelsDone);
      
      // Refresh user data
      const userResponse = await api.get('/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (userResponse.data && userResponse.data.data) {
        setUserData(userResponse.data.data);
        console.log('✅ User data refreshed, levelsDone:', userResponse.data.data.levelsDone);
      }
      
      // Refresh topics and completed status
      const techResponse = await api.get('/tech/name/DBMS');
      if (techResponse?.data?.data) {
        const techId = techResponse.data.data.techId;
        setTechId(techId);
        const topicsResponse = await api.get(`/topic/tech/${techId}`);
        if (topicsResponse?.data?.data) {
          setFetchedTopics(topicsResponse.data.data);
          console.log('✅ Topics refreshed');
        }
        
        // Refresh completed topics
        try {
          const progressResponse = await api.get(`/progress/tech/${techId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (progressResponse?.data?.data?.completedTopicIds) {
            const completedIds = Array.isArray(progressResponse.data.data.completedTopicIds)
              ? progressResponse.data.data.completedTopicIds
              : [];
            setCompletedTopicIds(new Set(completedIds));
            console.log('✅ Completed topics refreshed:', completedIds);
          }
        } catch (progressError) {
          console.error("Failed to refresh completed topics:", progressError);
        }
      }
    } catch (error) {
      console.error("❌ Failed to unlock next level:", error);
    }
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
            <button 
              onClick={handleContributeClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-gray-300 hover:text-white"
            >
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
                      <button 
                        onClick={() => navigate('/payment')}
                        className="text-[10px] font-bold text-blue-500 hover:underline"
                      >
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
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 z-50"
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
                            <button 
                              onClick={() => navigate('/payment')}
                              className="text-[10px] font-bold text-blue-500 hover:underline"
                            >
                              UPGRADE
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={handleContributeClick}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      >
                        <Zap className="w-4 h-4 text-blue-500" />
                        Contribute
                      </button>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
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
            <LearningMeter techId={techId} accentColor="blue-500" />
          )}
        </div>


        <div className="flex-grow overflow-y-auto w-full pr-2 pb-20 scrollbar-hide">
          {fetchedTopics.length === 0 ? (
             <TechPageLoader accentColor="blue-500" />
          ) : (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {fetchedTopics.map((module, index) => {
                const title = getCleanTopicName(module.name);
                const userLevelsDone = userData?.levelsDone || user?.publicMetadata?.levelsDone || user?.levelsDone || 0;
                // Pro users can access all levels, free users have level-based locking
                // If levelsDone is X, unlock levels 0 to X+1 (so level X+2 is locked)
                // Example: levelsDone=0 unlocks levels 0,1; levelsDone=1 unlocks levels 0,1,2
                // A level is locked if it's not the first one AND the previous one isn't finished
                const isLocked = isPro ? false : (index > 0 && !completedTopicIds.has(fetchedTopics[index - 1].topicId));
                const isCompleted = completedTopicIds.has(module.topicId);
                
                // Highlight the first uncompleted level that is also unlocked
                let isCurrent = !isLocked && !isCompleted;
                if (isCurrent && index > 0) {
                  const previousUncompleted = fetchedTopics.slice(0, index).some(t => !completedTopicIds.has(t.topicId));
                  if (previousUncompleted) isCurrent = false;
                }
                
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
                      description={isCompleted ? `Level ${index} - Completed` : `Master ${title}`}
                      level={index}
                      status={isLocked ? 'locked' : (isCompleted ? 'completed' : 'unlocked')}
                      isCurrent={isCurrent}
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
        levelIndex={selectedTopic?.levelIndex ?? 0}
        onLevelComplete={handleLevelComplete}
      />
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] max-w-[450px]"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-white font-bold text-sm">Not Authorized</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                You are not authorized to do it, thanks for the interest. You can put your question in the Recently asked section.
              </p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-auto text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
