import { useState, useEffect } from 'react';
import { generate } from '../../services/api';
import MainLayout from '../layout/MainLayout';
import { ParametersPanel } from './panels/ParametersPanel';
import { PromptsPanel } from './panels/PromptsPanel';
import { GenerateButtonPanel } from './panels/GenerateButtonPanel';
import { GalleryPanel } from './panels/GalleryPanel';

export const GenerateTab = () => {
  // Consolidated state for all parameters
  const [params, setParams] = useState({});

  // UI State
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    // TODO: The API expects snake_case keys, but our params are camelCase from the C# property names.
    // A conversion step is needed here before sending.
    const resultImages = await generate(params);
    if (resultImages) setImages(prev => [...resultImages, ...prev]);
    setLoading(false);
  };

  return (
    <MainLayout>
      <div style={{ gridArea: 'prompts' }}><PromptsPanel prompt={params.prompt} negativePrompt={params.negativeprompt} setPrompt={(v) => setParams(p => ({...p, prompt: v}))} setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} /></div>
      <div style={{ gridArea: 'params' }}><ParametersPanel params={params} setParams={setParams} /></div>
      <div style={{ gridArea: 'generate' }}><GenerateButtonPanel {...{ handleGenerate, loading }} /></div>
      <div style={{ gridArea: 'gallery' }}><GalleryPanel images={images} /></div>
    </MainLayout>
  );
};
