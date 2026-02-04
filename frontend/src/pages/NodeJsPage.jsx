import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Zap, LogOut, X, MessageSquare } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import TechCard from '../components/TechCard';
import LearningMeter from '../components/LearningMeter';
import api from '../api/axios';
import TechPageLoader from '../components/TechPageLoader';
import TechTopicGenericModal from '../components/TechTopicGenericModal';
import InterviewExperienceChannel from '../components/InterviewExperienceChannel';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map(e => e.trim());


export default function NodeJsPage() {
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
  const [isPro, setIsPro] = useState(false); // Will be loaded from backend
  const [userData, setUserData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showMobileFeed, setShowMobileFeed] = useState(false);

  // Dialog State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [fetchedTopics, setFetchedTopics] = useState([]);
  const [completedTopicIds, setCompletedTopicIds] = useState(new Set());
  const [techId, setTechId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMeter(true);
    }, 3000); // 3 seconds delay

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
            console.log(userResponse.data.data.plan);
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
            // First try to get the Tech ID for NodeJS
            // Assuming the tech name in DB matches "NodeJS" or "Node.js"
            let techResponse; 
            try {
                 techResponse = await api.get('/tech/name/Node.Js');
            } catch (e) {
                 // Fallback to lowercase 'js' if 'Js' fails
                 techResponse = await api.get('/tech/name/Node.js');
            }

            if (techResponse && techResponse.data && techResponse.data.data) {
                const techId = techResponse.data.data.techId;
                setTechId(techId);
                // Fetch sorted topics
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
      const techResponse = await api.get('/tech/name/Node.Js');
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

  // Helper to clean topic name
  const getCleanTopicName = (name) => {
      // Remove trailing numbers and hyphens (e.g. "basic 0-1", "module-3")
      return name.replace(/[- ]\d+(?:-\d+)?$/, '');
  };

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
            <button 
              onClick={handleContributeClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-gray-300 hover:text-white"
            >
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
                      <button 
                        onClick={() => navigate('/payment')}
                        className="text-[10px] font-bold text-neon-green hover:underline"
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

              {/* Mobile Dropdown Menu */}
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
                            <button 
                              onClick={() => navigate('/payment')}
                              className="text-[10px] font-bold text-neon-green hover:underline"
                            >
                              UPGRADE
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="space-y-2">
                      <button 
                        onClick={handleContributeClick}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      >
                        <Zap className="w-4 h-4 text-neon-green" />
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
        
        <div className="flex-grow flex gap-8 min-h-0 overflow-hidden">
          {/* Left Column: Tech Cards Grid (65%) */}
          <div className="flex-grow flex w-[60%] flex-col min-h-0 overflow-hidden">
            {/* Top Area: Meter or Welcome Message */}
            <div className="shrink-0 mb-6">
              {!showMeter ? (
                 <div className="h-24 flex items-center justify-center">
                   <motion.p 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-gray-400 text-lg font-semibold tracking-wider text-center"
                   >
                     MASTER NODEJS LEVEL BY LEVEL.
                   </motion.p>
                 </div>
              ) : (
                <div className="px-2">
                  <LearningMeter techId={techId} accentColor="neon-green" />
                </div>
              )}
            </div>

            {/* Cards Grid */}
            <div className="flex-grow overflow-y-auto pr-2 pb-32 scrollbar-hide">
              {fetchedTopics.length === 0 ? (
                <TechPageLoader accentColor="neon-green" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full mb-12">
      {fetchedTopics.map((module, index) => {
        const title = getCleanTopicName(module.name);
        const isLocked = isPro ? false : (index > 0 && !completedTopicIds.has(fetchedTopics[index - 1].topicId));
        const isCompleted = completedTopicIds.has(module.topicId);

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
            className="w-full h-full"
            onClick={() => handleCardClick(module, index)}
          >
            <TechCard
              title={title}
              description={isCompleted ? `Level ${index} - Completed` : `Master ${title}`}
              level={index}
              status={isLocked ? 'locked' : (isCompleted ? 'completed' : 'unlocked')}
              isCurrent={isCurrent}
              accentColor="neon-green"
            />
          </motion.div>
        );
      })}
    </div>
  )}
</div>
          </div>

          {/* Right Column: Global Feed (35%) */}
          <div className="hidden lg:flex flex-col w-[35%] min-h-0">
            <InterviewExperienceChannel 
              accentColor="neon-green" 
              userId={userData?.uuid} 
              username={userData?.username}
              techId={techId}
              techName="Node.Js"
            />
          </div>
        </div>

        {/* Floating Action Button for Mobile Feed */}
        <button
          onClick={() => setShowMobileFeed(true)}
          className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-neon-green text-black shadow-[0_0_20px_rgba(108,194,74,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </main>

      {/* Mobile Feed Overlay */}
      <AnimatePresence>
        {showMobileFeed && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9999] bg-zinc-950 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-bold text-sm tracking-widest text-white uppercase">Node.Js Feed</span>
              </div>
              <button
                onClick={() => setShowMobileFeed(false)}
                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow min-h-0">
              <InterviewExperienceChannel 
                accentColor="neon-green" 
                userId={userData?.uuid} 
                username={userData?.username}
                techId={techId}
                techName="Node.Js"
                hideHeader={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Dialog Overlay */}
      <TechTopicGenericModal 
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        topic={selectedTopic}
        techName="Node.Js"
        isPro={isPro}
        accentColor="neon-green"
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

