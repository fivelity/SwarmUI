import { useState, useEffect } from 'react';
import { generate, listWildcards } from '../../services/api';
import MainLayout from '../layout/MainLayout';
import { ParametersPanel } from './panels/ParametersPanel';
import { PromptsPanel } from './panels/PromptsPanel';
import { GenerateButtonPanel } from './panels/GenerateButtonPanel';
import { GalleryPanel } from './panels/GalleryPanel';
import { PresetsPanel } from './panels/PresetsPanel';
import { GenerationParams } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageEditor } from '@/components/core/ImageEditor';

export const GenerateTab = () => {
  // Consolidated state for all parameters
  const [params, setParams] = useState<GenerationParams>({ prompt: '', negativeprompt: '' });

  // UI State
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [wildcards, setWildcards] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchWildcards = async () => {
        const wildcardData = await listWildcards();
        setWildcards(wildcardData);
    };
    fetchWildcards();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);

    let processedPrompt = params.prompt;
    const wildcardRegex = /__([a-zA-Z0-9_-]+)__/g;
    let match;
    while ((match = wildcardRegex.exec(params.prompt)) !== null) {
        const wildcardName = match[1];
        if (wildcards[wildcardName] && wildcards[wildcardName].length > 0) {
            const options = wildcards[wildcardName];
            const randomChoice = options[Math.floor(Math.random() * options.length)];
            processedPrompt = processedPrompt.replace(match[0], randomChoice);
        }
    }

    // TODO: The API expects snake_case keys, but our params are camelCase from the C# property names.
    // A conversion step is needed here before sending.
    const finalParams = { ...params, prompt: processedPrompt };

    const resultImages = await generate(finalParams);
    if (resultImages) setImages(prev => [...resultImages, ...prev]);
    setLoading(false);
  };

  return (
    <MainLayout>
      <div style={{ gridArea: 'prompts' }}><PromptsPanel prompt={params.prompt} negativePrompt={params.negativeprompt} setPrompt={(v) => setParams(p => ({...p, prompt: v}))} setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} /></div>
      <div style={{ gridArea: 'params' }}><ParametersPanel params={params} setParams={setParams} /></div>
      <div style={{ gridArea: 'generate' }}><GenerateButtonPanel {...{ handleGenerate, loading }} /></div>
      <div style={{ gridArea: 'gallery' }}><GalleryPanel images={images} /></div>
            <div style={{ gridArea: 'tools' }} className="flex flex-col gap-2">
                <PresetsPanel params={params} setParams={setParams} />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Open Image Editor</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <ImageEditor />
                    </DialogContent>
                </Dialog>
            </div>
    </MainLayout>
  );
};
