import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import InstallPage from './pages/InstallPage.tsx';
import { getInstallStatus } from './services/api';
import './index.css';
import './i18n';
import { ThemeProvider } from './contexts/ThemeProvider';
import { LayoutProvider } from './contexts/LayoutProvider';

function Root() {
    const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

    useEffect(() => {
        getInstallStatus().then(data => {
            setIsInstalled(data.is_installed);
        });
    }, []);

    if (isInstalled === null) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    return (
        <Router>
            <Routes>
                <Route path="/install" element={<InstallPage />} />
                <Route path="/*" element={isInstalled ? <App /> : <Navigate to="/install" />} />
            </Routes>
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <LayoutProvider>
                <Root />
            </LayoutProvider>
        </ThemeProvider>
    </React.StrictMode>
);
