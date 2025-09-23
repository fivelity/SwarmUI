import { useState } from 'react';
import { Button } from '../core/Button';
import { ParameterGroup } from '../layout/ParameterGroup';

const api = {
    convertPickleToSafetensors: async (modelType: string, fp16: boolean) => fetch(`/API/Admin/ConvertPickleToSafetensors?model_type=${modelType}&fp16=${fp16}`, { method: 'POST' }).then(res => res.json()),
};

export const PickleToSafetensorsPanel = () => {
  const [fp16, setFp16] = useState(true);
  const [status, setStatus] = useState('');

  const handleConvert = async (modelType: string) => {
    setStatus(`Converting ${modelType}...`);
    try {
      const result = await api.convertPickleToSafetensors(modelType, fp16);
      setStatus(result.result || 'Conversion initiated.');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title="Pickle To Safetensors">
        <p className="text-text/70">This is a tool to quickly convert legacy Pickle (.pt, .ckpt, .bin) files to modern Safetensors files.</p>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={fp16} onChange={e => setFp16(e.target.checked)} />
          Convert to FP16? (Recommended)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-bold">Type</div>
          <div className="font-bold">Action</div>
          <div>Models</div>
          <Button onClick={() => handleConvert('Stable-Diffusion')}>Convert Models</Button>
          <div>LoRAs</div>
          <Button onClick={() => handleConvert('LoRA')}>Convert LoRAs</Button>
          <div>VAEs</div>
          <Button onClick={() => handleConvert('VAE')}>Convert VAEs</Button>
          <div>Embeddings</div>
          <Button onClick={() => handleConvert('Embedding')}>Convert Embeddings</Button>
          <div>ControlNets</div>
          <Button onClick={() => handleConvert('ControlNet')}>Convert ControlNets</Button>
        </div>
        {status && <p className="mt-4 text-sm text-accent">Status: {status}</p>}
      </ParameterGroup>
    </div>
  );
};
