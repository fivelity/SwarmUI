import { useEffect, useState } from 'react';
import { Button } from '../core/Button';
import { ParameterGroup } from '../layout/ParameterGroup';
import { getServerInfo, checkForUpdates } from '../../services/api';

const api = {
    shutdown: async () => fetch('/API/Admin/Shutdown').then(res => res.json()),
    restart: async () => fetch('/API/Admin/Restart').then(res => res.json()),
    clearVRAM: async () => fetch('/API/Admin/ClearVRAM').then(res => res.json()),
    clearSysRAM: async () => fetch('/API/Admin/ClearSysRAM').then(res => res.json()),
};

export const ServerInfoPanel = () => {
    const [info, setInfo] = useState(null);
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
        } catch (error) {
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
        <div className="flex flex-col gap-4">
            <ParameterGroup title="Server Info">
                <p>The "Server" tab provides access to SwarmUI's server internals.</p>
            </ParameterGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ParameterGroup title="Local Network">
                    {info.host === "127.0.0.1" || info.host === "localhost" ? (
                        <p>This server is only accessible from this computer.</p>
                    ) : (
                        <p>This server is likely accessible from LAN on one of the following addresses:<br/>{info.local_ip}</p>
                    )}
                    {info.public_url && <p>This server is also accessible from the open internet at:<br/>{info.public_url}</p>}
                </ParameterGroup>

                <ParameterGroup title="Resource Usage">
                    <p>CPU: {info.resource_usage.cpu}%</p>
                    <p>RAM: {(info.resource_usage.ram_used / (1024 * 1024 * 1024)).toFixed(2)} GB / {(info.resource_usage.ram_total / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
                    <p>VRAM: {(info.resource_usage.vram_used / (1024 * 1024 * 1024)).toFixed(2)} GB / {(info.resource_usage.vram_total / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
                </ParameterGroup>

                <ParameterGroup title="Connected Users">
                    {info.connected_users.length > 0 ? (
                        <ul>{info.connected_users.map(user => <li key={user}>{user}</li>)}</ul>
                    ) : (
                        <p>No users connected.</p>
                    )}
                </ParameterGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ParameterGroup title="Update">
                    <p>{updateStatus}</p>
                    <Button onClick={handleCheckForUpdates}>Check For Updates</Button>
                    <Button className="mt-2" onClick={() => api.restart()}>Update and Restart Server</Button>
                </ParameterGroup>

                <ParameterGroup title="Shutdown">
                    <p>If you want to shut down the server, click the button below.</p>
                    <Button onClick={() => api.shutdown()}>Shutdown Server</Button>
                </ParameterGroup>

                <ParameterGroup title="Free Memory">
                    <p>You can free up the VRAM usage, or system memory usage (cache) from backends with the two buttons below.</p>
                    <Button onClick={() => api.clearVRAM()}>Free VRAM</Button>
                    <Button onClick={() => api.clearSysRAM()}>Free System RAM</Button>
                </ParameterGroup>
            </div>
        </div>
    );
};