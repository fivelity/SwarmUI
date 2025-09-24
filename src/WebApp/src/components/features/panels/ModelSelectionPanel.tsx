import React, { useState, useEffect } from 'react';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, RefreshCw, Grid, List, Filter, X, Star, Download, Folder } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('Stable-Diffusion');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'author' | 'recent'>('name');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const modelTypes = [
    { 
      id: 'Stable-Diffusion', 
      label: 'Base Models', 
      icon: '🎨',
      description: 'Main Stable Diffusion models for image generation',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    { 
      id: 'LoRA', 
      label: 'LoRAs', 
      icon: '⚡',
      description: 'Low-Rank Adaptation models for style and concept training',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200'
    },
    { 
      id: 'VAE', 
      label: 'VAEs', 
      icon: '🔧',
      description: 'Variational Autoencoders for image encoding/decoding',
      color: 'bg-green-500/10 text-green-600 border-green-200'
    },
    { 
      id: 'Embedding', 
      label: 'Embeddings', 
      icon: '📝',
      description: 'Textual Inversions for specific concepts and styles',
      color: 'bg-orange-500/10 text-orange-600 border-orange-200'
    },
    { 
      id: 'ControlNet', 
      label: 'ControlNet', 
      icon: '🎯',
      description: 'Control models for guided image generation',
      color: 'bg-red-500/10 text-red-600 border-red-200'
    },
    { 
      id: 'Upscaler', 
      label: 'Upscalers', 
      icon: '📈',
      description: 'Models for image upscaling and enhancement',
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200'
    }
  ];

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
        
        const response = await fetch(`/API/ModelsAPI/ListModels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            path: '',
            depth: 5,
            subtype: type.id,
            sortBy: sortBy === 'name' ? 'Name' : sortBy === 'author' ? 'Author' : 'Modified',
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

  useEffect(() => {
    fetchModels();
  }, [sortBy]);

  const refreshModels = async () => {
    setRefreshing(true);
    await fetchModels();
    setRefreshing(false);
  };

  const filteredModels = (type: string) => {
    const typeModels = models[type] || [];
    let filtered = typeModels;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply tag filters
    if (filterTags.length > 0) {
      filtered = filtered.filter(model => 
        model.tags?.some(tag => filterTags.includes(tag))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return (a.author || '').localeCompare(b.author || '');
        case 'recent':
          // Assuming models have a modified date or we sort by name as fallback
          return b.name.localeCompare(a.name);
        default: // 'name'
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
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

  const ModelCard: React.FC<{ model: Model; type: string }> = ({ model, type }) => {
    const selected = isSelected(type, model.name);
    const isMultiSelect = type === 'LoRA' || type === 'Embedding';
    
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          selected && "ring-2 ring-primary bg-primary/5 shadow-md",
          viewMode === 'list' && "flex-row"
        )}
        onClick={() => handleModelSelect(type, model.name)}
      >
        <div className={cn(
          "flex",
          viewMode === 'grid' ? "flex-col" : "flex-row items-center gap-4 p-4"
        )}>
          {/* Model Preview/Icon */}
          {viewMode === 'grid' && (
            <div className="relative">
              {model.preview ? (
                <img 
                  src={model.preview} 
                  alt={model.title || model.name}
                  className="w-full h-24 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-24 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center">
                  <span className="text-2xl opacity-50">
                    {modelTypes.find(t => t.id === type)?.icon || '📄'}
                  </span>
                </div>
              )}
              {selected && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="text-xs">
                    {isMultiSelect ? '✓' : 'Active'}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn(
            viewMode === 'grid' ? "p-4 pt-3" : "flex-1 min-w-0"
          )}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium truncate",
                  viewMode === 'grid' ? "text-sm" : "text-base"
                )}>
                  {model.title || model.name}
                </h3>
                {model.author && (
                  <p className="text-xs text-muted-foreground truncate">
                    by {model.author}
                  </p>
                )}
              </div>
              {viewMode === 'list' && selected && (
                <Badge variant="default" className="ml-2 text-xs">
                  {isMultiSelect ? '✓' : 'Active'}
                </Badge>
              )}
            </div>

            {model.description && (
              <p className={cn(
                "text-muted-foreground mb-3",
                viewMode === 'grid' ? "text-xs line-clamp-2" : "text-sm line-clamp-1"
              )}>
                {model.description}
              </p>
            )}

            {/* Model Details */}
            <div className="space-y-2">
              {model.trigger_phrase && (
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Trigger: {model.trigger_phrase}
                  </Badge>
                </div>
              )}

              {model.usage_hint && (
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    💡 {model.usage_hint}
                  </Badge>
                </div>
              )}

              {/* Tags */}
              {model.tags && model.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {model.tags.slice(0, viewMode === 'grid' ? 3 : 5).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!filterTags.includes(tag)) {
                          setFilterTags([...filterTags, tag]);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {model.tags.length > (viewMode === 'grid' ? 3 : 5) && (
                    <Badge variant="outline" className="text-xs">
                      +{model.tags.length - (viewMode === 'grid' ? 3 : 5)}
                    </Badge>
                  )}
                </div>
              )}

              {/* Model Status Indicators */}
              <div className="flex items-center gap-2 pt-1">
                {model.local && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    📁 Local
                  </Badge>
                )}
                {!model.local && (
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                    ☁️ Remote
                  </Badge>
                )}
                {model.is_supported_model_format && (
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
                    ✓ Supported
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

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
        {/* Header Controls */}
        <div className="flex flex-col gap-3">
          {/* Search and Refresh */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models, authors, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshModels}
              disabled={refreshing}
              className="px-3"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Sort:</span>
              <Select value={sortBy} onValueChange={(value: 'name' | 'author' | 'recent') => setSortBy(value)}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {filterTags.length > 0 && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Filter className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{filterTags.length} filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterTags([])}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Model Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {modelTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs flex-col gap-1 h-12">
                <span className="text-base">{type.icon}</span>
                <span className="truncate">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {modelTypes.map(type => (
            <TabsContent key={type.id} value={type.id} className="mt-4">
              <div className="space-y-3">
                {/* Type Description */}
                <div className={cn("p-3 rounded-lg border text-sm", type.color)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <p className="text-xs opacity-80">{type.description}</p>
                </div>

                {/* Models Grid/List */}
                <ScrollArea className="h-96">
                  {filteredModels(type.id).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No {type.label.toLowerCase()} found</p>
                      {searchTerm && (
                        <p className="text-xs mt-1">Try adjusting your search terms</p>
                      )}
                    </div>
                  ) : (
                    <div className={cn(
                      "gap-3 p-1",
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 lg:grid-cols-2" 
                        : "space-y-2"
                    )}>
                      {filteredModels(type.id).map(model => (
                        <ModelCard key={model.name} model={model} type={type.id} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Selected Summary */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Current Selection</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-6 text-xs"
            >
              {showAdvanced ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Model:</span>
                <Badge variant={selectedModel ? 'default' : 'secondary'} className="text-xs">
                  {selectedModel || 'None'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">VAE:</span>
                <Badge variant={selectedVAE ? 'default' : 'secondary'} className="text-xs">
                  {selectedVAE || 'Auto'}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">LoRAs:</span>
                <Badge variant={selectedLoRAs.length > 0 ? 'default' : 'secondary'} className="text-xs">
                  {selectedLoRAs.length || 'None'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Embeddings:</span>
                <Badge variant={selectedEmbeddings.length > 0 ? 'default' : 'secondary'} className="text-xs">
                  {selectedEmbeddings.length || 'None'}
                </Badge>
              </div>
            </div>
          </div>

          {showAdvanced && (selectedLoRAs.length > 0 || selectedEmbeddings.length > 0) && (
            <div className="space-y-2 pt-2 border-t">
              {selectedLoRAs.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Active LoRAs:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedLoRAs.map(lora => (
                      <Badge key={lora} variant="outline" className="text-xs">
                        {lora}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLoRAChange(selectedLoRAs.filter(l => l !== lora))}
                          className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedEmbeddings.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Active Embeddings:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEmbeddings.map(embedding => (
                      <Badge key={embedding} variant="outline" className="text-xs">
                        {embedding}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEmbeddingChange(selectedEmbeddings.filter(e => e !== embedding))}
                          className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ParameterGroup>
  );
};
