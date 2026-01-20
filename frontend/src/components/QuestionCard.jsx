import { Zap, Loader2, Lock, RefreshCw, ChevronRight, ChevronLeft, Mic, Send, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    isLevelComplete = false
}) {
    const navigate = useNavigate();
    const [showIdealAnswer, setShowIdealAnswer] = useState(false);
    const [activeTab, setActiveTab] = useState('results');

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
        const combined = answer + (partialTranscript ? " " + partialTranscript : "");
        return combined.trim();
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
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SECTION: Question + Input (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col h-full">
                {/* Question Header with Progress */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBackToResources}
                            className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Technical Assessment</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
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
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900/80 to-black/60 border border-white/10 shadow-2xl max-w-4xl w-full backdrop-blur-sm">
                        <div className="text-center">
                            <p className="text-xl md:text-xl font-medium text-white leading-relaxed">
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
                            value={answer}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            placeholder="Start typing your answer here... 💭"
                            disabled={isEvaluating}
                            className={`w-full h-64 bg-gradient-to-br from-zinc-900/80 to-black/60 border-2 ${colors.border} rounded-3xl p-6 text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 ${colors.focus} resize-none transition-all disabled:opacity-50 shadow-2xl backdrop-blur-sm text-base leading-relaxed`}
                        />

                        {/* Microphone Button Inside Input */}
                        <button
                            onClick={() => {
                                if (!isPro) {
                                    navigate('/payment');
                                    return;
                                }
                                isRecording ? onStopRecording() : onStartRecording();
                            }}
                            className={`absolute bottom-4 right-4 p-4 rounded-2xl transition-all shadow-xl
                                ${!isPro
                                    ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30"
                                    : isRecording
                                        ? "bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30"
                                        : `bg-zinc-800/80 text-gray-400 hover:text-white border border-white/20 hover:bg-zinc-700/80 hover:border-white/30`
                                }`}
                        >
                            {!isPro ? <Lock className="w-6 h-6" /> : (isRecording ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />)}
                        </button>

                        {/* Partial Transcript Overlay */}
                        {partialTranscript && (
                            <div className="absolute bottom-20 left-6 right-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-sm text-blue-300 italic">{partialTranscript}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    {!evaluationResult && (
                        <button
                            onClick={onSubmitAnswer}
                            disabled={!getCombinedAnswer().trim() || isEvaluating}
                            className={`w-full py-5 rounded-2xl ${colors.primary} font-bold text-base tracking-wider transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 mb-6 hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-white/20`}
                        >
                            {isEvaluating ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    ANALYZING YOUR ANSWER...
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6" />
                                    SUBMIT ANSWER
                                </>
                            )}
                        </button>
                    )}

                    {/* Action Buttons (when evaluation is done) */}
                    {evaluationResult && (
                        <div className="flex gap-4">
                            {currentQuestionIndex < questions.length - 1 && (
                                <button
                                    onClick={onNextQuestion}
                                    className={`flex-1 py-4 rounded-2xl ${colors.primary} font-bold text-sm tracking-wider transition-all shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]`}
                                >
                                    Next Question
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}

                            <button
                                onClick={onAnswerAgain}
                                className={`flex-1 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Answer Again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SECTION: Evaluation Results (1/3 width) */}
            <div className="lg:col-span-1 flex flex-col h-full">
                <div className="sticky top-0">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${colors.icon}`} />
                        Evaluation Results
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
                            <div className="flex bg-zinc-900/50 rounded-2xl p-1 border border-white/10 backdrop-blur-sm">
                                <button
                                    onClick={() => setActiveTab('results')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === 'results'
                                            ? `${colors.primary} text-black shadow-lg`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Results
                                </button>
                                <button
                                    onClick={() => setActiveTab('ideal')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === 'ideal'
                                            ? `${colors.primary} text-black shadow-lg`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Ideal Answer
                                </button>
                                <button
                                    onClick={() => setActiveTab('review')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === 'review'
                                            ? `${colors.primary} text-black shadow-lg`
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                 To Review
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[400px]">
                                {/* Results Tab */}
                                {activeTab === 'results' && (
                                    <div className={`p-6 rounded-3xl border-2 ${evaluationResult.score >= 7 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'} backdrop-blur-sm`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${evaluationResult.score >= 7 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    {evaluationResult.score >= 7 ? <Zap className="w-6 h-6" /> : <Loader2 className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <div className={`text-2xl font-bold ${evaluationResult.score >= 7 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                        {evaluationResult.score}/10
                                                    </div>
                                                    <div className="text-sm text-gray-400">
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
