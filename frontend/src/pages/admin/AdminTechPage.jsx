import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminTechPage() {
    const [techs, setTechs] = useState([]);
    const [newTech, setNewTech] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchTechs = async () => {
        try {
            const res = await api.get('/tech/all');
            // Assuming response structure
            if (res.data && res.data.data) {
                setTechs(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch techs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTech.trim()) return;
        try {
            await api.post('/tech/create', { techName: newTech });
            setNewTech("");
            fetchTechs();
        } catch (error) {
            console.error("Failed to create tech", error);
            alert("Failed to create tech");
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Manage Technologies</h2>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-xl">
                <h3 className="text-xl font-semibold mb-4">Add New Technology</h3>
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        placeholder="e.g. React, Node.js"
                        className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    />
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Add Tech
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? <p>Loading...</p> : techs.map((tech) => (
                    <div key={tech.techId} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center group hover:border-gray-700 transition-all">
                        <span className="font-semibold text-lg">{tech.techName}</span>
                         {/* <button className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
