import { useEffect, useState } from 'react';
import { Button } from '../core/Button';

// This would be expanded to call the real APIs
const api = {
    listBackends: async () => fetch('/API/Backend/ListBackends').then(res => res.json()),
    toggleBackend: async (id, enabled) => fetch(`/API/Backend/ToggleBackend?backend_id=${id}&enabled=${enabled}`),
    restartAll: async () => fetch('/API/Backend/RestartBackends'),
};

const statusClass = (status) => {
    switch (status) {
        case 'running': return 'bg-success';
        case 'errored': return 'bg-danger';
        case 'disabled': return 'bg-secondary';
        default: return 'bg-warning';
    }
}

export const BackendsPanel = () => {
    const [backends, setBackends] = useState({});

    const refresh = () => {
        api.listBackends().then(setBackends);
    };

    useEffect(refresh, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button onClick={api.restartAll}>Restart All Backends</Button>
                {/* TODO: Add New Backend functionality */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(backends).map(backend => (
                    <div key={backend.id} className="border border-border rounded-lg p-4 flex flex-col gap-2 bg-secondary">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-accent">{backend.title}</h3>
                            <div className={`px-2 py-1 text-xs rounded-full ${statusClass(backend.status)}`}>{backend.status.toUpperCase()}</div>
                        </div>
                        <p className="text-sm">Type: {backend.type}</p>
                        <div className="flex-grow"></div>
                        <div className="flex gap-2 mt-2">
                            <Button onClick={() => api.toggleBackend(backend.id, !backend.enabled).then(refresh)}>{backend.enabled ? 'Disable' : 'Enable'}</Button>
                            {/* TODO: Edit, Delete */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
