import { FileText, ExternalLink } from 'lucide-react';

export default function ResourceCard({ resources = [], accentColor = 'neon-green' }) {
    // Map accent color to Tailwind classes
    const colorMap = {
        'neon-green': { icon: 'text-neon-green', border: 'hover:border-neon-green/30', text: 'group-hover:text-neon-green', bg: 'hover:bg-neon-green/5' },
        'blue-500': { icon: 'text-blue-500', border: 'hover:border-blue-500/30', text: 'group-hover:text-blue-500', bg: 'hover:bg-blue-500/5' }
    };

    const colors = colorMap[accentColor] || colorMap['neon-green'];

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${colors.icon}`} />
                    Learning Resources
                </h3>
                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto scrollbar-hide">
                    {resources && resources.length > 0 ? (
                        resources.map((res, i) => (
                            <a
                                key={i}
                                href={res.resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-6 rounded-2xl bg-zinc-900/50 border border-white/10 ${colors.border} ${colors.bg} hover:bg-zinc-800/50 transition-all group block relative overflow-hidden min-h-[120px] flex flex-col justify-between`}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-current rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-current rounded-full translate-y-6 -translate-x-6"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow flex flex-col justify-center">
                                    <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-gray-400 ${colors.text} transition-colors mb-4 group-hover:scale-110 transform duration-200`}>
                                        <span className="text-sm font-bold">{i + 1}</span>
                                    </div>
                                    <h4 className={`font-bold text-white ${colors.text} transition-colors text-lg leading-tight mb-2`}>
                                        {res.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                        {res.resource.length > 60 ? res.resource.substring(0, 60) + '...' : res.resource}
                                    </p>
                                </div>

                                {/* External Link Indicator */}
                                <div className="relative z-10 flex justify-end mt-4">
                                    <div className={`p-2 rounded-lg bg-zinc-800/50 ${colors.icon} transition-colors group-hover:bg-zinc-700/50`}>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/10 text-center">
                            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No resources available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
