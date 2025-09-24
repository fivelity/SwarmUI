import React, { useState, useEffect } from 'react';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Model {
  name: string;
  title: string;
  author: string;
  description: string;
  preview: string;
  usage_hint: string;
  trigger_phrase: string;
  merged_from: string;
  tags: string[];
  is_supported_model_format: boolean;
  is_negative_embedding: boolean;
  local: boolean;
}

interface ModelSelectionPanelProps {
  selectedModel?: string;
  selectedLoRAs?: string[];
  selectedVAE?: string;
  selectedEmbeddings?: string[];
  onModelChange: (model: string) => void;
  onLoRAChange: (loras: string[]) => void;
  onVAEChange: (vae: string) => void;
  onEmbeddingChange: (embeddings: string[]) => void;
}

export const ModelSelectionPanel: React.FC<ModelSelectionPanelProps> = ({
  selectedModel,
  selectedLoRAs = [],
  selectedVAE,
  selectedEmbeddings = [],
  onModelChange,
  onLoRAChange,
  onVAEChange,
  onEmbeddingChange
}) => {
  const [models, setModels] = useState<Record<string, Model[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('models');

  const modelTypes = [
    { id: 'Stable-Diffusion', label: 'Models', icon: '🎨' },
    { id: 'LoRA', label: 'LoRAs', icon: '⚡' },
    { id: 'VAE', label: 'VAEs', icon: '🔧' },
    { id: 'Embedding', label: 'Embeddings', icon: '📝' }
  ];

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      const modelData: Record<string, Model[]> = {};
      
      for (const type of modelTypes) {
        try {
          const sessionId = localStorage.getItem('session_id');
          if (!sessionId) {
            console.warn(`No session ID available for ${type.label}`);
            continue;
          }
          
          const response = await fetch(`/API/ListModels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              path: '',
              depth: 3,
              subtype: type.id,
              sortBy: 'Name',
              allowRemote: true,
              sortReverse: false
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            modelData[type.id] = data.models || [];
          }
        } catch (error) {
          console.error(`Failed to fetch ${type.label}:`, error);
          modelData[type.id] = [];
        }
      }
      
      setModels(modelData);
      setLoading(false);
    };

    fetchModels();
  }, []);

  const filteredModels = (type: string) => {
    const typeModels = models[type] || [];
    if (!searchTerm) return typeModels;
    return typeModels.filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleModelSelect = (type: string, modelName: string) => {
    switch (type) {
      case 'Stable-Diffusion':
        onModelChange(modelName);
        break;
      case 'LoRA':
        const newLoRAs = selectedLoRAs.includes(modelName)
          ? selectedLoRAs.filter(l => l !== modelName)
          : [...selectedLoRAs, modelName];
        onLoRAChange(newLoRAs);
        break;
      case 'VAE':
        onVAEChange(selectedVAE === modelName ? '' : modelName);
        break;
      case 'Embedding':
        const newEmbeddings = selectedEmbeddings.includes(modelName)
          ? selectedEmbeddings.filter(e => e !== modelName)
          : [...selectedEmbeddings, modelName];
        onEmbeddingChange(newEmbeddings);
        break;
    }
  };

  const isSelected = (type: string, modelName: string) => {
    switch (type) {
      case 'Stable-Diffusion':
        return selectedModel === modelName;
      case 'LoRA':
        return selectedLoRAs.includes(modelName);
      case 'VAE':
        return selectedVAE === modelName;
      case 'Embedding':
        return selectedEmbeddings.includes(modelName);
      default:
        return false;
    }
  };

  const ModelCard: React.FC<{ model: Model; type: string }> = ({ model, type }) => (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected(type, model.name) && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={() => handleModelSelect(type, model.name)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium truncate">{model.title || model.name}</CardTitle>
          {isSelected(type, model.name) && (
            <Badge variant="default" className="ml-2">Selected</Badge>
          )}
        </div>
        {model.author && (
          <p className="text-xs text-muted-foreground">by {model.author}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {model.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{model.description}</p>
        )}
        {model.trigger_phrase && (
          <Badge variant="secondary" className="text-xs mb-2">
            Trigger: {model.trigger_phrase}
          </Badge>
        )}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {model.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
            {model.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">+{model.tags.length - 3}</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <ParameterGroup title="Model Selection">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading models...</span>
        </div>
      </ParameterGroup>
    );
  }

  return (
    <ParameterGroup title="Model Selection">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Model Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {modelTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs">
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {modelTypes.map(type => (
            <TabsContent key={type.id} value={type.id} className="mt-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredModels(type.id).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {type.label.toLowerCase()} found
                  </div>
                ) : (
                  filteredModels(type.id).map(model => (
                    <ModelCard key={model.name} model={model} type={type.id} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Selected Summary */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Current Selection:</h4>
          <div className="space-y-1 text-xs">
            <div>Model: {selectedModel || 'None'}</div>
            <div>LoRAs: {selectedLoRAs.length > 0 ? selectedLoRAs.join(', ') : 'None'}</div>
            <div>VAE: {selectedVAE || 'None'}</div>
            <div>Embeddings: {selectedEmbeddings.length > 0 ? selectedEmbeddings.join(', ') : 'None'}</div>
          </div>
        </div>
      </div>
    </ParameterGroup>
  );
};
