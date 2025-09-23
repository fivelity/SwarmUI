import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getServerInfo, checkForUpdates, shutdown, restart, clearVRAM, clearSysRAM } from '@/services/api';

interface ServerInfo {
    host: string;
    local_ip: string;
    public_url: string;
    resource_usage: {
        cpu: number;
        ram_used: number;
        ram_total: number;
        vram_used: number;
        vram_total: number;
    };
    connected_users: string[];
}

export const ServerInfoPanel = () => {
    const { t } = useTranslation();
        const [info, setInfo] = useState<ServerInfo | null>(null);
    const [updateStatus, setUpdateStatus] = useState(t('Checking...'));

    const fetchInfo = async () => {
        const data = await getServerInfo();
        setInfo(data);
    };

    const handleCheckForUpdates = async () => {
        setUpdateStatus(t('Checking for updates...'));
        try {
            const result = await checkForUpdates();
            setUpdateStatus(result.message || result.status);
        } catch (error: any) {
            setUpdateStatus(`${t('Error checking for updates')}: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchInfo();
        handleCheckForUpdates(); // Initial check
        const interval = setInterval(fetchInfo, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (!info) {
        return <div>{t('Loading server info...')}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('Local Network')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {info.host === '127.0.0.1' || info.host === 'localhost' ? (
                        <p>{t('This server is only accessible from this computer.')}</p>
                    ) : (
                        <p>{t('This server is likely accessible from LAN on one of the following addresses:')}<br/>{info.local_ip}</p>
                    )}
                    {info.public_url && <p>{t('This server is also accessible from the open internet at:')}<br/>{info.public_url}</p>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('Resource Usage')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div>
                        <p>CPU: {info.resource_usage.cpu.toFixed(2)}%</p>
                        <Progress value={info.resource_usage.cpu} />
                    </div>
                    <div>
                        <p>RAM: {(info.resource_usage.ram_used / 1e9).toFixed(2)} GB / {(info.resource_usage.ram_total / 1e9).toFixed(2)} GB</p>
                        <Progress value={(info.resource_usage.ram_used / info.resource_usage.ram_total) * 100} />
                    </div>
                    <div>
                        <p>VRAM: {(info.resource_usage.vram_used / 1e9).toFixed(2)} GB / {(info.resource_usage.vram_total / 1e9).toFixed(2)} GB</p>
                        <Progress value={(info.resource_usage.vram_used / info.resource_usage.vram_total) * 100} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('Connected Users')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {info.connected_users.length > 0 ? (
                        <ul>{info.connected_users.map(user => <li key={user}>{user}</li>)}</ul>
                    ) : (
                        <p>{t('No users connected.')}</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('Update')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <p>{updateStatus}</p>
                    <Button onClick={handleCheckForUpdates}>{t('Check For Updates')}</Button>
                    <Button onClick={restart}>{t('Update and Restart Server')}</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('Shutdown')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <p>{t('If you want to shut down the server, click the button below.')}</p>
                    <Button onClick={shutdown} variant="destructive">{t('Shutdown Server')}</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('Free Memory')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={shutdown} className="w-full">{t('Shutdown')}</Button>
                    <Button onClick={restart} variant="destructive" className="flex-grow">{t('Restart')}</Button>
                    <Button onClick={clearVRAM} className="flex-grow">{t('Free VRAM')}</Button>
                    <Button onClick={clearSysRAM} className="flex-grow">{t('Free System RAM')}</Button>
                </CardContent>
            </Card>
        </div>
    );
};