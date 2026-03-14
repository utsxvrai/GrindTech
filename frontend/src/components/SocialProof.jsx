import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    text: 'GrindTech\'s level-based system helped me master System Design. The AI feedback was like having a senior engineer mentor me. Cracked my Google interview!',
    rating: 5,
    color: '#6cc24a',
  },
  {
    name: 'Rahul Verma',
    role: 'Backend Developer',
    avatar: 'RV',
    text: 'The voice answering feature helped me practice explaining concepts clearly. AI evaluation showed exactly where I was weak. Pro subscription is absolutely worth it!',
    rating: 5,
    color: '#00FFFF',
  },
  {
    name: 'Ananya Singh',
    role: 'DevOps Engineer @ Amazon',
    avatar: 'AS',
    text: 'Went through all 30 levels of DevOps and Cloud. Real interview questions with instant scoring prepared me better than any course. Landed my dream job!',
    rating: 5,
    color: '#3178C6',
  },
]

export default function SocialProof() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.05)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-base text-gray-400 max-w-lg mx-auto">
            Join hundreds who have leveled up their interview game with GrindTech.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div className="h-full p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex flex-col relative overflow-hidden">
                {/* Hover glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: testimonial.color + '10' }}
                />

                {/* Quote icon */}
                <Quote className="w-7 h-7 text-white/[0.06] mb-3 rotate-180" />

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-300 leading-relaxed mb-5 flex-grow text-xs">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-black shrink-0"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
