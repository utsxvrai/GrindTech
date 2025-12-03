import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = ['Hero', 'Features', 'Demo', 'Pricing', 'Proof']

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout

    const handleScroll = () => {
      // Show indicator when scrolling
      setIsScrolling(true)
      
      // Clear previous timeout
      clearTimeout(scrollTimeout)
      
      // Hide after 2 seconds of no scrolling
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 2000)

      // Update active section
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      const sectionIndex = Math.floor((scrollPosition / (documentHeight - windowHeight)) * sections.length)
      setActiveSection(Math.min(sectionIndex, sections.length - 1))
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {isScrolling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50 flex gap-3 bottom-6 left-1/2 -translate-x-1/2 flex-row lg:right-6 lg:top-1/2 lg:left-auto lg:bottom-auto lg:translate-x-0 lg:-translate-y-1/2 lg:flex-col"
        >
          {sections.map((section, index) => (
            <div
              key={section}
              className="relative group cursor-pointer"
            >
              {/* Dot */}
              <motion.div
                whileHover={{ scale: 1.4 }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeSection
                    ? 'bg-white w-3 h-3'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              >
                {/* Pulse ring when active */}
                {index === activeSection && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Label on hover */}
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 mb-2 lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:left-auto lg:bottom-auto lg:mb-0 lg:translate-x-0">
                <div className="px-2 py-1 bg-white rounded text-[10px] font-semibold text-black">
                  {section}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
