import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Search, RefreshCw, Grid, List, Filter, X, Folder, HardDrive, Cloud, Image as ImageIcon, BadgeCheck, Info, SlidersHorizontal } from 'lucide-react';
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

type QuickFilters = {
  localOnly: boolean;
  remoteOnly: boolean;
  supportedOnly: boolean;
  hasPreview: boolean;
};

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
  const [quickFilters, setQuickFilters] = useState<QuickFilters>({
    localOnly: false,
    remoteOnly: false,
    supportedOnly: false,
    hasPreview: false
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailSheet, setDetailSheet] = useState<{ type: string; model: Model } | null>(null);
  const [tagSearch, setTagSearch] = useState('');

  const modelTypes = useMemo(() => ([
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
  ]), []);

  const fetchModels = useCallback(async () => {
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
  }, [modelTypes, sortBy]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const refreshModels = async () => {
    setRefreshing(true);
    await fetchModels();
    setRefreshing(false);
  };

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    modelTypes.forEach(type => {
      (models[type.id] || []).forEach(model => {
        model.tags?.forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [models, modelTypes]);

  const filteredModelsMap = useMemo(() => {
    const result: Record<string, Model[]> = {};

    modelTypes.forEach(type => {
      const typeModels = models[type.id] || [];
      let filtered = [...typeModels];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(model =>
          model.name.toLowerCase().includes(term) ||
          model.title?.toLowerCase().includes(term) ||
          model.description?.toLowerCase().includes(term) ||
          model.author?.toLowerCase().includes(term) ||
          model.tags?.some(tag => tag.toLowerCase().includes(term))
        );
      }

      if (filterTags.length > 0) {
        filtered = filtered.filter(model =>
          model.tags?.some(tag => filterTags.includes(tag))
        );
      }

      if (quickFilters.localOnly) {
        filtered = filtered.filter(model => model.local);
      }

      if (quickFilters.remoteOnly) {
        filtered = filtered.filter(model => !model.local);
      }

      if (quickFilters.supportedOnly) {
        filtered = filtered.filter(model => model.is_supported_model_format);
      }

      if (quickFilters.hasPreview) {
        filtered = filtered.filter(model => !!model.preview);
      }

      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'author':
            return (a.author || '').localeCompare(b.author || '');
          case 'recent':
            return b.name.localeCompare(a.name);
          default:
            return a.name.localeCompare(b.name);
        }
      });

      result[type.id] = filtered;
    });

    return result;
  }, [filterTags, models, modelTypes, quickFilters, searchTerm, sortBy]);

  const toggleTagFilter = (tag: string) => {
    setFilterTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleQuickFilter = (key: keyof QuickFilters, value: boolean) => {
    setQuickFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'localOnly' && value) {
        next.remoteOnly = false;
      }
      if (key === 'remoteOnly' && value) {
        next.localOnly = false;
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTags([]);
    setQuickFilters({
      localOnly: false,
      remoteOnly: false,
      supportedOnly: false,
      hasPreview: false
    });
    setTagSearch('');
  };

  const activeFilterCount = useMemo(() => {
    const quickCount = Object.values(quickFilters).filter(Boolean).length;
    return quickCount + (searchTerm ? 1 : 0) + filterTags.length;
  }, [filterTags.length, quickFilters, searchTerm]);

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
          'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-border/60',
          selected && 'ring-2 ring-primary bg-primary/5 shadow-md',
          viewMode === 'list' && 'flex-row'
        )}
        onClick={() => handleModelSelect(type, model.name)}
      >
        <div className={cn(
          'flex',
          viewMode === 'grid' ? 'flex-col' : 'flex-row items-center gap-4 p-4'
        )}>
          {viewMode === 'grid' && (
            <div className="relative w-full">
              {model.preview ? (
                <img
                  src={model.preview}
                  alt={model.title || model.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center text-3xl opacity-60">
                  {modelTypes.find(t => t.id === type)?.icon || '📄'}
                </div>
              )}
              {selected && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="text-xs">
                    {isMultiSelect ? 'Added' : 'Active'}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className={cn(viewMode === 'grid' ? 'p-4 pt-3 space-y-3' : 'flex-1 min-w-0 space-y-3')}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className={cn('font-medium truncate', viewMode === 'grid' ? 'text-sm' : 'text-base')}>
                  {model.title || model.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{model.author || 'Unknown author'}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{model.local ? 'Local asset' : 'Remote asset'}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  setDetailSheet({ type, model });
                }}
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Open details</span>
              </Button>
            </div>

            {model.description && (
              <p className={cn('text-muted-foreground', viewMode === 'grid' ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2')}>
                {model.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {model.trigger_phrase && (
                <Badge variant="secondary" className="text-xs">
                  Trigger: {model.trigger_phrase}
                </Badge>
              )}
              {model.usage_hint && (
                <Badge variant="outline" className="text-xs">
                  💡 {model.usage_hint}
                </Badge>
              )}
            </div>

            {model.tags && model.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {model.tags.slice(0, viewMode === 'grid' ? 4 : 6).map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[11px] cursor-pointer hover:bg-primary/10"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleTagFilter(tag);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
                {model.tags.length > (viewMode === 'grid' ? 4 : 6) && (
                  <Badge variant="outline" className="text-[11px]">
                    +{model.tags.length - (viewMode === 'grid' ? 4 : 6)}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {model.local ? (
                <Badge variant="outline" className="text-xs">
                  <HardDrive className="mr-1 h-3 w-3" /> Local
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <Cloud className="mr-1 h-3 w-3" /> Remote
                </Badge>
              )}
              {model.is_supported_model_format && (
                <Badge variant="outline" className="text-xs">
                  <BadgeCheck className="mr-1 h-3 w-3" /> Supported
                </Badge>
              )}
              {model.preview && (
                <Badge variant="outline" className="text-xs">
                  <ImageIcon className="mr-1 h-3 w-3" /> Preview
                </Badge>
              )}
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[220px]">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="px-3"
              disabled={activeFilterCount === 0}
            >
              <X className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
              <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Advanced filters</SheetTitle>
                  <SheetDescription>Refine your model search across all libraries.</SheetDescription>
                </SheetHeader>
                <div className="mt-5 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Quick filters</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={quickFilters.localOnly}
                          onCheckedChange={(checked) => toggleQuickFilter('localOnly', !!checked)}
                        />
                        <span>Show only local models</span>
                      </label>
                      <label className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={quickFilters.remoteOnly}
                          onCheckedChange={(checked) => toggleQuickFilter('remoteOnly', !!checked)}
                        />
                        <span>Show only remote models</span>
                      </label>
                      <label className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={quickFilters.supportedOnly}
                          onCheckedChange={(checked) => toggleQuickFilter('supportedOnly', !!checked)}
                        />
                        <span>Supported formats only</span>
                      </label>
                      <label className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={quickFilters.hasPreview}
                          onCheckedChange={(checked) => toggleQuickFilter('hasPreview', !!checked)}
                        />
                        <span>Requires preview image</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Tag filters</h3>
                    <Input
                      value={tagSearch}
                      onChange={(event) => setTagSearch(event.target.value)}
                      placeholder="Search tags"
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                        .map(tag => (
                          <Badge
                            key={tag}
                            variant={filterTags.includes(tag) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      {availableTags.length === 0 && (
                        <p className="text-xs text-muted-foreground">No tags available for current models.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Sorting</h3>
                    <Select value={sortBy} onValueChange={(value: 'name' | 'author' | 'recent') => setSortBy(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Alphabetical</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="recent">Recently added</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
              <Button variant="outline" size="sm" className="flex items-center gap-2 px-3" onClick={() => setFilterDrawerOpen(true)}>
                <SlidersHorizontal className="h-4 w-4" /> Advanced filters
              </Button>
            </Sheet>
          </div>

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

        <div className="flex flex-wrap items-center gap-2">
          <Toggle
            pressed={quickFilters.localOnly}
            onPressedChange={(pressed) => toggleQuickFilter('localOnly', pressed)}
            size="sm"
            variant="outline"
          >
            <HardDrive className="mr-2 h-4 w-4" /> Local only
          </Toggle>
          <Toggle
            pressed={quickFilters.remoteOnly}
            onPressedChange={(pressed) => toggleQuickFilter('remoteOnly', pressed)}
            size="sm"
            variant="outline"
          >
            <Cloud className="mr-2 h-4 w-4" /> Remote only
          </Toggle>
          <Toggle
            pressed={quickFilters.supportedOnly}
            onPressedChange={(pressed) => toggleQuickFilter('supportedOnly', pressed)}
            size="sm"
            variant="outline"
          >
            <BadgeCheck className="mr-2 h-4 w-4" /> Supported only
          </Toggle>
          <Toggle
            pressed={quickFilters.hasPreview}
            onPressedChange={(pressed) => toggleQuickFilter('hasPreview', pressed)}
            size="sm"
            variant="outline"
          >
            <ImageIcon className="mr-2 h-4 w-4" /> Preview assets
          </Toggle>
          {activeFilterCount > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" /> {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {(searchTerm || filterTags.length > 0) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filterTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button onClick={() => toggleTagFilter(tag)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {modelTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs flex-col gap-1 h-12">
                <span className="text-base">{type.icon}</span>
                <span className="truncate">{type.label}</span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {(filteredModelsMap[type.id] || []).length}/{(models[type.id]?.length ?? 0)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {modelTypes.map(type => (
            <TabsContent key={type.id} value={type.id} className="mt-4">
              {type.description && (
                <div className={cn('p-3 rounded-lg border text-sm', type.color)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <p className="text-xs opacity-80">{type.description}</p>
                </div>
              )}
              <div className="space-y-3">
                <ScrollArea className="h-96">
                  {(filteredModelsMap[type.id] || []).length === 0 ? (
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
                      {(filteredModelsMap[type.id] || []).map(model => (
                        <ModelCard key={model.name} model={model} type={type.id} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
          ))}
        </Tabs>

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

      <Sheet open={!!detailSheet} onOpenChange={(open) => {
        if (!open) {
          setDetailSheet(null);
        }
      }}>
        {detailSheet && (
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{detailSheet.model.title || detailSheet.model.name}</SheetTitle>
              <SheetDescription>
                Detailed information for {modelTypes.find(t => t.id === detailSheet.type)?.label}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-5 space-y-5">
              {detailSheet.model.preview && (
                <img
                  src={detailSheet.model.preview}
                  alt={detailSheet.model.title || detailSheet.model.name}
                  className="w-full rounded-lg border"
                />
              )}

              <div className="grid grid-cols-1 gap-4 text-sm">
                {detailSheet.model.description && (
                  <div>
                    <h5 className="font-medium mb-1">Description</h5>
                    <p className="text-muted-foreground whitespace-pre-line">{detailSheet.model.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium break-all">{detailSheet.model.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Author</p>
                    <p className="font-medium">{detailSheet.model.author || 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className="font-medium">{detailSheet.model.local ? 'Local' : 'Remote'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Supported format</p>
                    <p className="font-medium">{detailSheet.model.is_supported_model_format ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                {detailSheet.model.trigger_phrase && (
                  <div>
                    <h5 className="font-medium mb-1">Trigger phrase</h5>
                    <Badge variant="secondary">{detailSheet.model.trigger_phrase}</Badge>
                  </div>
                )}
                {detailSheet.model.usage_hint && (
                  <div>
                    <h5 className="font-medium mb-1">Usage hints</h5>
                    <p className="text-sm text-muted-foreground">{detailSheet.model.usage_hint}</p>
                  </div>
                )}
                {detailSheet.model.merged_from && (
                  <div>
                    <h5 className="font-medium mb-1">Merged from</h5>
                    <p className="text-sm text-muted-foreground">{detailSheet.model.merged_from}</p>
                  </div>
                )}
                {detailSheet.model.tags && detailSheet.model.tags.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {detailSheet.model.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant={filterTags.includes(tag) ? 'default' : 'outline'}
                          className="text-xs cursor-pointer"
                          onClick={() => toggleTagFilter(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => handleModelSelect(detailSheet.type, detailSheet.model.name)}
                  className="flex-1"
                >
                  {isSelected(detailSheet.type, detailSheet.model.name) ? 'Update selection' : 'Add to selection'}
                </Button>
                <Button variant="ghost" onClick={() => setDetailSheet(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </ParameterGroup>
  );
};
