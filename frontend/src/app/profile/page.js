'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';


export default function ProfilePage() {
    const { user, login } = useAuth(); // login handles user state update too
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch fresh profile data on mount to ensure name/email are current
        const fetchProfile = async () => {
             try {
                // If we are admin, we might want to ensure we fetch our own ID, but /users/profile is safer if implemented
                // For now, consistent with routes, we can just GET /users/profile if it exists (it does in user.controller)
                // user.controller has getProfile mapped to which route? Let's check user.routes.js
                // It is mapped to router.get('/profile', ...)
                
                const res = await api.get('/users/profile');
                if (res.data.success) {
                    const freshUser = res.data.data;
                    setFormData({ name: freshUser.name, email: freshUser.email });
                    // detailed role check etc.
                }
             } catch (err) {
                 console.error("Failed to fetch profile", err);
                 // Fallback to context if fetch fails
                 if (user) setFormData({ name: user.name, email: user.email });
             }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        try {
            const res = await api.put(`/users/${user.id}`, { 
                name: formData.name, 
                adminSecret: formData.adminSecret 
            });
            if (res.data.success) {
                // Backend now returns { user, token }
                const { user: updatedUser, token: newToken } = res.data.data;
                
                // Manually update storage
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Force a hard reload to ensure Axios interceptor picks up the new token
                // and all app state is reset with the new Admin role.
                window.location.href = '/dashboard';
            }
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };



    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pb-8 text-gray-900">
                <Navbar />
                <div className="flex justify-center mt-8">
                    <div className="bg-white p-8 rounded shadow w-full max-w-md h-fit">
                    <h1 className="text-2xl font-bold mb-6">Profile</h1>
                    {success && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Name</label>
                            <input 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Email</label>
                            <input 
                                value={formData.email} 
                                disabled
                                className="w-full border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Role</label>
                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 bg-gray-200 rounded text-sm text-gray-800">{user?.role}</span>
                                {user?.role !== 'admin' && (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter Admin Key" 
                                            value={formData.adminSecret || ''}
                                            onChange={(e) => setFormData({...formData, adminSecret: e.target.value})}
                                            className="border border-gray-300 rounded p-1 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleSubmit} // Trigger same submit
                                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                                        >
                                            Upgrade
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 font-semibold"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
            </div>
        </ProtectedRoute>
    );
}
