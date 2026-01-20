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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {resources && resources.length > 0 ? (
                        resources.map((res, i) => (
                            <a
                                key={i}
                                href={res.resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-white/10 ${colors.border} ${colors.bg} hover:bg-zinc-800/50 transition-all group block relative overflow-hidden aspect-square flex flex-col justify-between`}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-current rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-current rounded-full translate-y-6 -translate-x-6"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow flex flex-col justify-center">
                                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-gray-400 ${colors.text} transition-colors mb-2 sm:mb-3 group-hover:scale-110 transform duration-200`}>
                                        <span className="text-sm sm:text-xl font-bold">{i + 1}</span>
                                    </div>
                                    <h4 className={`font-semibold text-white ${colors.text} transition-colors text-sm sm:text-lg lg:text-xl leading-tight mb-1 sm:mb-2 line-clamp-2`}>
                                        {res.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed hidden sm:block">
                                        {res.resource.length > 35 ? res.resource.substring(0, 35) + '...' : res.resource}
                                    </p>
                                </div>

                                {/* External Link Indicator */}
                                <div className="relative z-10 flex justify-end">
                                    <div className={`p-1 sm:p-1.5 rounded-lg bg-zinc-800/50 ${colors.icon} transition-colors group-hover:bg-zinc-700/50`}>
                                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
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
