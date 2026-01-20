import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';

export default function LearningMeter({ techId, accentColor = 'neon-green' }) {
  const { getToken } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const colorMap = {
    'neon-green': {
      text: 'text-neon-green',
      bar: 'bg-neon-green',
      shadow: 'shadow-[0_0_20px_rgba(108,194,74,0.6)]'
    },
    'blue-500': {
      text: 'text-blue-500',
      bar: 'bg-blue-500',
      shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]'
    }
  };

  const colors = colorMap[accentColor] || colorMap['neon-green'];

  useEffect(() => {
    const fetchProgress = async () => {
      if (!techId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = await getToken();

        // Fetch total topics for this tech
        const topicsResponse = await api.get(`/topic/tech/${techId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch completed topics for this user
        const progressResponse = await api.get(`/progress/tech/${techId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const totalTopics = topicsResponse.data?.data?.length || 0;
        const completedTopics = progressResponse.data?.data?.completedTopicIds?.length || 0;

        // Calculate percentage
        const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        setProgress(percentage);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgress(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [techId, getToken]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md mx-auto mb-8"
      >
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <div className={`flex items-center gap-2 ${colors.text} mb-1`}>
              <TrendingUp className="w-4 h-4" />
              <span className="font-mono text-sm tracking-widest uppercase font-bold">
                LOADING PROGRESS...
              </span>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-gray-700 animate-pulse rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md mx-auto mb-8"
    >
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col">
          <div className={`flex items-center gap-2 ${colors.text} mb-1`}>
            <TrendingUp className="w-4 h-4" />
            <span className="font-mono text-sm tracking-widest uppercase font-bold">
              LEARNING PROGRESS
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
            Consistency is the key to mastery.
          </span>
        </div>
        <span className="text-white font-mono text-xl font-bold">
          {progress}%
        </span>
      </div>
      
      <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
          className={`h-full ${colors.bar} ${colors.shadow} relative`}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
          
          {/* Tip Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_15px_2px_rgba(255,255,255,0.8)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
