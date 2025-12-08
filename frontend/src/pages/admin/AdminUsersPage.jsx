import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map(e => e.trim());

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/user/all');
                if (res.data && res.data.data) {
                    setUsers(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Loading users...</div>;

    const adminUsers = users.filter(u => ADMIN_EMAILS.includes(u.useremail));
    
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Admin Management</h2>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Current Admins</h3>
                <p className="text-gray-400 mb-4 text-sm">Defined in Environment Environment Variables</p>
                <div className="space-y-3">
                    {ADMIN_EMAILS.map((email) => {
                        const user = users.find(u => u.useremail === email);
                        return (
                            <div key={email} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 font-bold border border-green-800">
                                        {email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{user ? user.username : 'User Not Found in DB'}</p>
                                        <p className="text-sm text-gray-400">{email}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-800">
                                    Active Admin
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                 <h3 className="text-xl font-semibold mb-4">All Users Reference</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3">Username</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map(user => (
                                <tr key={user.uuid} className="hover:bg-gray-800/50">
                                    <td className="px-4 py-3 text-white">{user.username}</td>
                                    <td className="px-4 py-3">{user.useremail}</td>
                                    <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
}
