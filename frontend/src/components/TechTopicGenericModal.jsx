import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, X, FileText, Zap, Loader2, Lock, RefreshCw, ChevronRight, Mic, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TechPageLoader from './TechPageLoader';
import { io } from "socket.io-client";

export default function TechTopicGenericModal({ 
    isOpen, 
    onClose, 
    topic, 
    techName = 'Node.Js', 
    isPro = false 
}) {
    const navigate = useNavigate();
    
    // Internal State
    const [dialogStep, setDialogStep] = useState(0); // 0: resources, 1: questions
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);

    // Socket & STT State
    const [socket, setSocket] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [partialTranscript, setPartialTranscript] = useState("");
    const [audioContext, setAudioContext] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [processor, setProcessor] = useState(null);

    // Initialize Socket
    useEffect(() => {
        const s = io( import.meta.env.VITE_BACKEND_URL, {
            transports: ["websocket"],
        });

        s.on("stt-transcript", ({ type, data }) => {
            if (!data?.text) return;

            if (type === "partial") {
                 setPartialTranscript(data.text);
            }

            if (type === "final") {
                setAnswer(prev => {
                    const separator = prev.trim() ? " " : "";
                    return prev + separator + data.text;
                });
                setPartialTranscript("");
            }
        });

        setSocket(s);

        return () => {
            if (s) s.disconnect();
        };
    }, []);

    const startRecording = async () => {
        if (!socket || isRecording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const context = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000,
            });
            const source = context.createMediaStreamSource(stream);
            const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

            source.connect(scriptProcessor);
            scriptProcessor.connect(context.destination);

            socket.emit("start-stt");
            setIsRecording(true);

            scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                
                for (let i = 0; i < inputData.length; i++) {
                   const s = Math.max(-1, Math.min(1, inputData[i]));
                   pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }
                
                socket.emit("audio-chunk", pcmData.buffer);
            };

            setAudioContext(context);
            setMediaStream(stream);
            setProcessor(scriptProcessor);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (processor && audioContext) {
            processor.disconnect();
            audioContext.close();
        }
        
        if (mediaStream) {
             mediaStream.getTracks().forEach(track => track.stop());
        }

        if (socket) {
            socket.emit("stop-stt");
        }

        setIsRecording(false);
        setAudioContext(null);
        setMediaStream(null);
        setProcessor(null);
    };

    // Reset state when topic changes or modal opens (handled by key or effect in parent potentially, 
    // but good to have reset logic here if needed. 
    // For now, we rely on the component being unmounted/remounted or 'isOpen' control if we wanted to reset.
    // Since AnimatePresence removes it, state resets on close/open.)

    const handleStartPrepare = () => {
        setDialogStep(1);
        setCurrentQuestionIndex(0);
        setAnswer("");
        setPartialTranscript("");
        setEvaluationResult(null);
    };

    const handleNextQuestion = () => {
        setEvaluationResult(null);
        setAnswer("");
        setPartialTranscript("");
        if (topic?.questions && currentQuestionIndex < topic.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const getCombinedAnswer = () => {
        if (!partialTranscript) return answer;
        return answer + (answer.trim() ? " " : "") + partialTranscript;
    };

    const handleSubmitAnswer = async () => {
        const finalAnswer = getCombinedAnswer();
        if (!finalAnswer.trim()) return;

        setIsEvaluating(true);
        setEvaluationResult(null);

        try {
            const currentQuestion = topic.questions[currentQuestionIndex];
            
            const response = await api.post('/evaluation/evaluate', {
                tech: techName,
                question: currentQuestion.question,
                answer: finalAnswer
            });

            if (response.data) {
                setEvaluationResult(response.data);
            }
        } catch (error) {
            console.error("Evaluation failed:", error);
            setEvaluationResult({
                error: true,
                feedback: "Failed to evaluate answer. Please try again or check your connection."
            });
        } finally {
            setIsEvaluating(false);
        }
    };

    // Helper to clean topic name (duplicated from Page, good to have here purely for display)
    const getCleanTopicName = (name) => {
        if (!name) return "";
        return name.replace(/[- ]\d+(?:-\d+)?$/, '');
    };

    if (!isOpen || !topic) return null;

    return (
        <AnimatePresence>
            {isOpen && (
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
                                    <h2 className="text-xl font-bold text-white tracking-tight">{getCleanTopicName(topic.name)}</h2>
                                    <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Topic Module</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Dialog Content */}
                        <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
                            {!topic ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
                                    <p>Content not found for this module.</p>
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
                                                    {topic.resources && topic.resources.length > 0 ? (
                                                        topic.resources.map((res, i) => (
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
                                                    Question {currentQuestionIndex + 1} of {topic.questions?.length || 0}
                                                </h3>
                                                <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-neon-green transition-all duration-300"
                                                        style={{ width: `${((currentQuestionIndex + 1) / (topic.questions?.length || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {topic.questions && topic.questions.length > 0 ? (
                                                <div className="flex-grow flex flex-col gap-6">
                                                    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 shadow-inner min-h-[120px] flex items-center justify-center text-center">
                                                        <p className="text-lg font-medium text-white/90 leading-relaxed">
                                                            {topic.questions[currentQuestionIndex].question}
                                                        </p>
                                                    </div>

                                                    <div className="mt-auto space-y-4">
                                                        {evaluationResult ? (
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
                                                                    
                                                                    {/* Complete Feedback / Ideal Answer Section */}
                                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                                                <Zap className="w-3 h-3 text-neon-green" />
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
                                                                                            <Lock className="w-3 h-3 text-neon-green" />
                                                                                            <span className="text-xs font-bold text-white">Unlock Answer</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <button 
                                                                        onClick={() => {
                                                                            setEvaluationResult(null);
                                                                            setAnswer("");
                                                                        }}
                                                                        className="py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm tracking-wide transition-all border border-white/10 flex items-center justify-center gap-2"
                                                                    >
                                                                        <RefreshCw className="w-4 h-4" />
                                                                        Answer Again
                                                                    </button>
                                                                    <button 
                                                                        onClick={handleNextQuestion}
                                                                        className="py-3.5 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                                                                    >
                                                                        Next Question
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="relative">
                                                                    <textarea 
                                                                        value={getCombinedAnswer()}
                                                                        onChange={(e) => {
                                                                            setAnswer(e.target.value);
                                                                            setPartialTranscript("");
                                                                        }}
                                                                        placeholder="Type your answer here..."
                                                                        disabled={isEvaluating}
                                                                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-green/50 resize-none transition-all disabled:opacity-50"
                                                                    />
                                                                    <button 
                                        onClick={() => {
                                            if (!isPro) {
                                                navigate('/payment');
                                                return;
                                            }
                                            isRecording ? stopRecording() : startRecording();
                                        }}
                                        className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors
                                            ${!isPro 
                                                ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" 
                                                : isRecording 
                                                    ? "bg-red-500/20 text-red-500" 
                                                    : "bg-white/5 text-gray-400 hover:text-neon-green"
                                            }`}
                                    >
                                        {!isPro ? <Lock className="w-5 h-5" /> : (isRecording ? <X className="w-5 h-5" /> : <Mic className="w-5 h-5" />)}
                                    </button>
                                                                </div>
                                                                <button 
                                                                    onClick={handleSubmitAnswer}
                                                                    disabled={!getCombinedAnswer().trim() || isEvaluating}
                                                                    className="w-full py-3.5 rounded-xl bg-neon-green hover:bg-[#5ab33e] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-neon-green/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        {topic && dialogStep === 0 && (
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
    );
}
