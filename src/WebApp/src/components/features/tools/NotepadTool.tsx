import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';

export const NotepadTool = () => {
    const { t } = useTranslation();
    const [text, setText] = useState(() => localStorage.getItem('notepad_tool') || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('notepad_tool', text);
        }, 1000);
        return () => clearTimeout(handler);
    }, [text]);

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">{t('Text Notepad')}</h3>
            <p className="text-sm text-muted-foreground">{t('This is an open text box where you can type any notes you need to keep track of. They will be temporarily persisted in browser session.')}</p>
            <Textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-64" placeholder={t('Type any notes here...')} />
        </div>
    );
};
