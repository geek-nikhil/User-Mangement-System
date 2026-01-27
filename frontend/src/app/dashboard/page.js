'use client';

import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import UserTable from '../../components/UserTable';


export default function Dashboard() {
    const { user } = useAuth(); // Removed logout as it's in Navbar now
    const isAdmin = user?.role === 'admin';

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pb-8 text-gray-900">
                <Navbar />

                <main className="px-8 max-w-7xl mx-auto space-y-8">


                    {/* Welcome Section */}
                    <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back, {user?.name}!</h2>
                        <p className="opacity-90">Manage your application efficiently.</p>
                        <div className="mt-6 flex gap-4">
                            <Link href="/products" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100">
                                Manage Products
                            </Link>
                            <Link href="/profile" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800">
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* Admin Section: User Management */}
                    {isAdmin && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-gray-800">User Management</h3>
                            <UserTable />
                        </div>
                    )}

                    {/* Admin Section: Analytics/Transactions */}
                    {isAdmin && (
                         <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                            <h3 className="text-lg font-bold mb-2">Transaction Reports</h3>
                            <p className="text-gray-600 mb-4">View detailed analytics of sales and revenue.</p>
                            {/* In a real app, we'd link to /analytics page. For now, just a placeholder or could fetch the stats here. */}
                            <div className="flex gap-4">
                                <Link href="/transactions" className="text-purple-600 font-semibold hover:underline">
                                    View All Transactions
                                </Link>
                                <span className="text-gray-300">|</span>
                                <button className="text-gray-500 cursor-not-allowed">Analytics Dashboard (API Ready)</button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
