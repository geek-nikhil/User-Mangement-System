'use client';

import Link from 'next/link';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow px-8 py-4 flex justify-between items-center mb-8 text-gray-900 border-b">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                APP
            </Link>
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                <Link href="/products" className="text-gray-600 hover:text-blue-600 font-medium">Products</Link>
                <Link href="/transactions" className="text-gray-600 hover:text-blue-600 font-medium">Transactions</Link>
                <Link href="/profile" className="text-gray-600 hover:text-blue-600 font-medium">Profile</Link>
                
                <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                    <div className="flex flex-col text-right">
                        <span className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</span>
                        <span className="text-xs text-gray-500 uppercase">{user?.role}</span>
                    </div>
                    <button 
                        onClick={logout}
                        className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
