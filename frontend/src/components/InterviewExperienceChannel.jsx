import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Building2, User, Sparkles, Clock, Globe } from 'lucide-react';
import { io } from 'socket.io-client';

const InterviewExperienceChannel = ({ accentColor = 'neon-green', userId, username, techId, techName, hideHeader = false }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [company, setCompany] = useState('');
    const [socket, setSocket] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const messagesEndRef = useRef(null);

    const accentClasses = {
        'neon-green': {
            text: 'text-neon-green',
            bg: 'bg-neon-green',
            border: 'border-neon-green/30',
            glow: 'shadow-[0_0_15px_rgba(108,194,74,0.3)]',
            gradient: 'from-neon-green/20 to-transparent'
        },
        'blue-500': {
            text: 'text-blue-500',
            bg: 'bg-blue-500',
            border: 'border-blue-500/30',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
            gradient: 'from-blue-500/20 to-transparent'
        }
    };

    const style = accentClasses[accentColor] || accentClasses['neon-green'];

    const getUserColor = (name) => {
        const colors = [
            '#ff4444ff', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Sky
            '#FFA07A', // Salmon
            '#98D8C8', // Mint
            '#F7D794', // Yellow
            '#778BEB', // Blue
            '#786FA6', // Purple
            '#FDA7DF', // Pink
            '#12CBC4', // Cyan
            '#ED4C67', // Strawberry
            '#F79F1F', // Orange
            '#A3CB38', // Lime
        ];
        
        // Simple hash function to get a consistent color for the same name
        let hash = 0;
        const stringToHash = name || 'Anonymous';
        for (let i = 0; i < stringToHash.length; i++) {
            hash = stringToHash.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!techId) return;

        const s = io(import.meta.env.VITE_BACKEND_URL, {
            transports: ["websocket"],
        });

        s.on("connect", () => {
            s.emit("join-tech-feed", techId);
        });

        s.on("recent-messages", (recentMessages) => {
            setMessages(recentMessages);
        });

        s.on("new-global-message", (message) => {
            setMessages(prev => [...prev.slice(-49), message]);
        });

        setSocket(s);

        return () => {
            if (s) s.disconnect();
        };
    }, [techId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || isSubmitting || !techId) return;

        setIsSubmitting(true);
        const data = {
            content: newMessage,
            company: company,
            userId: userId,
            techId: techId
        };

        socket.emit("share-interview-experience", data);
        setNewMessage('');
        setCompany('');
        setIsSubmitting(false);
    };

    return (
        <div className={`w-full h-full flex flex-col min-h-0 relative group bg-zinc-900/20 rounded-3xl border border-white/10 overflow-hidden`}>
            {/* Header */}
            {!hideHeader && (
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${style.glow}`}>
                            <Globe className={`w-4 h-4 ${style.text} animate-pulse`} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                {techName ? `${techName} Insights` : 'Recently Asked Questions'}
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-bold uppercase tracking-tight">
                                    <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
                                    Live
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>
            )}

            {/* Feed Area (Discord style: most recent at bottom) */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide flex flex-col">
                <div className="mt-auto" /> {/* Pushes messages to the bottom */}
                
                <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                        const userName = msg.user?.username || 'Hunter';
                        const userColor = getUserColor(userName);
                        
                        return (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3 group/msg"
                            >
                                <div 
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border shrink-0 mt-0.5"
                                    style={{ borderColor: `${userColor}44` }} // Semi-transparent border
                                >
                                    <User className="w-4 h-4" style={{ color: userColor }} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span 
                                            className="text-xs font-bold hover:underline cursor-pointer truncate max-w-[120px]"
                                            style={{ color: userColor }}
                                        >
                                            {userName}
                                        </span>
                                    {msg.company && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${style.text} font-bold truncate max-w-[100px]`}>
                                            @{msg.company}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-gray-500 shrink-0">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed break-words">
                                    {msg.content}
                                </p>
                            </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />

                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3 opacity-50 py-20">
                        <Sparkles className="w-8 h-8" />
                        <p className="text-xs font-medium text-center">No insights yet.<br/>Be the first to share!</p>
                    </div>
                )}
            </div>

            {/* Compact Pinned Input Box */}
            <div className="p-4 bg-zinc-900/40 border-t border-white/5 shrink-0">
                <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="relative w-32 shrink-0">
                            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                            <input 
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Company"
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-8 pr-2 text-xs focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <div className="flex-grow relative">
                            <input 
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Share an interview question..."
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-4 pr-10 text-xs focus:outline-none focus:border-white/20 transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!newMessage.trim() || isSubmitting}
                                className={`absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all
                                    ${newMessage.trim() && !isSubmitting 
                                        ? `${style.text} hover:bg-white/5` 
                                        : 'text-gray-600 opacity-50'}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-1 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span className="text-[9px] text-gray-500">Post Questions asked in your interview</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InterviewExperienceChannel;
