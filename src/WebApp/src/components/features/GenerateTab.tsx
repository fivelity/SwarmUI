import { useState, useEffect } from 'react';
import { generate, listWildcards } from '../../services/api';
import { camelToSnake } from '@/lib/utils';
import { ThreeColumnLayout, TwoColumnLayout, VerticalLayout } from '../layout/ModernLayout';
import { ParametersPanel } from './panels/ParametersPanel';
import { PromptsPanel } from './panels/PromptsPanel';
import { GenerateButtonPanel } from './panels/GenerateButtonPanel';
import { GalleryPanel } from './panels/GalleryPanel';
import { PresetsPanel } from './panels/PresetsPanel';
import { ModelSelectionPanel } from './panels/ModelSelectionPanel';
import { GenerationParams } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageEditor } from '@/components/core/ImageEditor';

interface GenerateTabProps {
  activeSubTab?: string;
}

export const GenerateTab = ({ activeSubTab }: GenerateTabProps) => {
  // Consolidated state for all parameters
  const [params, setParams] = useState<GenerationParams>({ 
    prompt: '', 
    negativeprompt: '',
    model: '',
    loras: [],
    vae: '',
    embeddings: []
  });

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
      {/* Left Panel: Prompts & Models */}
      <div className="space-y-4 h-full overflow-y-auto">
        <PromptsPanel 
          prompt={params.prompt} 
          negativePrompt={params.negativeprompt} 
          setPrompt={(v) => setParams(p => ({...p, prompt: v}))} 
          setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} 
        />
        <ModelSelectionPanel
          selectedModel={params.model}
          selectedLoRAs={params.loras}
          selectedVAE={params.vae}
          selectedEmbeddings={params.embeddings}
          onModelChange={(model) => setParams(p => ({...p, model}))}
          onLoRAChange={(loras) => setParams(p => ({...p, loras}))}
          onVAEChange={(vae) => setParams(p => ({...p, vae}))}
          onEmbeddingChange={(embeddings) => setParams(p => ({...p, embeddings}))}
        />
        <GenerateButtonPanel {...{ handleGenerate, loading }} />
      </div>
      
      {/* Center Panel: Parameters */}
      <div className="h-full overflow-y-auto">
        <ParametersPanel params={params} setParams={setParams} />
      </div>
      
      {/* Right Panel: Gallery & Tools */}
      <div className="space-y-4 h-full overflow-y-auto">
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
      {/* Left Panel: All Controls */}
      <div className="space-y-4 h-full overflow-y-auto">
        <PromptsPanel 
          prompt={params.prompt} 
          negativePrompt={params.negativeprompt} 
          setPrompt={(v) => setParams(p => ({...p, prompt: v}))} 
          setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} 
        />
        <ModelSelectionPanel
          selectedModel={params.model}
          selectedLoRAs={params.loras}
          selectedVAE={params.vae}
          selectedEmbeddings={params.embeddings}
          onModelChange={(model) => setParams(p => ({...p, model}))}
          onLoRAChange={(loras) => setParams(p => ({...p, loras}))}
          onVAEChange={(vae) => setParams(p => ({...p, vae}))}
          onEmbeddingChange={(embeddings) => setParams(p => ({...p, embeddings}))}
        />
        <ParametersPanel params={params} setParams={setParams} />
        <PresetsPanel params={params} setParams={setParams} />
        <GenerateButtonPanel {...{ handleGenerate, loading }} />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Open Image Editor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <ImageEditor />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Right Panel: Gallery */}
      <div className="h-full overflow-y-auto">
        <GalleryPanel images={images} />
      </div>
    </TwoColumnLayout>
  );

  const renderBatchMode = () => (
    <VerticalLayout>
      {/* Top Panel: Prompts & Models */}
      <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto">
        <div className="space-y-4">
          <PromptsPanel 
            prompt={params.prompt} 
            negativePrompt={params.negativeprompt} 
            setPrompt={(v) => setParams(p => ({...p, prompt: v}))} 
            setNegativePrompt={(v) => setParams(p => ({...p, negativeprompt: v}))} 
          />
          <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
            <strong>Batch Mode:</strong> Generate multiple variations with different seeds and parameters. 
            Use wildcards in prompts for automatic variation.
          </div>
        </div>
        <ModelSelectionPanel
          selectedModel={params.model}
          selectedLoRAs={params.loras}
          selectedVAE={params.vae}
          selectedEmbeddings={params.embeddings}
          onModelChange={(model) => setParams(p => ({...p, model}))}
          onLoRAChange={(loras) => setParams(p => ({...p, loras}))}
          onVAEChange={(vae) => setParams(p => ({...p, vae}))}
          onEmbeddingChange={(embeddings) => setParams(p => ({...p, embeddings}))}
        />
      </div>
      
      {/* Middle Panel: Parameters & Controls */}
      <div className="grid grid-cols-3 gap-4 h-full overflow-y-auto">
        <ParametersPanel params={params} setParams={setParams} />
        <PresetsPanel params={params} setParams={setParams} />
        <div className="space-y-4">
          <GenerateButtonPanel {...{ handleGenerate, loading }} />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Open Image Editor</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <ImageEditor />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Bottom Panel: Gallery */}
      <div className="h-full overflow-y-auto">
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
