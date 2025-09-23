import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { getModels } from '@/services/api';

const api = {
    extractLoRA: async (baseModel: string, otherModel: string, rank: number, outputName: string) => fetch(`/API/Admin/ExtractLoRA?base_model=${baseModel}&other_model=${otherModel}&rank=${rank}&output_name=${outputName}`, { method: 'POST' }).then(res => res.json()),
};

export const LoRAExtractorPanel = () => {
  const [models, setModels] = useState<string[]>([]);
  const [baseModel, setBaseModel] = useState('');
  const [otherModel, setOtherModel] = useState('');
  const [rank, setRank] = useState(16);
  const [outputName, setOutputName] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getModels().then(modelData => {
      if (modelData) {
        const modelNames = Object.keys(modelData);
        setModels(modelNames);
        if (modelNames.length > 0) {
          setBaseModel(modelNames[0]);
          setOtherModel(modelNames[0]);
        }
      }
    });
  }, []);

  const handleExtract = async () => {
    setStatus('Extracting LoRA...');
    try {
      const result = await api.extractLoRA(baseModel, otherModel, rank, outputName);
      setStatus(result.result || 'LoRA extraction initiated.');
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title="LoRA Extractor">
        <p className="text-muted-foreground">This is a tool to extract a LoRA from the difference between two models.</p>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="base-model">Base Model</Label>
            <Select value={baseModel} onValueChange={setBaseModel}>
              <SelectTrigger id="base-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="other-model">Other Model</Label>
            <Select value={otherModel} onValueChange={setOtherModel}>
              <SelectTrigger id="other-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rank">Rank</Label>
            <Input id="rank" type="number" value={rank} onChange={e => setRank(parseInt(e.target.value))} min={1} max={320} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="output-name">Save As</Label>
            <Input id="output-name" type="text" value={outputName} onChange={e => setOutputName(e.target.value)} placeholder="LoRA Name" />
          </div>
          <Button onClick={handleExtract}>Extract LoRA</Button>
          {status && <p className="mt-4 text-sm text-accent">Status: {status}</p>}
        </div>
      </ParameterGroup>
    </div>
  );
};
