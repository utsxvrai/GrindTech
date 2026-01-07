import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TechPageLoader from './TechPageLoader';
import ResourceCard from './ResourceCard';
import QuestionCard from './QuestionCard';
import { io } from "socket.io-client";

export default function TechTopicGenericModal({ 
    isOpen, 
    onClose, 
    topic, 
    techName = 'Node.Js', 
    isPro = false,
    accentColor = 'neon-green'
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

    const handleBackToResources = () => {
        setDialogStep(0);
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
                                <div className={`p-2 rounded-lg ${accentColor === 'blue-500' ? 'bg-blue-500/10 text-blue-500' : 'bg-neon-green/10 text-neon-green'}`}>
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
                                        <ResourceCard 
                                            resources={topic.resources} 
                                            accentColor={accentColor}
                                        />
                                    ) : (
                                        /* Step 2: Questions */
                                        <QuestionCard
                                            questions={topic.questions}
                                            currentQuestionIndex={currentQuestionIndex}
                                            evaluationResult={evaluationResult}
                                            isEvaluating={isEvaluating}
                                            isRecording={isRecording}
                                            partialTranscript={partialTranscript}
                                            isPro={isPro}
                                            accentColor={accentColor}
                                            answer={answer}
                                            onAnswerChange={setAnswer}
                                            onStartRecording={startRecording}
                                            onStopRecording={stopRecording}
                                            onSubmitAnswer={handleSubmitAnswer}
                                            onAnswerAgain={() => {
                                                setEvaluationResult(null);
                                                setAnswer("");
                                            }}
                                            onNextQuestion={handleNextQuestion}
                                            onBackToResources={handleBackToResources}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        {/* Dialog Footer */}
                        {topic && dialogStep === 0 && (
                            <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end">
                                <button 
                                    onClick={handleStartPrepare}
                                    className={`px-6 py-3 rounded-xl ${accentColor === 'blue-500' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20' : 'bg-neon-green hover:bg-[#5ab33e] shadow-neon-green/20'} ${accentColor === 'blue-500' ? 'text-white' : 'text-black'} font-bold text-sm tracking-wide transition-all shadow-lg flex items-center gap-2`}
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
