import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getServerInfo, checkForUpdates } from '@/services/api';

const api = {
    shutdown: async () => fetch('/API/Admin/Shutdown').then(res => res.json()),
    restart: async () => fetch('/API/Admin/Restart').then(res => res.json()),
    clearVRAM: async () => fetch('/API/Admin/ClearVRAM').then(res => res.json()),
    clearSysRAM: async () => fetch('/API/Admin/ClearSysRAM').then(res => res.json()),
};

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
        const [info, setInfo] = useState<ServerInfo | null>(null);
    const [updateStatus, setUpdateStatus] = useState('Checking...');

    const fetchInfo = async () => {
        const data = await getServerInfo();
        setInfo(data);
    };

    const handleCheckForUpdates = async () => {
        setUpdateStatus('Checking for updates...');
        try {
            const result = await checkForUpdates();
            setUpdateStatus(result.message || result.status);
        } catch (error: any) {
            setUpdateStatus(`Error checking for updates: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchInfo();
        handleCheckForUpdates(); // Initial check
        const interval = setInterval(fetchInfo, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (!info) {
        return <div>Loading server info...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Local Network</CardTitle>
                </CardHeader>
                <CardContent>
                    {info.host === '127.0.0.1' || info.host === 'localhost' ? (
                        <p>This server is only accessible from this computer.</p>
                    ) : (
                        <p>This server is likely accessible from LAN on one of the following addresses:<br/>{info.local_ip}</p>
                    )}
                    {info.public_url && <p>This server is also accessible from the open internet at:<br/>{info.public_url}</p>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Resource Usage</CardTitle>
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
                    <CardTitle>Connected Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {info.connected_users.length > 0 ? (
                        <ul>{info.connected_users.map(user => <li key={user}>{user}</li>)}</ul>
                    ) : (
                        <p>No users connected.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Update</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <p>{updateStatus}</p>
                    <Button onClick={handleCheckForUpdates}>Check For Updates</Button>
                    <Button onClick={() => api.restart()}>Update and Restart Server</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Shutdown</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <p>If you want to shut down the server, click the button below.</p>
                    <Button onClick={() => api.shutdown()} variant="destructive">Shutdown Server</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Free Memory</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <p>You can free up VRAM or system memory usage from backends.</p>
                    <Button onClick={() => api.clearVRAM()}>Free VRAM</Button>
                    <Button onClick={() => api.clearSysRAM()}>Free System RAM</Button>
                </CardContent>
            </Card>
        </div>
    );
};