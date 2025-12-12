import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Hexagon, User, Zap, X, Mic, Send, FileText, ChevronRight, Loader2 } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import TechCard from '../components/TechCard';
import LearningMeter from '../components/LearningMeter';
import api from '../api/axios';
import TechPageLoader from '../components/TechPageLoader';


export default function NodeJsPage() {
  const { user } = useUser();
  const [showMeter, setShowMeter] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isPro = false; // Mock status for now

  // Dialog State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [dialogStep, setDialogStep] = useState(0); // 0: resources, 1: questions
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [fetchedTopics, setFetchedTopics] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMeter(true);
    }, 3000); // 3 seconds delay

    const fetchTopics = async () => {
        try {
            // First try to get the Tech ID for NodeJS
            // Assuming the tech name in DB matches "NodeJS" or "Node.js"
            let techResponse;
            try {
                 techResponse = await api.get('/tech/name/NodeJS');
            } catch (e) {
                 // Fallback to Node.js if NodeJS not found
                 techResponse = await api.get('/tech/name/Node.js');
            }

            if (techResponse && techResponse.data && techResponse.data.data) {
                const techId = techResponse.data.data.techId;
                // Fetch sorted topics
                const topicsResponse = await api.get(`/topic/tech/${techId}`);
                if (topicsResponse.data && Array.isArray(topicsResponse.data.data)) {
                    setFetchedTopics(topicsResponse.data.data);
                }
            }
        } catch (error) {
            console.error("Failed to initialize topics:", error);
        }
    };

    fetchTopics();

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (module, index) => {
    // Check lock status based on index and user progress
    const isLocked = index > (user?.publicMetadata?.levelsDone || user?.levelsDone || 0);
    if (isLocked) return;

    setSelectedTopic(module);
    setDialogStep(0);
    setCurrentQuestionIndex(0);
    setAnswer("");
    
    // For fetched topics, the module itself is the topic data
    // But we need to make sure we have the full included data (resources/questions)
    // The previous implementation inferred module was just a UI card object.
    // Here 'module' passed from the map is the full topic object from DB (which includes resources/questions from the repository include)
    setTopicData(module);
  };

  const handleCloseDialog = () => {
      setSelectedTopic(null);
      setTopicData(null);
      setDialogStep(0);
      setCurrentQuestionIndex(0);
      setAnswer("");
  };

  const handleStartPrepare = () => {
    setDialogStep(1);
    setCurrentQuestionIndex(0);
  };

  const handleSubmitAnswer = () => {
    // Logic to validate answer or move to next
    // For now just console log and maybe move next if exists
    console.log("Submitted:", answer);
    if (topicData?.questions && currentQuestionIndex < topicData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer("");
    } else {
        // Finished?
        console.log("All questions done or last question");
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


        <div className="flex-grow overflow-y-auto w-full pr-2 pb-20 scrollbar-hide">
          {fetchedTopics.length === 0 ? (
             <TechPageLoader />
          ) : (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {fetchedTopics.map((module, index) => {
                const title = getCleanTopicName(module.name);
                const userLevel = user?.publicMetadata?.levelsDone || user?.levelsDone || 0; // Use clerk metadata if available or user obj
                // Note: user object from useUser() might not have custom fields directly on root. 
                // Usually it's in publicMetadata. But checking both for safety as per schema earlier.
                // Assuming standard Clerk integration, custom attributes might be in publicMetadata.
                // Schema has 'levelsDone' in User model, which syncs to Clerk? Or just local DB?
                // If local DB, we might need to fetch user status separately. 
                // For now, assuming user.levelsDone is available or defaulting to 0. 
                // Wait, useUser gives Clerk user object. It doesn't have levelsDone unless added to publicMetadata.
                // If it's not there, everything is locked except level 0.
                
                // Let's assume for now user starts at 0.
                const isLocked = index > 0; // For temporary testing, unlock only first.
                // Actually, let's unlock index 0 always.
                // If we want real sync, we need to fetch user data from our backend using the Clerk ID.
                
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
                      description={`Master ${title}`} // Fallback description
                      level={index}
                      status={isLocked ? 'locked' : 'unlocked'}
                      isCurrent={!isLocked && index === 0} // Simplify current logic for now
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>


      {/* Dialog Overlay */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Dialog Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                        <Hexagon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{getCleanTopicName(selectedTopic.name)}</h2>
                        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Topic Module</p>
                    </div>
                </div>
                <button 
                  onClick={handleCloseDialog}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dialog Content */}
              <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
                {loading ? (
                    <div className="h-96 flex items-center justify-center overflow-hidden">
                        <TechPageLoader />
                    </div>
                ) : !topicData ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
                         <p>Content not found for this module.</p>
                         <p className="text-xs text-gray-500">Ensure backend has data for "{getCleanTopicName(selectedTopic.name)}"</p>
                    </div>
                ) : (
                    <>
                    {dialogStep === 0 ? (
                        /* Step 1: Resources */
                        <div className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-neon-green" />
                                    Learning Resources
                                </h3>
                                <div className="grid gap-3">
                                    {topicData.resources && topicData.resources.length > 0 ? (
                                        topicData.resources.map((res, i) => (
                                            <a 
                                                key={i} 
                                                href={res.resource} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-neon-green/30 hover:bg-white/10 transition-all group flex items-start gap-4"
                                            >
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 group-hover:text-neon-green transition-colors">
                                                    <span className="text-xs font-bold">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white group-hover:text-neon-green transition-colors">{res.name}</h4>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{res.resource}</p>
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No resources available yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Questions */
                        <div className="flex flex-col h-full">
                           <div className="flex items-center justify-between mb-6">
                             <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                                 Question {currentQuestionIndex + 1} of {topicData.questions?.length || 0}
                             </h3>
                             <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-neon-green transition-all duration-300"
                                    style={{ width: `${((currentQuestionIndex + 1) / (topicData.questions?.length || 1)) * 100}%` }}
                                />
                             </div>
                           </div>

                           {topicData.questions && topicData.questions.length > 0 ? (
                             <div className="flex-grow flex flex-col gap-6">
                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 shadow-inner min-h-[120px] flex items-center justify-center text-center">
                                    <p className="text-lg font-medium text-white/90 leading-relaxed">
                                        {topicData.questions[currentQuestionIndex].question}
                                    </p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="relative">
                                        <textarea 
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-green/50 resize-none transition-all"
                                        />
                                        <button className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-neon-green transition-colors">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleSubmitAnswer}
                                        disabled={!answer.trim()}
                                        className="w-full py-3.5 rounded-xl bg-neon-green hover:bg-[#5ab33e] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-neon-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        SUBMIT ANSWER
                                    </button>
                                </div>
                             </div>
                           ) : (
                             <div className="text-center text-gray-400 py-10">
                                 No questions available.
                             </div>
                           )}
                        </div>
                    )}
                    </>
                )}
              </div>

              {/* Dialog Footer */}
              {!loading && topicData && dialogStep === 0 && (
                <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end">
                    <button 
                        onClick={handleStartPrepare}
                        className="px-6 py-3 rounded-xl bg-neon-green hover:bg-[#5ab33e] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-neon-green/20 flex items-center gap-2"
                    >
                        Let's Prepare
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

