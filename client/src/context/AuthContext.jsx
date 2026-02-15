import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for token
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            // Decode token or fetch user profile (simplified here)
            setUser({ token, role, name: 'User' }); // Replace with real fetch
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        setUser({ token: data.token, role: data.role, name: 'User' });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
