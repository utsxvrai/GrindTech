import { FileText } from 'lucide-react';

export default function ResourceCard({ resources = [], accentColor = 'neon-green' }) {
    // Map accent color to Tailwind classes
    const colorMap = {
        'neon-green': { icon: 'text-neon-green', border: 'hover:border-neon-green/30', text: 'group-hover:text-neon-green' },
        'blue-500': { icon: 'text-blue-500', border: 'hover:border-blue-500/30', text: 'group-hover:text-blue-500' }
    };

    const colors = colorMap[accentColor] || colorMap['neon-green'];

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${colors.icon}`} />
                    Learning Resources
                </h3>
                <div className="grid gap-3">
                    {resources && resources.length > 0 ? (
                        resources.map((res, i) => (
                            <a 
                                key={i} 
                                href={res.resource} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`p-4 rounded-xl bg-white/5 border border-white/5 ${colors.border} hover:bg-white/10 transition-all group flex items-start gap-4`}
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 ${colors.text} transition-colors`}>
                                    <span className="text-xs font-bold">{i + 1}</span>
                                </div>
                                <div>
                                    <h4 className={`font-semibold text-white ${colors.text} transition-colors`}>{res.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{res.resource}</p>
                                </div>
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No resources available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
