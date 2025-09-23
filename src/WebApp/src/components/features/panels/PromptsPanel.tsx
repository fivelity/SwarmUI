export const PromptsPanel = ({ prompt, setPrompt, negativePrompt, setNegativePrompt }) => (
  <div className="grid grid-cols-1 gap-4">
    <div>
      <label className="text-sm font-medium">Prompt</label>
      <textarea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} className="bg-secondary border border-border rounded px-2 py-1 w-full" placeholder="Enter your prompt here..." />
    </div>
    <div>
      <label className="text-sm font-medium">Negative Prompt</label>
      <textarea rows={5} value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} className="bg-secondary border border-border rounded px-2 py-1 w-full" placeholder="Enter things to avoid..." />
    </div>
  </div>
);
