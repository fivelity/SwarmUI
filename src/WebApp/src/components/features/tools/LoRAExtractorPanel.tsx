import { useEffect, useState } from 'react';
import { Button } from '../core/Button';
import { TextInput } from '../core/TextInput';
import { Select } from '../core/Select';
import { ParameterGroup } from '../layout/ParameterGroup';
import { getModels } from '../../services/api';

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
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title="LoRA Extractor">
        <p className="text-text/70">This is a tool to extract a LoRA from the difference between two models.</p>
        <div>
          <label>Base model:</label>
          <Select value={baseModel} onChange={e => setBaseModel(e.target.value)}>
            {models.map(model => <option key={model}>{model}</option>)}
          </Select>
        </div>
        <div>
          <label>Other model:</label>
          <Select value={otherModel} onChange={e => setOtherModel(e.target.value)}>
            {models.map(model => <option key={model}>{model}</option>)}
          </Select>
        </div>
        <div>
          <label>Rank:</label>
          <TextInput type="number" value={rank} onChange={e => setRank(parseInt(e.target.value))} min={1} max={320} />
        </div>
        <div>
          <label>Save as:</label>
          <TextInput type="text" value={outputName} onChange={e => setOutputName(e.target.value)} placeholder="LoRA Name" />
        </div>
        <Button onClick={handleExtract}>Extract LoRA</Button>
        {status && <p className="mt-4 text-sm text-accent">Status: {status}</p>}
      </ParameterGroup>
    </div>
  );
};
