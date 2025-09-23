import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from '@/components/ui/combobox';
import { listPresets, savePreset } from '@/services/api';
import { GenerationParams } from '@/types';

interface PresetsPanelProps {
    params: GenerationParams;
    setParams: (params: GenerationParams) => void;
}

export const PresetsPanel = ({ params, setParams }: PresetsPanelProps) => {
    const { t } = useTranslation();
    const [presets, setPresets] = useState<{ name: string; params: GenerationParams }[]>([]);
    const [newPresetName, setNewPresetName] = useState('');
    const [isSaveOpen, setIsSaveOpen] = useState(false);

    const fetchPresets = async () => {
        const presetList = await listPresets();
        setPresets(presetList);
    };

    useEffect(() => {
        fetchPresets();
    }, []);

    const handleSavePreset = async () => {
        if (newPresetName) {
            await savePreset(newPresetName, params);
            setNewPresetName('');
            setIsSaveOpen(false);
            fetchPresets(); // Refresh the list
        }
    };

    const handleLoadPreset = (presetName: string) => {
        const selectedPreset = presets.find(p => p.name === presetName);
        if (selectedPreset) {
            setParams(selectedPreset.params);
        }
    };

    const presetOptions = presets.map(p => ({ value: p.name, label: p.name }));

    return (
        <div className="flex items-center gap-2 p-2 rounded-md bg-card border">
            <Combobox data={presetOptions} type={t('Preset')} onValueChange={handleLoadPreset}>
                <ComboboxTrigger className="flex-grow"><span>{params.preset || t('Load Preset')}</span></ComboboxTrigger>
                <ComboboxContent>
                    <ComboboxInput />
                    <ComboboxList>
                        <ComboboxEmpty />
                        <ComboboxGroup>
                            {presetOptions.map(option => (
                                <ComboboxItem key={option.value} value={option.value}>
                                    {option.label}
                                </ComboboxItem>
                            ))}
                        </ComboboxGroup>
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">{t('Save Preset')}</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Save Current Parameters as Preset')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="preset-name" className="text-right">{t('Preset Name')}</Label>
                            <Input
                                id="preset-name"
                                value={newPresetName}
                                onChange={(e) => setNewPresetName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSavePreset}>{t('Save')}</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};
