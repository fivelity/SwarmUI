import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox';
import { RichNotepad } from '@/components/features/tools/RichNotepad';

export const Tools = () => {
    const { t } = useTranslation();
    const [selectedTool, setSelectedTool] = useState('');

    const tools = [
        { value: 'notepad', label: t('Notepad') },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Combobox data={tools} type="tool" value={selectedTool} onValueChange={setSelectedTool}>
                <ComboboxTrigger />
                <ComboboxContent>
                    <ComboboxInput />
                    <ComboboxList>
                        {tools.map(tool => <ComboboxItem key={tool.value} value={tool.value}>{tool.label}</ComboboxItem>)}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            {selectedTool === 'notepad' && <RichNotepad />}
        </div>
    );
};
