import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server } from 'lucide-react';

export default function NodeJsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-white/10 rounded-2xl p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
            <Server className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Node.js Preparation</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            This module is currently under construction. We're building a comprehensive 
            curriculum to help you master Node.js backend development.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
