import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import InstallPage from '@/pages/InstallPage';
import { getNewSession } from '@/services/api';
import { ReactNode, useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, sessionId, setSessionId } = useAuth();
    const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

    useEffect(() => {
        // Check installation status
        fetch('/API/Util/GetInstallStatus')
            .then(res => res.json())
            .then(data => setIsInstalled(data.is_installed))
            .catch(() => setIsInstalled(true)); // Assume installed if API fails
    }, []);

    useEffect(() => {
        // Ensure we have a session ID
        const ensureSession = async () => {
            if (!sessionId) {
                try {
                    const session = await getNewSession();
                    if (session && session.session_id) {
                        setSessionId(session.session_id);
                    }
                } catch (error) {
                    console.error('Failed to get session:', error);
                }
            }
        };
        ensureSession();
    }, [sessionId, setSessionId]);

    // Show loading while checking installation status
    if (isInstalled === null) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-lg">Loading...</div>
        </div>;
    }

    // Show installer if not installed
    if (!isInstalled) {
        return <InstallPage />;
    }

    // Show login if not logged in
    if (!isLoggedIn) {
        return <LoginPage />;
    }

    return <>{children}</>;
};
