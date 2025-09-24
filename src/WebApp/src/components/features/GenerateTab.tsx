import { useState, useEffect } from 'react';
import { generate, listWildcards } from '../../services/api';
import { camelToSnake } from '@/lib/utils';
import { ThreeColumnLayout, TwoColumnLayout, VerticalLayout } from '../layout/ModernLayout';
import { ParametersPanel } from './panels/ParametersPanel';
import { PromptsPanel } from './panels/PromptsPanel';
import { GenerateButtonPanel } from './panels/GenerateButtonPanel';
import { GalleryPanel } from './panels/GalleryPanel';
import { PresetsPanel } from './panels/PresetsPanel';
import { GenerationParams } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageEditor } from '@/components/core/ImageEditor';

interface GenerateTabProps {
  activeSubTab?: string;
}

export const GenerateTab = ({ activeSubTab }: GenerateTabProps) => {
  // Consolidated state for all parameters
  const [params, setParams] = useState<GenerationParams>({ prompt: '', negativeprompt: '' });

  // UI State
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Array<{
    id: string;
    url: string;
    thumbnail?: string;
    filename?: string;
    metadata?: Record<string, any>;
  }>>([]);
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

    const finalParams = { ...params, prompt: processedPrompt };
    const snakeParams = camelToSnake(finalParams);

    const resultImages = await generate(snakeParams);
    if (resultImages) {
      const imageObjects = resultImages.map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        url,
        thumbnail: url,
        filename: `generated-${Date.now()}-${index}.png`,
        metadata: { ...snakeParams }
      }));
      setImages(prev => [...imageObjects, ...prev]);
    }
    setLoading(false);
  };

  const renderBasicMode = () => (
    <ThreeColumnLayout>
      <div className="space-y-4">
        <PromptsPanel 
          prompt={params.prompt} 
          negativePrompt={params.negativeprompt} 
          setPrompt={(v) => setParams(p => ({...p, prompt: v}))} 
          setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} 
        />
        <GenerateButtonPanel {...{ handleGenerate, loading }} />
      </div>
      <div>
        <ParametersPanel params={params} setParams={setParams} />
      </div>
      <div className="space-y-4">
        <PresetsPanel params={params} setParams={setParams} />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Open Image Editor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <ImageEditor />
          </DialogContent>
        </Dialog>
        <GalleryPanel images={images} />
      </div>
    </ThreeColumnLayout>
  );

  const renderAdvancedMode = () => (
    <TwoColumnLayout>
      <div className="space-y-4">
        <PromptsPanel 
          prompt={params.prompt} 
          negativePrompt={params.negativeprompt} 
          setPrompt={(v) => setParams(p => ({...p, prompt: v}))} 
          setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} 
        />
        <ParametersPanel params={params} setParams={setParams} />
        <GenerateButtonPanel {...{ handleGenerate, loading }} />
      </div>
      <div className="space-y-4">
        <PresetsPanel params={params} setParams={setParams} />
        <GalleryPanel images={images} />
      </div>
    </TwoColumnLayout>
  );

  const renderBatchMode = () => (
    <VerticalLayout>
      <div className="space-y-4">
        <PromptsPanel 
          prompt={params.prompt} 
          negativePrompt={params.negativeprompt} 
          setPrompt={(v) => setParams(p => ({...p, prompt: v}))} 
          setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} 
        />
        <div className="text-sm text-muted-foreground">
          Batch generation mode - Generate multiple variations with different seeds
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ParametersPanel params={params} setParams={setParams} />
        <div className="space-y-4">
          <PresetsPanel params={params} setParams={setParams} />
          <GenerateButtonPanel {...{ handleGenerate, loading }} />
        </div>
      </div>
      <div>
        <GalleryPanel images={images} />
      </div>
    </VerticalLayout>
  );

  const renderContent = () => {
    switch (activeSubTab) {
      case 'advanced':
        return renderAdvancedMode();
      case 'batch':
        return renderBatchMode();
      default:
        return renderBasicMode();
    }
  };

  return renderContent();
};
