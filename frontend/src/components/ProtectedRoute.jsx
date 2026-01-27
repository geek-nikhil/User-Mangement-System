'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
        if (!loading && isAuthenticated && adminOnly && user?.role !== 'admin') {
            router.push('/dashboard'); // Redirect non-admins to dashboard
        }
    }, [isAuthenticated, loading, router, user, adminOnly]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Return null while redirecting
    }

    if (adminOnly && user?.role !== 'admin') {
        return null; 
    }

    return <>{children}</>;
};

export default ProtectedRoute;
