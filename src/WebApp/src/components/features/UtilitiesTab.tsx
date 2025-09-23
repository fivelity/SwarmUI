import { useState } from 'react';
import { tokenize } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { ModelDownloader } from './tools/ModelDownloader';
import { PickleToSafetensorsPanel } from './tools/PickleToSafetensorsPanel';
import { LoRAExtractorPanel } from './tools/LoRAExtractorPanel';

const InfoTab = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title={t('Utilities')}>
        <p className="text-muted-foreground">{t('The "Utilities" tab provides a variety of general utilities and tools in the sub-tabs, and the quick-tools below.')}</p>
      </ParameterGroup>
      <ParameterGroup title={t('Metadata Utilities')}>
        <p className="text-muted-foreground">{t('If you click this button, all Model and Image metadata datastores will be reset, and they will be reloaded from source files. This is useful for example if you\'ve externally modified your model or image files and want to clean out or update Swarm\'s metadata tracking.')}</p>
        <div className="flex justify-center">
          <Button onClick={() => alert('TODO: Call ResetAllMetadata API')}>{t('Reset All Metadata')}</Button>
        </div>
      </ParameterGroup>
    </div>
  );
};

interface Token {
  id: number;
  text: string;
}

const ClipTokenizerTab = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleTokenize = async () => {
    const result = await tokenize(text);
    setTokens(result);
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title={t('CLIP Tokenizer')}>
        <p className="text-muted-foreground">{t('This is a tool to analyze CLIP tokenization for Stable Diffusion models. Simply type some text in the box below to see how it gets tokenized.')}</p>
        <Textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder={t('Enter text to tokenize...')} />
        <Button onClick={handleTokenize}>{t('Tokenize')}</Button>
        {tokens.length > 0 &&
          <div className="p-2 bg-secondary rounded-lg flex flex-wrap gap-2">
            {tokens.map(token => (
              <Badge key={token.id} variant="secondary" className="font-mono">
                {token.text} <span className="opacity-50 ml-2">({token.id})</span>
              </Badge>
            ))}
          </div>
        }
      </ParameterGroup>
    </div>
  );
};

export const UtilitiesTab = () => {
  const { t } = useTranslation();
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList>
        <TabsTrigger value="info">{t('Info')}</TabsTrigger>
        <TabsTrigger value="clip-tokenizer">{t('Tokenizer')}</TabsTrigger>
        <TabsTrigger value="pickle-to-safetensors">{t('Pickle to Safetensors')}</TabsTrigger>
        <TabsTrigger value="lora-extractor">{t('LoRA Extractor')}</TabsTrigger>
        <TabsTrigger value="model-downloader">{t('Model Downloader')}</TabsTrigger>
      </TabsList>
      <TabsContent value="info"><InfoTab /></TabsContent>
      <TabsContent value="clip-tokenizer"><ClipTokenizerTab /></TabsContent>
      <TabsContent value="pickle-to-safetensors"><PickleToSafetensorsPanel /></TabsContent>
      <TabsContent value="lora-extractor"><LoRAExtractorPanel /></TabsContent>
      <TabsContent value="model-downloader"><ModelDownloader /></TabsContent>
    </Tabs>
  );
};
