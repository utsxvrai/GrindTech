import { FileText, ExternalLink, PlayCircle, BookOpen, Globe, Code } from 'lucide-react';

export default function ResourceCard({ resources = [], accentColor = 'neon-green' }) {
    // Map accent color to Tailwind classes
    const colorMap = {
        'neon-green': { 
            icon: 'text-neon-green', 
            border: 'hover:border-neon-green/30', 
            text: 'text-neon-green', 
            bg: 'bg-neon-green/5',
            glow: 'shadow-neon-green/10'
        },
        'blue-500': { 
            icon: 'text-blue-500', 
            border: 'hover:border-blue-500/30', 
            text: 'text-blue-500', 
            bg: 'bg-blue-500/5',
            glow: 'shadow-blue-500/10'
        }
    };

    const colors = colorMap[accentColor] || colorMap['neon-green'];

    const getResourceType = (res) => {
        const name = (res.name || '').toLowerCase();
        const url = (res.resource || '').toLowerCase();
        
        if (name.includes('video') || name.includes('youtube') || url.includes('youtube.com') || url.includes('youtu.be')) {
            return { type: 'Video', icon: PlayCircle };
        }
        if (name.includes('blog') || name.includes('article') || name.includes('tutorial')) {
            return { type: 'Article', icon: BookOpen };
        }
        if (url.includes('github.com') || name.includes('code') || name.includes('repo')) {
            return { type: 'Code', icon: Code };
        }
        return { type: 'Guide', icon: Globe };
    };

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className={`w-1 h-4 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
                        Learning Path Resources
                    </h3>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{resources.length} Modules</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {resources && resources.length > 0 ? (
                        resources.map((res, i) => {
                            const { type, icon: ResourceIcon } = getResourceType(res);
                            return (
                                <a
                                    key={i}
                                    href={res.resource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center p-4 sm:p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 ${colors.border} transition-all duration-300 relative overflow-hidden active:scale-[0.98] shadow-lg`}
                                >
                                    {/* Animated Background Glow */}
                                    <div className={`absolute -right-20 -top-20 w-40 h-40 ${colors.bg} rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className={`absolute -left-20 -bottom-20 w-40 h-40 ${colors.bg} rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Link Icon Container */}
                                    <div className="relative z-10 flex items-center gap-4 sm:gap-6 flex-grow">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${colors.icon}`}>
                                            <ResourceIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 ${colors.text}`}>
                                                    {type}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                                                    Module 0{i + 1}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-white text-sm sm:text-base lg:text-lg leading-snug group-hover:text-white transition-colors truncate">
                                                {res.name}
                                            </h4>
                                            <span className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {res.resource.replace(/^https?:\/\/(www\.)?/, '')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Arrow */}
                                    <div className="relative z-10 ml-4">
                                        <div className={`p-2 rounded-xl bg-white/5 text-gray-500 group-hover:text-white group-hover:bg-white/10 transition-all ${colors.icon}`}>
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </a>
                            );
                        })
                    ) : (
                        <div className="p-12 rounded-3xl bg-zinc-900/20 border border-dashed border-white/10 text-center">
                            <FileText className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm font-medium">No resources linked to this topic yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
