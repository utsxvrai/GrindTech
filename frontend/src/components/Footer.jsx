import { Github, Twitter, Linkedin, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/[0.06] py-10 px-4 sm:px-6 lg:px-8">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              Grind<span className="text-gray-400">Tech</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-xs">
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">About</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">Features</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">Contact</a>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.06] flex items-center justify-center transition-all duration-200"
              >
                <Icon className="w-3.5 h-3.5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} GrindTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
