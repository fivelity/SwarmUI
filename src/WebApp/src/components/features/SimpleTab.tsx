import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generate } from '@/services/api';
import { ImageGallery } from './ImageGallery';

export const SimpleTab = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    const params = { prompt, negative_prompt: '', steps: 20, cfg_scale: 7, sampler: 'euler', width: 512, height: 512, seed: -1, model: '' }; // Simplified defaults
    const resultImages = await generate(params);
    if (resultImages) {
      setImages(prev => [...resultImages, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">{t('Simple Mode')}</h2>
      <p className="text-center text-text/70">{t('Just type a prompt and go!')}</p>
      <Textarea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('A beautiful landscape painting...')} />
      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? t('Generating...') : t('Generate')}
        </Button>
      </div>
      <ImageGallery images={images} />
    </div>
  );
};