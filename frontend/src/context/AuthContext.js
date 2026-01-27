'use client'; // Next.js Client Component

import { createContext, useState, useEffect, useContext } from 'react';
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from '../utils/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Initialize auth state from local storage
        const token = getToken();
        const storedUser = getUser();
        
        if (token && storedUser) {
            setUserState(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setToken(token);
        setUser(userData);
        setUserState(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        removeToken();
        removeUser();
        setUserState(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
