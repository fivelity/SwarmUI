import { useEffect, useState } from 'react';
import { Button } from '../core/Button';

const api = {
    listSettings: async () => fetch('/API/Admin/ListServerSettings').then(res => res.json()),
    saveSettings: async (settings) => fetch('/API/Admin/SaveServerSettings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }),
};

const SettingInput = ({ def, value, onChange }) => {
    const commonProps = { value: value ?? '', onChange: e => onChange(e.target.value) };
    if (def.options) {
        return <select {...commonProps} className="bg-secondary border border-border rounded px-2 py-1 w-full">{def.options.map(o => <option key={o} value={o}>{o}</option>)}</select>;
    }
    switch (def.type) {
        case 'Boolean': return <input type="checkbox" checked={commonProps.value} onChange={e => onChange(e.target.checked)} />;
        case 'Int32':
        case 'Int64':
        case 'Single':
        case 'Double': return <input type="number" {...commonProps} className="bg-secondary border border-border rounded px-2 py-1 w-full" />;
        default: return <input type="text" {...commonProps} className="bg-secondary border border-border rounded px-2 py-1 w-full" />;
    }
};

const SettingsGroup = ({ name, group, values, onValueChange }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-border rounded-lg">
            <h3 className="text-lg font-bold p-2 bg-secondary rounded-t-lg cursor-pointer" onClick={() => setIsOpen(!isOpen)}>{name.replace(/([A-Z])/g, ' $1').trim()}</h3>
            {isOpen && <div className="p-4 flex flex-col gap-4">
                {Object.entries(group).map(([key, def]) => (
                    <div key={key}>
                        {def.value !== undefined ? (
                            <div>
                                <label className="font-semibold" title={def.comment}>{def.name}</label>
                                <SettingInput def={def} value={values[key]} onChange={(v) => onValueChange(key, v)} />
                                <p className="text-sm text-text/70" dangerouslySetInnerHTML={{ __html: def.comment }}></p>
                            </div>
                        ) : (
                            <SettingsGroup name={key} group={def} values={values[key]} onValueChange={(subKey, v) => onValueChange(key, { ...values[key], [subKey]: v })} />
                        )}
                    </div>
                ))}
            </div>}
        </div>
    );
};

export const ServerConfigurationPanel = () => {
    const [settings, setSettings] = useState(null);
    const [edited, setEdited] = useState(null);

    useEffect(() => {
        api.listSettings().then(data => {
            setSettings(data);
            setEdited(data);
        });
    }, []);

    const handleSave = () => {
        api.saveSettings(edited).then(() => {
            setSettings(edited);
        });
    };

    if (!settings) {
        return <div>Loading server settings...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={handleSave}>Save Settings</Button>
            </div>
            {Object.entries(settings).map(([key, group]) => (
                <SettingsGroup key={key} name={key} group={group} values={edited[key]} onValueChange={(subKey, v) => setEdited(e => ({ ...e, [key]: { ...e[key], [subKey]: v } }))} />
            ))}
        </div>
    );
};
