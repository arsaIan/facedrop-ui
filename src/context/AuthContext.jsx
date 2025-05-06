import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
            setIsLoading(false);
        };

        // Initial check
        checkAuth();

        // Listen for storage events (in case token is changed in another tab)
        window.addEventListener('storage', checkAuth);

        // Cleanup
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 