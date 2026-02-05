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
    onNextLevel = () => {},
    answeredQuestionIds = new Set(),
    onPreviousQuestion = () => {}
}) {
    const navigate = useNavigate();
    const [showIdealAnswer, setShowIdealAnswer] = useState(false);
    const [activeTab, setActiveTab] = useState('results');
    const [showMicroTooltip, setShowMicroTooltip] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const isAlreadyAnswered = questions[currentQuestionIndex] && answeredQuestionIds.has(questions[currentQuestionIndex].qid);

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
                <div className="flex flex-col gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onBackToResources}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">Resources</span>
                                <span className="xs:hidden">Back</span>
                            </button>

                            <div className="h-6 w-px bg-white/10 mx-1" />

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={onPreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>

                                <div className="px-2 text-center">
                                    <h3 className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        Q {currentQuestionIndex + 1} / {questions.length}
                                    </h3>
                                </div>

                                <button
                                    onClick={onNextQuestion}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>

                        {isAlreadyAnswered && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                            >
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] sm:text-[9px] font-black text-green-500 uppercase tracking-widest whitespace-nowrap">Answered</span>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-grow bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${colors.bar} transition-all duration-500`}
                                style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">
                            {Math.round(((currentQuestionIndex + 1) / (questions.length || 1)) * 100)}%
                        </span>
                    </div>
                </div>

                {/* Question Display */}
                <div className="mb-4">
                    <div className="p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900/80 to-black/60 border border-white/10 shadow-2xl w-full backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        <div className="relative text-center sm:text-left">
                            <p className="text-base sm:text-lg lg:text-xl font-medium text-white leading-relaxed">
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
                            placeholder="Start typing your answer here... "
                            disabled={isEvaluating}
                            className={`w-full h-40 sm:h-56 lg:h-64 bg-white/5 border-2 border-white/20 rounded-2xl p-4 sm:p-5 lg:p-6 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 resize-none transition-all disabled:opacity-50 backdrop-blur-sm text-sm sm:text-base leading-relaxed hover:bg-white/10 hover:border-white/30`}
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
                                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all shadow-xl
                                    ${!isPro
                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 scale-100 hover:scale-110"
                                        : isRecording
                                            ? "bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30"
                                            : `bg-zinc-800/80 text-gray-400 hover:text-white border border-white/20 hover:bg-zinc-700/80 hover:border-white/30`
                                    }`}
                            >
                                {isRecording ? <X className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : <Mic className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
                            </button>
                        </div>

                    </div>

                    {/* Submit Button */}
                    {!evaluationResult && (
                        <button
                            onClick={onSubmitAnswer}
                            disabled={!getCombinedAnswer().trim() || isEvaluating}
                            className={`w-full py-4 rounded-2xl ${colors.primary} font-bold text-sm tracking-wider transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 mb-6 hover:scale-[1.01] active:scale-[0.99] border-2 border-transparent hover:border-white/20`}
                        >
                            {isEvaluating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>ANALYZING...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>SUBMIT ANSWER</span>
                                </>
                            )}
                        </button>
                    )}

                    {/* Action Buttons (when evaluation is done) */}
                    {evaluationResult && (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col xs:flex-row gap-3">
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={onNextQuestion}
                                        className={`flex-1 py-3.5 rounded-xl ${colors.primary} font-bold text-xs sm:text-sm tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]`}
                                    >
                                        <span>Next Question</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={onNextLevel}
                                        className={`flex-1 py-4 rounded-xl ${colors.primary} font-black text-sm uppercase tracking-[0.15em] transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] border border-white/10`}
                                    >
                                        <Zap className="w-4 h-4 fill-current" />
                                        <span>Next Level</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={onAnswerAgain}
                                    className={`flex-1 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]`}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Answer Again</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SECTION: Evaluation Results (1/3 width on xl+) */}
            <div className="xl:col-span-1 flex flex-col h-full mt-8 xl:mt-0">
                <div className="xl:sticky xl:top-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 sm:mb-6 flex items-center gap-2">
                        <Zap className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.icon}`} />
                        <span>Evaluation Results</span>
                    </h3>

                    {/* Placeholder when no evaluation yet */}
                    {!evaluationResult && (
                        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400">
                                Submit your answer to see results here
                            </p>
                        </div>
                    )}

                    {/* Evaluation Results */}
                    {evaluationResult && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Tab Navigation */}
                            <div className="flex bg-zinc-900/50 rounded-xl p-1 border border-white/10 backdrop-blur-sm overflow-x-auto scrollbar-hide">
                                <button
                                    onClick={() => setActiveTab('results')}
                                    className={`flex-1 min-w-[70px] py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all uppercase tracking-wider ${
                                        activeTab === 'results'
                                            ? `${colors.primary} text-black`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Score
                                </button>
                                <button
                                    onClick={() => setActiveTab('ideal')}
                                    className={`flex-1 min-w-[70px] py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all uppercase tracking-wider ${
                                        activeTab === 'ideal'
                                            ? `${colors.primary} text-black`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Ideal
                                </button>
                                <button
                                    onClick={() => setActiveTab('review')}
                                    className={`flex-1 min-w-[70px] py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all uppercase tracking-wider ${
                                        activeTab === 'review'
                                            ? `${colors.primary} text-black`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Tips
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
