import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useUser } from '@clerk/clerk-react';

export default function AdminTopicPage() {
    const { user } = useUser();
    const [techs, setTechs] = useState([]);
    const [topics, setTopics] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        techId: ""
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [techRes, topicRes] = await Promise.all([
                api.get('/tech/all'),
                api.get('/topic/all') // Assuming this exists
            ]);
            
            if (techRes.data?.data) setTechs(techRes.data.data);
            if (topicRes.data?.data) setTopics(topicRes.data.data);

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.techId) return;

        try {
            // Need user ID (UUID) not Clerk ID for the relation if schema uses UUID
            // We might need to fetch our own user UUID first or rely on backend to infer it from Auth
            // Looking at schema: Topic needs userId.
            // Looking at TopicController.create, it expects userId in body? 
            // Usually we'd want backend to infer it from current user.
            // Let's check if we can send the Clerk user ID or if we need to lookup UUID.
            // For now, I'll try to find my UUID from the user list fetch or similar if needed, 
            // BUT standard practice is backend handling user extraction from token.
            // However, TopicController likely expects `userId` in body.
            
            // Let's assume we need to fetch 'me' to get UUID functionality.
            const meRes = await api.get('/user/me');
            console.log(meRes.data.data);
            const myUuid = meRes.data.data.uuid;
            console.log(myUuid);

            await api.post('/topic/create', { 
                name: formData.name, 
                techId: formData.techId,
                userId: myUuid
            });
            
            setFormData(prev => ({ ...prev, name: "" }));
            fetchData();
        } catch (error) {
            console.error("Failed to create topic", error);
            alert("Failed to create topic");
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Manage Topics</h2>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-xl">
                <h3 className="text-xl font-semibold mb-4">Add New Topic</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Select Technology</label>
                        <select 
                            value={formData.techId}
                            onChange={(e) => setFormData({...formData, techId: e.target.value})}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        >
                            <option value="">Select Tech...</option>
                            {techs.map(t => <option key={t.techId} value={t.techId}>{t.techName}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm text-gray-400 mb-1">Topic Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Async/Await"
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Add Topic
                    </button>
                </form>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Topic</th>
                            <th className="px-6 py-4">Tech</th>
                            {/* <th className="px-6 py-4">Created By</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {topics.map(topic => (
                             <tr key={topic.topicId} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-white font-medium">{topic.name}</td>
                                <td className="px-6 py-4">
                                    {/* Tech name isn't directly on topic usually unless included. We can look it up map-side if needed or if backend includes it. */}
                                    {/* Assuming backend might not populate it deep, let's lookup */}
                                    {techs.find(t => t.techId === topic.techId)?.techName || topic.techId}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
