import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-glow/10 via-neon-purple/5 to-neon-pink/10" />
      <div className="absolute top-20 left-10 w-48 h-48 bg-indigo-glow/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-neon-pink/15 rounded-full blur-3xl animate-float" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-white">
                {isSignUp ? "Join GrindTech" : "Welcome Back"}
            </h1>
            <p className="text-gray-400">
                {isSignUp ? "Start your interview prep journey" : "Continue where you left off"}
            </p>
        </div>

        <div className="flex justify-center">
            {isSignUp ? (
                <SignUp routing="hash" signInUrl="/auth#signin" />
            ) : (
                <SignIn routing="hash" signUpUrl="/auth#signup" />
            )}
        </div>
        
        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
            >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
