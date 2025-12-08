import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map(e => e.trim());

export default function AdminLayout() {
    const { user, isLoaded } = useUser();
    const location = useLocation();

    if (!isLoaded) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/auth" />;

    const userEmail = user.primaryEmailAddress?.emailAddress;

    // Debugging admin access
    console.log("Checking Admin Access:");
    console.log("Current User:", userEmail);
    console.log("Allowed Admins:", ADMIN_EMAILS);

    if (!ADMIN_EMAILS.includes(userEmail)) {
        console.warn("Access Denied: User not in admin list");
        return <Navigate to="/" />;
    }

    const navItems = [
        { path: "/admin/contribute", label: "Admins" },
        { path: "/admin/tech", label: "Tech" },
        { path: "/admin/topic", label: "Topic" },
        { path: "/admin/question", label: "Questions" },
        { path: "/admin/resource", label: "Resources" },
    ];

    return (
        <div className="flex h-screen bg-black text-white font-sans">
            <aside className="w-64 border-r border-gray-800 p-6 flex flex-col">
                <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">GT Admin</h1>
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-green-900/30 text-green-400' : 'hover:bg-gray-900 text-gray-400 hover:text-white'}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto pt-6 border-t border-gray-800">
                    <Link to="/" className="flex items-center gap-2 p-3 text-gray-400 hover:text-white transition-colors">
                        <span>&larr; Back to App</span>
                    </Link>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
