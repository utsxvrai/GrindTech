import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Mic, Send, Square } from 'lucide-react'

export default function VoiceDemo() {
  const [transcribedText, setTranscribedText] = useState('')
  const [showSubmit, setShowSubmit] = useState(false)
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [evaluationText, setEvaluationText] = useState('')
  const [showMicCursor, setShowMicCursor] = useState(false)
  const [showSubmitCursor, setShowSubmitCursor] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  
  const mockTranscription = 'Node.js uses an event loop to handle asynchronous operations. It continuously checks the call stack and callback queue, executing callbacks when the stack is empty.'
  const evaluation = '✅ Score: 8/10 - Good answer! You correctly explained the event loop and asynchronous handling. To improve: mention the phases of the event loop (timers, I/O callbacks, poll, check, close callbacks) and the microtask queue.'

  // Automated demo sequence
  useEffect(() => {
    const runDemo = async () => {
      // Wait 2 seconds before starting
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 1: Show cursor on mic button and click
      setShowMicCursor(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowMicCursor(false)
      
      // Step 2: Start recording
      setIsRecording(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Step 3: Type out transcription
      let index = 0
      const transcriptionInterval = setInterval(() => {
        if (index < mockTranscription.length) {
          setTranscribedText(mockTranscription.slice(0, index + 1))
          index++
        } else {
          clearInterval(transcriptionInterval)
        }
      }, 40)
      
      // Wait for transcription to complete
      await new Promise(resolve => setTimeout(resolve, mockTranscription.length * 40 + 800))
      setIsRecording(false)
      
      // Step 4: Show submit button
      setShowSubmit(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Step 5: Show cursor on submit button and click
      setShowSubmitCursor(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowSubmitCursor(false)
      
      // Step 6: Hide submit and show evaluation
      await new Promise(resolve => setTimeout(resolve, 300))
      setShowSubmit(false)
      setShowEvaluation(true)
      
      // Step 7: Type out evaluation
      let evalIndex = 0
      const evalInterval = setInterval(() => {
        if (evalIndex < evaluation.length) {
          setEvaluationText(evaluation.slice(0, evalIndex + 1))
          evalIndex++
        } else {
          clearInterval(evalInterval)
        }
      }, 20)
      
      // Step 8: Wait before restarting
      await new Promise(resolve => setTimeout(resolve, evaluation.length * 20 + 3000))
      
      // Reset and restart
      setTranscribedText('')
      setShowSubmit(false)
      setShowEvaluation(false)
      setEvaluationText('')
      setIsRecording(false)
      runDemo() // Loop
    }
    
    runDemo()
  }, [])

  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-deep-dark to-black">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            See It <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">In Action</span>
          </h2>
          <p className="text-lg text-gray-400">
            Watch how GrindTech evaluates your interview answers in real-time
          </p>
        </motion.div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Question 1 / 6</span>
              <span className="text-sm text-white font-semibold">Level 3 - Node.js</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '16.6%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* Main Demo Card */}
          <div className="bg-black rounded-2xl border border-gray-800 overflow-hidden">
            {/* Question Header */}
            <div className="px-8 py-6 border-b border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-3">NODE.JS EVENT LOOP</h3>
              <p className="text-lg text-gray-300">
                Explain how Node.js event loop works and its role in handling asynchronous operations.
              </p>
            </div>

            {/* Answer Area */}
            <div className="p-8">
              {/* Text Input Area */}
              <div className="relative mb-6">
                <textarea
                  value={transcribedText}
                  readOnly
                  placeholder="Click the microphone to start recording your answer..."
                  className="w-full h-[200px] bg-black rounded-xl border-2 border-white/50 p-6 text-gray-200 resize-none focus:outline-none focus:border-white"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Mic Button */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Cursor on Mic Button */}
                  {showMicCursor && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/2 left-1/2 z-50 pointer-events-none"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-xl"
                      >
                        <path
                          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                          fill="white"
                          stroke="black"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </motion.div>
                  )}
                  
                  <motion.div
                    animate={showMicCursor ? { scale: [1, 0.9, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 rounded-full ${
                      isRecording
                        ? 'bg-white'
                        : 'bg-white'
                    } flex items-center justify-center shadow-2xl relative`}
                  >
                    {isRecording ? (
                      <Square className="w-7 h-7 text-black fill-black" />
                    ) : (
                      <Mic className="w-7 h-7 text-black" />
                    )}
                    
                    {isRecording && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-white"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Submit Button */}
              {showSubmit && !showEvaluation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Cursor on Submit Button */}
                  {showSubmitCursor && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/2 left-1/2 z-50 pointer-events-none"
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-xl"
                      >
                        <path
                          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                          fill="white"
                          stroke="black"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </motion.div>
                  )}
                  
                  <motion.button
                    animate={showSubmitCursor ? { scale: [1, 0.95, 1] } : {
                      boxShadow: [
                        '0 0 0px rgba(255, 255, 255, 0.5)',
                        '0 0 20px rgba(255, 255, 255, 0.8)',
                        '0 0 0px rgba(255, 255, 255, 0.5)',
                      ]
                    }}
                    transition={showSubmitCursor ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
                    className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5 text-black" />
                    Submit Answer
                  </motion.button>
                </motion.div>
              )}

              {/* AI Evaluation */}
              {showEvaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-black rounded-xl border border-white/30 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center">
                        <span className="text-black font-bold text-sm">AI</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white mb-3">GrindTech AI Evaluation</p>
                        <p className="text-gray-300 leading-relaxed">
                          {evaluationText}
                          {evaluationText.length < evaluation.length && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="inline-block w-2 h-4 bg-white ml-1"
                            />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 opacity-50">
                    <button className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold">
                      Try Again
                    </button>
                    <button className="flex-1 px-6 py-3 bg-white hover:opacity-90 text-black rounded-xl font-semibold transition-opacity">
                      Next Question →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
