import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentStatus } from '@/services/api';
import { Progress } from '@/components/ui/progress';


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
    current_model: string | null;
    current_image: { progress: number } | null;
}

export const StatusBar = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState<BackendStatus | null>(null);
    const [genStatus, setGenStatus] = useState<Status | null>(null);

    const refreshStatus = async () => {
        const data = await getCurrentStatus();
        if (data) {
            setStatus(data.backend_status);
            setGenStatus(data.status);
        }
    };

    useEffect(() => {
        const interval = setInterval(refreshStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!status || !genStatus) {
        return null;
    }

    const totalJobs = genStatus.waiting_gens + genStatus.loading_models + genStatus.live_gens + genStatus.waiting_backends;
    const progress = genStatus.current_image?.progress ?? 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-background border-t border-border text-sm text-muted-foreground flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
                <span>{t(status.message)}</span>
            </div>
            <div className="flex-grow flex items-center justify-center gap-4">
                {genStatus.current_model && <span>{t('Model')}: {genStatus.current_model}</span>}
                {totalJobs > 0 && <span>{totalJobs} {t('Jobs Running')}</span>}
            </div>
            <div className="flex-shrink-0 w-64">
                {progress > 0 && progress < 1 && (
                    <div className="flex items-center gap-2">
                        <Progress value={progress * 100} className="w-full" />
                        <span>{Math.round(progress * 100)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};
