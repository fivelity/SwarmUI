import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { listWildcards, saveWildcard } from '@/services/api';

export const WildcardManagerPanel = () => {
    const { t } = useTranslation();
    const [wildcards, setWildcards] = useState<Record<string, string[]>>({});
    const [editedContent, setEditedContent] = useState<Record<string, string>>({});

    const fetchWildcards = async () => {
        const wildcardData = await listWildcards();
        setWildcards(wildcardData);
        const initialContent = Object.fromEntries(
            Object.entries(wildcardData).map(([key, value]) => [key, (value as string[]).join('\n')])
        );
        setEditedContent(initialContent);
    };

    useEffect(() => {
        fetchWildcards();
    }, []);

    const handleContentChange = (wildcardName: string, content: string) => {
        setEditedContent(prev => ({ ...prev, [wildcardName]: content }));
    };

    const handleSave = async (wildcardName: string) => {
        const content = editedContent[wildcardName];
        if (content !== undefined) {
            await saveWildcard(wildcardName, content);
            // Optionally, show a success message
        }
    };

    return (
        <Accordion type="multiple" className="w-full">
            {Object.entries(wildcards).map(([name, _]) => (
                <AccordionItem key={name} value={name}>
                    <AccordionTrigger>{name}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        <Textarea
                            value={editedContent[name] || ''}
                            onChange={(e) => handleContentChange(name, e.target.value)}
                            className="min-h-[200px] font-mono text-sm"
                        />
                        <Button onClick={() => handleSave(name)} className="self-end">{t('Save')}</Button>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
