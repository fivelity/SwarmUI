import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <LoginPage />;
    }

    return <>{children}</>;
};
