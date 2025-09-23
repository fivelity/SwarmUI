import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const api = {
    getCurrentStatus: async () => fetch('/API/Admin/GetCurrentStatus').then(res => res.json()),
};

interface BackendStatus {
    class: string;
    message: string;
    any_loading: boolean;
}

interface Status {
    waiting_gens: number;
    loading_models: number;
    live_gens: number;
    waiting_backends: number;
}

export const StatusBar = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState<BackendStatus | null>(null);
    const [genStatus, setGenStatus] = useState<Status | null>(null);

    const refreshStatus = async () => {
        const data = await api.getCurrentStatus();
        setStatus(data.backend_status);
        setGenStatus(data.status);
    };

    useEffect(() => {
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!status || !genStatus) {
        return null;
    }

    const total = genStatus.waiting_gens + genStatus.loading_models + genStatus.live_gens + genStatus.waiting_backends;

    return (
        <div className={`fixed bottom-0 left-0 right-0 p-2 text-center text-white bg-gray-700`}>
            <span>{t(status.message)}</span>
            {total > 0 && <span className="ml-4">{total} {t('jobs running...')}</span>}
        </div>
    );
};
