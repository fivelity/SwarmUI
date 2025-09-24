import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generate } from '@/services/api';
import { GalleryPanel } from './panels/GalleryPanel';
import { TwoColumnLayout } from '../layout/ModernLayout';
import { camelToSnake } from '@/lib/utils';
import { Sparkles, Zap, Palette, Camera, Mountain, Users, Heart, Star } from 'lucide-react';

interface SimpleTabProps {
  activeSubTab?: string;
}

export const SimpleTab = ({ activeSubTab }: SimpleTabProps) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Array<{
    id: string;
    url: string;
    thumbnail?: string;
    filename?: string;
    metadata?: Record<string, any>;
  }>>([]);

  const promptSuggestions = [
    { icon: <Mountain className="h-4 w-4" />, text: "A serene mountain landscape at sunset", category: "Nature" },
    { icon: <Users className="h-4 w-4" />, text: "Portrait of a wise old wizard with a long beard", category: "Portrait" },
    { icon: <Camera className="h-4 w-4" />, text: "Futuristic cityscape with flying cars", category: "Sci-Fi" },
    { icon: <Palette className="h-4 w-4" />, text: "Abstract art with vibrant colors and flowing shapes", category: "Abstract" },
    { icon: <Heart className="h-4 w-4" />, text: "Cute kitten playing with a ball of yarn", category: "Animals" },
    { icon: <Star className="h-4 w-4" />, text: "Magical forest with glowing mushrooms and fireflies", category: "Fantasy" }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    const params = { 
      prompt: prompt.trim(), 
      negativeprompt: 'blurry, low quality, distorted', 
      steps: 25, 
      cfg_scale: 7.5, 
      sampler: 'euler_a', 
      width: 512, 
      height: 512, 
      seed: -1 
    };
    
    const snakeParams = camelToSnake(params);
    const resultImages = await generate(snakeParams);
    
    if (resultImages) {
      const imageObjects = resultImages.map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        url,
        thumbnail: url,
        filename: `simple-${Date.now()}-${index}.png`,
        metadata: { ...snakeParams, mode: 'simple' }
      }));
      setImages(prev => [...imageObjects, ...prev]);
    }
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <TwoColumnLayout>
      {/* Left Panel: Simple Generation Interface */}
      <div className="space-y-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Zap className="h-8 w-8" />
            <h1 className="text-3xl font-bold">{t('Simple Mode')}</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {t('Just describe what you want to see and let AI create it!')}
          </p>
        </div>

        {/* Main Prompt Input */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t('Describe Your Image')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              rows={6} 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)}
              placeholder={t('A beautiful landscape painting with mountains and a lake at sunset...')}
              className="text-base resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {prompt.length} characters
              </span>
              <Button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim()}
                size="lg"
                className="px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('Generating...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('Generate Image')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prompt Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('Need Inspiration?')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {promptSuggestions.map((suggestion, index) => (
                <div key={index} className="group">
                  <button
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-0.5">
                        {suggestion.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {suggestion.text}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">{t('Quick Tips')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <p>• {t('Be specific about what you want to see')}</p>
              <p>• {t('Mention art styles like "photorealistic" or "oil painting"')}</p>
              <p>• {t('Add lighting details like "golden hour" or "dramatic lighting"')}</p>
              <p>• {t('Include mood words like "peaceful", "mysterious", or "vibrant"')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Gallery */}
      <div className="h-full overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('Your Creations')}</h2>
            {images.length > 0 && (
              <Badge variant="outline">
                {images.length} {images.length === 1 ? t('image') : t('images')}
              </Badge>
            )}
          </div>
          <Separator />
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">{t('No images yet')}</p>
              <p className="text-sm">{t('Generate your first image to see it here!')}</p>
            </div>
          ) : (
            <GalleryPanel images={images} />
          )}
        </div>
      </div>
    </TwoColumnLayout>
  );
};