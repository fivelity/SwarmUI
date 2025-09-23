import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    sessionId: string | null;
    setSessionId: (sessionId: string | null) => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem('session_id'));

    useEffect(() => {
        if (sessionId) {
            localStorage.setItem('session_id', sessionId);
        }
        else {
            localStorage.removeItem('session_id');
        }
    }, [sessionId]);

    return (
        <AuthContext.Provider value={{ sessionId, setSessionId, isLoggedIn: !!sessionId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
