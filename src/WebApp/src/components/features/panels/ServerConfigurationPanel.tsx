import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';

const api = {
    listSettings: async () => fetch('/API/Admin/ListServerSettings').then(res => res.json()),
    saveSettings: async (settings: any) => fetch('/API/Admin/SaveServerSettings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }),
};

interface SettingDef {
    name: string;
    comment: string;
    type: 'Boolean' | 'Int32' | 'Int64' | 'Single' | 'Double' | 'String';
    value?: any;
    options?: string[];
}

interface SettingsGroupData {
    [key: string]: SettingDef | SettingsGroupData;
}

const SettingInput = ({ def, value, onChange }: { def: SettingDef, value: any, onChange: (value: any) => void }) => {
    if (def.options) {
        return (
            <Select value={value ?? ''} onValueChange={onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{def.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
        );
    }
    switch (def.type) {
        case 'Boolean': return <Checkbox checked={value} onCheckedChange={onChange} />;
        case 'Int32':
        case 'Int64':
        case 'Single':
        case 'Double': return <Input type="number" value={value ?? ''} onChange={e => onChange(e.target.value)} />;
        default: return <Input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} />;
    }
};

const SettingsGroup = ({ name, group, values, onValueChange }: { name: string, group: SettingsGroupData, values: any, onValueChange: (key: string, value: any) => void }) => {
    return (
        <Accordion type="single" collapsible defaultValue={name}>
            <AccordionItem value={name}>
                <AccordionTrigger>{name.replace(/([A-Z])/g, ' $1').trim()}</AccordionTrigger>
                <AccordionContent className="p-4 flex flex-col gap-4">
                    {Object.entries(group).map(([key, def]) => (
                        <div key={key}>
                            {'value' in def ? (
                                <div className="grid gap-1.5">
                                    <Label htmlFor={key} title={def.comment as string}>{def.name as string}</Label>
                                    <SettingInput def={def as SettingDef} value={values[key]} onChange={(v) => onValueChange(key, v)} />
                                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: def.comment as string }}></p>
                                </div>
                            ) : (
                                <SettingsGroup name={key} group={def as SettingsGroupData} values={values[key]} onValueChange={(subKey, v) => onValueChange(key, { ...values[key], [subKey]: v })} />
                            )}
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export const ServerConfigurationPanel = () => {
    const [settings, setSettings] = useState<SettingsGroupData | null>(null);
    const [edited, setEdited] = useState<any>(null);

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
                <SettingsGroup key={key} name={key} group={group as SettingsGroupData} values={edited[key]} onValueChange={(subKey, v) => setEdited((e: any) => ({ ...e, [key]: { ...e[key], [subKey]: v } }))} />
            ))}
        </div>
    );
};
