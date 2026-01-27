'use client';

import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Edit } from 'lucide-react';

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users'); // Protected, Admin only
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!confirm(`Change role to ${newRole}?`)) return;
        try {
            const res = await api.put(`/users/${userId}`, { role: newRole });
            if (res.data.success) {
               setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            alert('Failed to update role');
        }
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="overflow-x-auto bg-white rounded shadow text-gray-900">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 border-t">
                    <tr>
                        <th scope="col" className="px-6 py-4">Name</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Role</th>
                        <th scope="col" className="px-6 py-4">Joined</th>
                        <th scope="col" className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b dark:border-neutral-600 hover:bg-neutral-100">
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">
                                <select 
                                    value={user.role} 
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className={`px-2 py-1 rounded text-xs border cursor-pointer focus:outline-none ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-green-100 text-green-800 border-green-200'}`}
                                >
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                </select>
                            </td>
                            <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 gap-2 flex">
                                <button className="text-blue-600 hover:text-blue-800" disabled><Edit size={18} /></button>
                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
