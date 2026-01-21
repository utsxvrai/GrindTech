import { Zap, Loader2, Lock, RefreshCw, ChevronRight, ChevronLeft, Mic, Send, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({
    questions = [],
    currentQuestionIndex = 0,
    evaluationResult = null,
    isEvaluating = false,
    isRecording = false,
    partialTranscript = "",
    isPro = false,
    accentColor = 'neon-green',
    answer = "",
    onAnswerChange = () => {},
    onStartRecording = () => {},
    onStopRecording = () => {},
    onSubmitAnswer = () => {},
    onAnswerAgain = () => {},
    onNextQuestion = () => {},
    onBackToResources = () => {},
    isLastQuestion = false,
    isLevelComplete = false,
    onNextLevel = () => {}
}) {
    const navigate = useNavigate();
    const [showIdealAnswer, setShowIdealAnswer] = useState(false);
    const [activeTab, setActiveTab] = useState('results');
    const [showMicroTooltip, setShowMicroTooltip] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Map accent color to Tailwind classes
    const colorMap = {
        'neon-green': {
            primary: 'bg-neon-green hover:bg-[#5ab33e] text-black shadow-neon-green/20',
            icon: 'text-neon-green',
            border: 'border-neon-green/50 focus:border-neon-green/70',
            bar: 'bg-neon-green',
            lock: 'text-neon-green',
            focus: 'focus:ring-neon-green/20'
        },
        'blue-500': {
            primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20',
            icon: 'text-blue-500',
            border: 'border-blue-500/50 focus:border-blue-500/70',
            bar: 'bg-blue-500',
            lock: 'text-blue-500',
            focus: 'focus:ring-blue-500/20'
        }
    };

    const colors = colorMap[accentColor] || colorMap['neon-green'];

    const getCombinedAnswer = () => {
        if (!partialTranscript) return answer;
        const separator = answer && !answer.endsWith(" ") ? " " : "";
        return answer + separator + partialTranscript;
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center text-gray-400 py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-lg">No questions available.</p>
            </div>
        );
    }

    return (
        <div className="h-full grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Upgrade Dialog Overlay */}
            <AnimatePresence>
                {isUpgradeModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden"
                        >
                            {/* Decorative logic */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
                            
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                                <Sparkles className="w-10 h-10 text-amber-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">Pro Feature Required</h2>
                            
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                To use the <span className="text-white font-semibold">microphone feature</span> you have to subscribe / upgrade to our Pro plan.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/payment')}
                                    className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group"
                                >
                                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />
                                    <span>Upgrade to Pro Now</span>
                                </button>
                                
                                <button
                                    onClick={() => setIsUpgradeModalOpen(false)}
                                    className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LEFT SECTION: Question + Input (2/3 width on xl+) */}
            <div className="xl:col-span-2 flex flex-col h-full">
                {/* Question Header with Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={onBackToResources}
                            className="p-2 sm:p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 flex-shrink-0"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider truncate">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">Technical Assessment</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                        <div className="h-2 w-24 sm:w-32 lg:w-40 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${colors.bar} transition-all duration-500`}
                                style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500">
                            {currentQuestionIndex + 1}/{questions.length}
                        </span>
                    </div>
                </div>

                {/* Question Display */}
                <div className="mb-2">
                    <div className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900/80 to-black/60 border border-white/10 shadow-2xl max-w-4xl w-full backdrop-blur-sm">
                        <div className="text-center">
                            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-white leading-relaxed">
                                {questions[currentQuestionIndex].question}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Answer Input Section */}
                <div className="flex-grow flex flex-col">
                    <div className="mb-6">
                    </div>

                    {/* Answer Input */}
                    <div className="relative mb-6">
                        <textarea
                            value={getCombinedAnswer()}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            onFocus={() => isRecording && onStopRecording()}
                            placeholder="Start typing your answer here... 💭"
                            disabled={isEvaluating}
                            className={`w-full h-48 sm:h-56 lg:h-64 bg-white/5 border-2 border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 resize-none transition-all disabled:opacity-50 backdrop-blur-sm text-sm sm:text-base leading-relaxed hover:bg-white/10 hover:border-white/30`}
                        />

                        {/* Recording Indicator Overlay */}
                        {isRecording && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-md animate-pulse pointer-events-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Listening...</span>
                            </div>
                        )}

                        {/* Microphone/Lock Button Inside Input */}
                        <div 
                            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 group/mic"
                            onMouseEnter={() => !isPro && setShowMicroTooltip(true)}
                            onMouseLeave={() => setShowMicroTooltip(false)}
                        >
                            <AnimatePresence>
                                {showMicroTooltip && !isPro && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl whitespace-nowrap z-20"
                                    >
                                        <p className="text-xs font-bold text-white flex items-center gap-2">
                                            <span className="text-amber-500">✨</span>
                                            Go pro to use the microphone stt service
                                        </p>
                                        <div className="absolute top-full right-6 w-3 h-3 bg-zinc-900 border-r border-b border-white/10 rotate-45 -translate-y-1.5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() => {
                                    if (!isPro) {
                                        setIsUpgradeModalOpen(true);
                                        return;
                                    }
                                    isRecording ? onStopRecording() : onStartRecording();
                                }}
                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all shadow-xl
                                    ${!isPro
                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 scale-100 hover:scale-110"
                                        : isRecording
                                            ? "bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30"
                                            : `bg-zinc-800/80 text-gray-400 hover:text-white border border-white/20 hover:bg-zinc-700/80 hover:border-white/30`
                                    }`}
                            >
                                {isRecording ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                        </div>

                    </div>

                    {/* Submit Button */}
                    {!evaluationResult && (
                        <button
                            onClick={onSubmitAnswer}
                            disabled={!getCombinedAnswer().trim() || isEvaluating}
                            className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl ${colors.primary} font-bold text-sm sm:text-base tracking-wider transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-white/20`}
                        >
                            {isEvaluating ? (
                                <>
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                    <span className="text-xs sm:text-sm">ANALYZING...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="text-xs sm:text-sm">SUBMIT ANSWER</span>
                                </>
                            )}
                        </button>
                    )}

                    {/* Action Buttons (when evaluation is done) */}
                    {evaluationResult && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button
                                    onClick={onNextQuestion}
                                    className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl ${colors.primary} font-bold text-sm tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-[0.98]`}
                                >
                                    <span className="text-xs sm:text-sm">Next Question</span>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={onNextLevel}
                                    className={`flex-[2] py-4 sm:py-5 rounded-xl sm:rounded-2xl ${colors.primary} font-black text-sm sm:text-base lg:text-lg uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-[0.95] border-2 border-white/10`}
                                >
                                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                                    <span>Go to Next Level</span>
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            )}

                            <button
                                onClick={onAnswerAgain}
                                className={`${isLastQuestion ? 'flex-none px-6 sm:px-10' : 'flex-1'} py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Answer Again</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SECTION: Evaluation Results (1/3 width on xl+) */}
            <div className="xl:col-span-1 flex flex-col h-full">
                <div className="sticky top-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 sm:mb-6 flex items-center gap-2">
                        <Zap className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.icon}`} />
                        <span className="hidden sm:inline">Evaluation Results</span>
                        <span className="sm:hidden">Results</span>
                    </h3>

                    {/* Placeholder when no evaluation yet */}
                    {!evaluationResult && (
                        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-400">
                                Submit your answer to see evaluation results here
                            </p>
                        </div>
                    )}

                    {/* Evaluation Results */}
                    {evaluationResult && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Tab Navigation */}
                            <div className="flex bg-zinc-900/50 rounded-xl sm:rounded-2xl p-1 border border-white/10 backdrop-blur-sm">
                                <button
                                    onClick={() => setActiveTab('results')}
                                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                        activeTab === 'results'
                                            ? `${colors.primary} text-black shadow-lg`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Results</span>
                                    <span className="sm:hidden">Res</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('ideal')}
                                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                        activeTab === 'ideal'
                                            ? `${colors.primary} text-black shadow-lg`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Ideal</span>
                                    <span className="sm:hidden">Ideal</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('review')}
                                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                        activeTab === 'review'
                                            ? `${colors.primary} text-black shadow-lg`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="hidden sm:inline">Review</span>
                                    <span className="sm:hidden">Rev</span>
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[300px] sm:min-h-[400px]">
                                {/* Results Tab */}
                                {activeTab === 'results' && (
                                    <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 ${evaluationResult.score >= 7 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'} backdrop-blur-sm`}>
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${evaluationResult.score >= 7 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    {evaluationResult.score >= 7 ? <Zap className="w-5 h-5 sm:w-6 sm:h-6" /> : <Loader2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                                                </div>
                                                <div>
                                                    <div className={`text-xl sm:text-2xl font-bold ${evaluationResult.score >= 7 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        {evaluationResult.score}/10
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-gray-400">
                                                        {evaluationResult.score >= 7 ? 'Great job!' : 'Keep practicing'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        {evaluationResult.feedback && (
                                            <div className="border-t border-white/10 pt-4">
                                                <h4 className="text-sm font-semibold text-white mb-2">Feedback</h4>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    {evaluationResult.feedback}
                                                </p>
                                            </div>
                                        )}

                                        {/* Incorrect Statements */}
                                        {evaluationResult.incorrectStatements && evaluationResult.incorrectStatements.length > 0 && (
                                            <div className="border-t border-white/10 pt-4">
                                                <h4 className="text-sm font-semibold text-white mb-2">Incorrect Points</h4>
                                                <ul className="space-y-1">
                                                    {evaluationResult.incorrectStatements.map((statement, i) => (
                                                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                                            <span className="text-red-400 mt-1">•</span>
                                                            {statement}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Ideal Answer Tab */}
                                {activeTab === 'ideal' && evaluationResult.idealShortAnswer && (
                                    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-semibold text-white">Ideal Answer</h4>
                                            <button
                                                onClick={() => setShowIdealAnswer(!showIdealAnswer)}
                                                className={`p-2 rounded-lg transition-all ${showIdealAnswer ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
                                            >
                                                {showIdealAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        <div className={`transition-all duration-300 ${showIdealAnswer ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                {evaluationResult.idealShortAnswer}
                                            </p>
                                        </div>

                                        {!showIdealAnswer && (
                                            <div className="mt-4 text-center">
                                                <button
                                                    onClick={() => setShowIdealAnswer(true)}
                                                    className="text-xs text-gray-500 hover:text-white transition-colors underline"
                                                >
                                                    Click to reveal ideal answer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Areas to Review Tab */}
                                {activeTab === 'review' && (
                                    <div className="space-y-6">
                                        {/* Missing Concepts */}
                                        {evaluationResult.missingConcepts && evaluationResult.missingConcepts.length > 0 && (
                                            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    {evaluationResult.missingConcepts.map((concept, i) => (
                                                        <span key={i} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-medium">
                                                            {concept}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        

                                        
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
