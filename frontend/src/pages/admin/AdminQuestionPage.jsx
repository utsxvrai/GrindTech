import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function AdminQuestionPage() {
    const { user } = useUser();
    const [techs, setTechs] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [selectedTech, setSelectedTech] = useState("");
    const [formData, setFormData] = useState({
        question: "",
        topicId: ""
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [techRes, topicRes, questRes] = await Promise.all([
                api.get('/tech/all'),
                api.get('/topic/all'),
                api.get('/question/all')
            ]);

            if (techRes.data?.data) setTechs(techRes.data.data);
            if (topicRes.data?.data) setTopics(topicRes.data.data);
            if (questRes.data?.data) setQuestions(questRes.data.data);

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
        if (!formData.question || !formData.topicId) return;

        try {
            const meRes = await api.get('/user/me');
            const myUuid = meRes.data.data.uuid;

            await api.post('/question/create', {
                question: formData.question,
                topicId: formData.topicId,
                userId: myUuid
            });

            setFormData(prev => ({ ...prev, question: "" })); // Keep topic selected
            // Refresh questions list
            const res = await api.get('/question/all');
            if (res.data?.data) setQuestions(res.data.data);

            alert("Question Added!");

        } catch (error) {
            console.error("Failed to create question", error);
            alert("Failed to create question");
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Manage Questions</h2>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-xl">
                <h3 className="text-xl font-semibold mb-4">Add New Question</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Filter Topics by Tech</label>
                        <select
                            value={selectedTech}
                            onChange={(e) => {
                                setSelectedTech(e.target.value);
                                setFormData({ ...formData, topicId: "" });
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
                            onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                            disabled={!selectedTech}
                        >
                            <option value="">Select Topic...</option>
                            {filteredTopics.map(t => <option key={t.topicId} value={t.topicId}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Question Text</label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder="e.g. What is the event loop?"
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 h-24"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                            Add Question
                        </button>
                        <button type="button" onClick={() => setFormData({ question: "", topicId: "" })} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800">
                            Clear
                        </button>
                    </div>
                </form>
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
                    <Link to="/" className="text-sm text-gray-400 hover:text-white">Go Home</Link>
                    {/* The "Add one more question" is implicit by staying on the page, but I'll add a specific button if they want a clear action to reset/focus */}
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4 w-1/2">Question</th>
                            <th className="px-6 py-4">Topic</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {questions.slice(0, 20).map(q => (
                            <tr key={q.qid} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-white font-medium">{q.question}</td>
                                <td className="px-6 py-4">
                                    {topics.find(t => t.topicId === q.topicId)?.name || q.topicId}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="p-4 text-xs text-center text-gray-500">Showing last 20 questions</p>
            </div>
        </div>
    );
}
