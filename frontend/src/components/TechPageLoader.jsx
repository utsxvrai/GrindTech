import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

const quotes = [
  {
    text: "Work like hell. I mean you just have to put in 80 to 100 hour weeks every week. This improves the odds of success.",
    author: "Elon Musk"
  },
  {
    text: "The biggest risk is not taking any risk. In a world that is changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
    author: "Mark Zuckerberg"
  },
  {
    text: "Wear your failure as a badge of honor.",
    author: "Sundar Pichai"
  },
  {
    text: "The most successful people I know are primarily internal driven; they do what they do to impress themselves.",
    author: "Sam Altman"
  },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela" 
  },
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs"
  },
  {
    text: "I think it is possible for ordinary people to choose to be extraordinary.",
    author: "Elon Musk"
  }
];

export default function TechPageLoader() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    // Randomize start quote
    setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));

    // Rotate quotes every 4 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/5 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="z-10 flex flex-col items-center max-w-2xl px-6 text-center">
            {/* Animated Icon */}
            <motion.div
                animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="mb-8 relative"
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-transparent border border-neon-green/30 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-neon-green" />
                </div>
                <div className="absolute -inset-2 bg-neon-green/20 blur-xl rounded-full -z-10" />
            </motion.div>

            {/* Quote container with AnimatePresence for smooth transitions */}
            <div className="h-40 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuoteIndex}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <Quote className="w-8 h-8 text-gray-600 mb-2 rotate-180" />
                        <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed tracking-wide font-serif italic">
                            "{quotes[currentQuoteIndex].text}"
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="h-[1px] w-8 bg-neon-green/50" />
                            <span className="text-sm font-bold text-neon-green uppercase tracking-widest">
                                {quotes[currentQuoteIndex].author}
                            </span>
                            <div className="h-[1px] w-8 bg-neon-green/50" />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Loading text/bar */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-center gap-2"
            >
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-neon-green"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
                <p className="text-xs text-gray-500 font-mono animate-pulse">
                    INITIALIZING GRIND SEQUENCE...
                </p>
            </motion.div>
        </div>
    </div>
  );
}
