import { TextArea } from './core/TextArea';

export const PromptInput = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Prompt</label>
        <TextArea rows={5} placeholder="Enter your prompt here..." />
      </div>
      <div>
        <label className="text-sm font-medium">Negative Prompt</label>
        <TextArea rows={5} placeholder="Enter things to avoid..." />
      </div>
    </div>
  );
};
