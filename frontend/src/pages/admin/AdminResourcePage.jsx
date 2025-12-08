import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useUser } from '@clerk/clerk-react';

export default function AdminResourcePage() {
    const { user } = useUser();
    const [techs, setTechs] = useState([]);
    const [topics, setTopics] = useState([]);
    const [resources, setResources] = useState([]);
    
    const [selectedTech, setSelectedTech] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        resource: "", // URL or Content
        topicId: ""
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [techRes, topicRes, resRes] = await Promise.all([
                api.get('/tech/all'),
                api.get('/topic/all'),
                api.get('/resource/all')
            ]);
            
            if (techRes.data?.data) setTechs(techRes.data.data);
            if (topicRes.data?.data) setTopics(topicRes.data.data);
            if (resRes.data?.data) setResources(resRes.data.data);

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTopics = topics.filter(t => t.techId === selectedTech);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.topicId || !formData.resource) return;

        setIsSubmitting(true);
        try {
            // ResourceCreate usually requires topicId, name, resource.
            await api.post('/resource/create', { 
                name: formData.name,
                resource: formData.resource,
                topicId: formData.topicId,
            });
            
            setFormData(prev => ({ ...prev, name: "", resource: "" })); 
            
            const res = await api.get('/resource/all');
            if (res.data?.data) setResources(res.data.data);
            
            alert("Resource Added!");

        } catch (error) {
            console.error("Failed to create resource", error);
            alert("Failed to create resource");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Manage Resources</h2>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-xl">
                <h3 className="text-xl font-semibold mb-4">Add New Resource</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm text-gray-400 mb-1">Filter Topics by Tech</label>
                        <select 
                            value={selectedTech}
                            onChange={(e) => {
                                setSelectedTech(e.target.value);
                                setFormData({...formData, topicId: ""});
                            }}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        >
                            <option value="">Select Tech...</option>
                            {techs.map(t => <option key={t.techId} value={t.techId}>{t.techName}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Select Topic</label>
                        <select 
                            value={formData.topicId}
                            onChange={(e) => setFormData({...formData, topicId: e.target.value})}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            disabled={!selectedTech}
                        >
                            <option value="">Select Topic...</option>
                            {filteredTopics.map(t => <option key={t.topicId} value={t.topicId}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                         <label className="block text-sm text-gray-400 mb-1">Resource Name (Title)</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Official Docs"
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div>
                         <label className="block text-sm text-gray-400 mb-1">Resource Link/Content</label>
                        <input 
                            type="text" 
                            value={formData.resource}
                            onChange={(e) => setFormData({...formData, resource: e.target.value})}
                            placeholder="https://..."
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full font-medium py-2 px-6 rounded-lg transition-colors flex justify-center items-center gap-2 ${isSubmitting ? 'bg-green-800 cursor-not-allowed text-gray-300' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </>
                        ) : (
                            "Add Resource"
                        )}
                    </button>
                </form>
            </div>

             <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Link</th>
                            <th className="px-6 py-4">Topic</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {resources.slice(0, 20).map(r => (
                             <tr key={r.rid} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-white font-medium">{r.name}</td>
                                <td className="px-6 py-4 font-mono text-xs">{r.resource.substring(0, 30)}...</td>
                                <td className="px-6 py-4">
                                    {topics.find(t => t.topicId === r.topicId)?.name || r.topicId}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
