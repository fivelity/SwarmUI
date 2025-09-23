import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RichTextpad } from './RichTextpad';

export const RichNotepad = () => {
    const { t } = useTranslation();
    const [content, setContent] = useState(() => localStorage.getItem('rich_notepad_content') || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('rich_notepad_content', content);
        }, 1000);
        return () => clearTimeout(handler);
    }, [content]);

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">{t('Notepad')}</h3>
            <p className="text-sm text-muted-foreground">{t('This is a rich text notepad. Your content is saved automatically.')}</p>
            <RichTextpad
                content={content}
                onChange={setContent}
                placeholder={t('Type your notes here...')}
            />
        </div>
    );
};
