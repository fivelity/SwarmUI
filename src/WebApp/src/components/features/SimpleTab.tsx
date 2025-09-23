import { useState } from 'react';
import { Button } from '../core/Button';
import { ParameterGroup } from '../layout/ParameterGroup';
import { generate } from '../../services/api';
import { ImageGallery } from './ImageGallery';

export const SimpleTab = () => {
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
      <h2 className="text-2xl font-bold text-center">Simple Mode</h2>
      <p className="text-center text-text/70">Just type a prompt and go!</p>
      <textarea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} className="bg-secondary border border-border rounded px-2 py-1 w-full" placeholder="A beautiful landscape painting..." />
      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </div>
      <ImageGallery images={images} />
    </div>
  );
};