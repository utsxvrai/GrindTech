import { Github, Twitter, Linkedin, Target } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
            {/* Neon line separator */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-glow to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-glow via-neon-purple to-neon-pink flex items-center justify-center shadow-lg">
                            <Target className="w-8 h-8 text-black" />
                        </div>
                        <span className="text-2xl font-black">
                            <span className="bg-gradient-to-r from-indigo-glow to-neon-purple bg-clip-text text-transparent">
                                Grind
                            </span>
                            <span className="text-white">Tech</span>
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex gap-8 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>

                    {/* Social links */}
                    <div className="flex gap-4">
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full glass border border-white/10 hover:border-indigo-glow/50 flex items-center justify-center transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full glass border border-white/10 hover:border-indigo-glow/50 flex items-center justify-center transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="w-10 h-10 rounded-full glass border border-white/10 hover:border-indigo-glow/50 flex items-center justify-center transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
                    <p>© 2025 GrindTech. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
