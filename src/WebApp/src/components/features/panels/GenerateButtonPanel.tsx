import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface GenerateButtonPanelProps {
  handleGenerate: () => void;
  loading: boolean;
}

export const GenerateButtonPanel: React.FC<GenerateButtonPanelProps> = ({ handleGenerate, loading }) => {
    const { t } = useTranslation();
    return (
        <div className="flex justify-center">
            <Button onClick={handleGenerate} disabled={loading} className="w-full h-full text-2xl">{loading ? t('Generating...') : t('Generate')}</Button>
        </div>
    );
};
