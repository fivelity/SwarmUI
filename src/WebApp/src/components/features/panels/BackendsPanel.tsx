import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listBackends, toggleBackend, restartAllBackends } from '@/services/api';

type BackendStatus = 'running' | 'errored' | 'disabled' | 'waiting' | 'loading';

interface Backend {
    id: number;
    title: string;
    status: BackendStatus;
    type: string;
    enabled: boolean;
}

const statusVariant = (status: BackendStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'running': return 'default';
        case 'errored': return 'destructive';
        case 'disabled': return 'secondary';
        default: return 'outline';
    }
}

export const BackendsPanel = () => {
    const { t } = useTranslation();
    const [backends, setBackends] = useState<Record<string, Backend>>({});

    const refresh = () => {
        listBackends().then(setBackends);
    };

    useEffect(refresh, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button onClick={restartAllBackends}>{t('Restart All Backends')}</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(backends).map(backend => (
                    <Card key={backend.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {backend.title}
                                <Badge variant={statusVariant(backend.status)}>{backend.status.toUpperCase()}</Badge>
                            </CardTitle>
                            <CardDescription>{t('Type')}: {backend.type}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => toggleBackend(backend.id, !backend.enabled).then(refresh)} variant={backend.enabled ? 'secondary' : 'default'}>
                                {backend.enabled ? t('Disable') : t('Enable')}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
