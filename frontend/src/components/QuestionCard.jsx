import { Zap, Loader2, Lock, RefreshCw, ChevronRight, ChevronLeft, Mic, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    onBackToResources = () => {}
}) {
    const navigate = useNavigate();

    // Map accent color to Tailwind classes
    const colorMap = {
        'neon-green': { 
            primary: 'bg-neon-green hover:bg-[#5ab33e] text-black shadow-neon-green/20',
            icon: 'text-neon-green',
            border: 'border-neon-green/50',
            bar: 'bg-neon-green',
            lock: 'text-neon-green'
        },
        'blue-500': { 
            primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20',
            icon: 'text-blue-500',
            border: 'border-blue-500/50',
            bar: 'bg-blue-500',
            lock: 'text-blue-500'
        }
    };

    const colors = colorMap[accentColor] || colorMap['neon-green'];

    const getCombinedAnswer = () => {
        const combined = answer + (partialTranscript ? " " + partialTranscript : "");
        return combined.trim();
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center text-gray-400 py-10">
                No questions available.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Question Header with Progress */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBackToResources}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </h3>
                </div>
                <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${colors.bar} transition-all duration-300`}
                        style={{ width: `${((currentQuestionIndex + 1) / (questions.length || 1)) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex-grow flex flex-col gap-6">
                {/* Question Display */}
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 shadow-inner min-h-[120px] flex items-center justify-center text-center">
                    <p className="text-lg font-medium text-white/90 leading-relaxed">
                        {questions[currentQuestionIndex].question}
                    </p>
                </div>

                <div className="mt-auto space-y-4">
                    {evaluationResult ? (
                        /* Evaluation Result */
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`p-4 rounded-xl border ${evaluationResult.score >= 7 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-1.5 rounded-full ${evaluationResult.score >= 7 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                        {evaluationResult.score >= 7 ? <Zap className="w-4 h-4" /> : <Loader2 className="w-4 h-4" />}
                                    </div>
                                    <span className={`font-bold ${evaluationResult.score >= 7 ? 'text-green-500' : 'text-yellow-500'}`}>
                                        Score: {evaluationResult.score}/10
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                    {evaluationResult.feedback}
                                </p>

                                {/* Ideal Answer Section */}
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Zap className={`w-3 h-3 ${colors.lock}`} />
                                            Ideal Answer
                                        </h4>
                                        {!isPro && (
                                            <span className="text-[10px] font-bold bg-zinc-800 text-gray-400 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> PRO ONLY
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative rounded-lg overflow-hidden bg-black/20">
                                        {isPro ? (
                                            <div className="p-3 text-sm text-gray-300 bg-white/5">
                                                {evaluationResult.idealShortAnswer || "No ideal answer available."}
                                            </div>
                                        ) : (
                                            <div onClick={() => navigate('/payment')} className="relative p-3 cursor-pointer group">
                                                <div className="blur-sm select-none text-sm text-gray-500">
                                                    {evaluationResult.idealShortAnswer || "This is a sample ideal answer that is blurred for free users. Upgrade to see the full expert answer."}
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                                    <div className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                                                        <Lock className={`w-3 h-3 ${colors.lock}`} />
                                                        <span className="text-xs font-bold text-white">Unlock Answer</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={onAnswerAgain}
                                    className="py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm tracking-wide transition-all border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Answer Again
                                </button>
                                <button 
                                    onClick={onNextQuestion}
                                    className={`py-3.5 rounded-xl ${colors.primary} font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2`}
                                >
                                    Next Question
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Answer Input */
                        <>
                            <div className="relative">
                                <textarea 
                                    value={getCombinedAnswer()}
                                    onChange={(e) => onAnswerChange(e.target.value)}
                                    placeholder="Type your answer here..."
                                    disabled={isEvaluating}
                                    className={`w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:${colors.border} resize-none transition-all disabled:opacity-50`}
                                />
                                <button 
                                    onClick={() => {
                                        if (!isPro) {
                                            navigate('/payment');
                                            return;
                                        }
                                        isRecording ? onStopRecording() : onStartRecording();
                                    }}
                                    className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors
                                        ${!isPro 
                                            ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" 
                                            : isRecording 
                                                ? "bg-red-500/20 text-red-500" 
                                                : "bg-white/5 text-gray-400 hover:text-" + accentColor
                                        }`}
                                >
                                    {!isPro ? <Lock className="w-5 h-5" /> : (isRecording ? <X className="w-5 h-5" /> : <Mic className="w-5 h-5" />)}
                                </button>
                            </div>
                            <button 
                                onClick={onSubmitAnswer}
                                disabled={!getCombinedAnswer().trim() || isEvaluating}
                                className={`w-full py-3.5 rounded-xl ${colors.primary} font-bold text-sm tracking-wide transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                            >
                                {isEvaluating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        EVALUATING...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        SUBMIT ANSWER
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
