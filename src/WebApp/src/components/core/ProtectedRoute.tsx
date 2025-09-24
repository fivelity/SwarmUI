import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import InstallPage from '@/pages/InstallPage';
import { ReactNode, useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn } = useAuth();
    const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

    useEffect(() => {
        // Check installation status
        fetch('/API/Util/GetInstallStatus')
            .then(res => res.json())
            .then(data => setIsInstalled(data.is_installed))
            .catch(() => setIsInstalled(true)); // Assume installed if API fails
    }, []);

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
