'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import TransactionTable from '../../components/TransactionTable';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function TransactionsPage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [filters, setFilters] = useState({ month: '', year: '', sort: 'newest' });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchTransactions();
    }, [page, isAdmin, filters]); // Re-fetch when filters change

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 20,
                ...filters
            };
            const res = await api.get('/transactions', { params });
            if (res.data.success) {
                setTransactions(res.data.data.transactions);
                setTotalPages(res.data.data.totalPages);
                setTotalRecords(res.data.data.total);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setPage(1); // Reset to page 1 on filter change
    };





    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pb-8 text-gray-900">
                <Navbar />
                <div className="px-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Transactions</h1>
                            <p className="text-sm text-gray-500">Total Records: {totalRecords}</p>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                            Back to Dashboard
                        </Link>
                    </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-center">
                    <select name="sort" value={filters.sort} onChange={handleFilterChange} className="border p-2 rounded text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <option value="newest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    
                    <select name="month" value={filters.month} onChange={handleFilterChange} className="border p-2 rounded text-gray-900 border-gray-300">
                        <option value="">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>

                    <select name="year" value={filters.year} onChange={handleFilterChange} className="border p-2 rounded text-gray-900 border-gray-300">
                        <option value="">All Years</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                    
                    {(filters.month || filters.year || filters.sort !== 'newest') && (
                        <button 
                            onClick={() => setFilters({ month: '', year: '', sort: 'newest' })} 
                            className="text-red-500 text-sm hover:underline ml-2"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-gray-700">Loading transactions...</div>
                ) : (
                    <>
                        <TransactionTable transactions={transactions} />
                        
                        {/* Pagination */}
                        <div className="mt-6 flex justify-center items-center gap-4 text-gray-800">
                            <button 
                                disabled={page === 1} 
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-100 shadow-sm"
                            >
                                Previous
                            </button>
                            <span className="font-medium text-sm">Page {page} of {totalPages}</span>
                            <button 
                                disabled={page === totalPages} 
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-100 shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
            </div>
        </ProtectedRoute>
    );
}
