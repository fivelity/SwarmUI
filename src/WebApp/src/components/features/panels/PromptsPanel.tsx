import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface PromptsPanelProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
}

export const PromptsPanel: React.FC<PromptsPanelProps> = ({ prompt, setPrompt, negativePrompt, setNegativePrompt }) => {
    const { t } = useTranslation();
    return (
  <div className="grid grid-cols-1 gap-4">
    <div className="grid w-full gap-1.5">
      <Label htmlFor="prompt">{t('Prompt')}</Label>
      <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t('A beautiful landscape...')} rows={8} />
    </div>
    <div className="grid w-full gap-1.5">
      <Label htmlFor="negative-prompt">{t('Negative Prompt')}</Label>
      <Textarea id="negative-prompt" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder={t('Deformed, ugly, bad art...')} rows={4} />
    </div>
  </div>
    );
};
