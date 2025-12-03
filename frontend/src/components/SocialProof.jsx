import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    text: 'GrindTech\'s level-based system helped me master System Design. The AI feedback was like having a senior engineer mentor me. Cracked my Google interview!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Backend Developer',
    avatar: 'RV',
    text: 'The voice answering feature helped me practice explaining concepts clearly. AI evaluation showed exactly where I was weak. Pro subscription is absolutely worth it!',
    rating: 5,
  },
  {
    name: 'Ananya Singh',
    role: 'DevOps Engineer @ Amazon',
    avatar: 'AS',
    text: 'Went through all 30 levels of DevOps and Cloud. Real interview questions with instant scoring prepared me better than any course. Landed my dream job!',
    rating: 5,
  },
]

export default function SocialProof() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
              Learners Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands who have transformed their learning journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-strong p-8 rounded-3xl border border-white/10 hover:border-neon-purple/50 transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-neon-pink fill-neon-pink" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-300 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-glow to-neon-purple flex items-center justify-center font-bold text-lg">
                  {/* i want awatar black texted */}
                  <span className="text-black">{testimonial.avatar}</span> 
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
