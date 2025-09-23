import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PromptsPanelProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
}

export const PromptsPanel: React.FC<PromptsPanelProps> = ({ prompt, setPrompt, negativePrompt, setNegativePrompt }) => (
  <div className="grid grid-cols-1 gap-4">
    <div className="grid w-full gap-1.5">
      <Label htmlFor="prompt">Prompt</Label>
      <Textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter your prompt here..." />
    </div>
    <div className="grid w-full gap-1.5">
      <Label htmlFor="negative-prompt">Negative Prompt</Label>
      <Textarea id="negative-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="Enter things to avoid..." />
    </div>
  </div>
);
