import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ParameterGroup } from '@/components/layout/ParameterGroup';

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
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title="Pickle To Safetensors">
        <p className="text-text/70">This is a tool to quickly convert legacy Pickle (.pt, .ckpt, .bin) files to modern Safetensors files.</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="fp16" checked={fp16} onCheckedChange={(checked) => setFp16(checked === true)} />
          <Label htmlFor="fp16">Convert to FP16? (Recommended)</Label>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Models</TableCell>
              <TableCell className="text-right"><Button onClick={() => handleConvert('Stable-Diffusion')}>Convert Models</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>LoRAs</TableCell>
              <TableCell className="text-right"><Button onClick={() => handleConvert('LoRA')}>Convert LoRAs</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>VAEs</TableCell>
              <TableCell className="text-right"><Button onClick={() => handleConvert('VAE')}>Convert VAEs</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Embeddings</TableCell>
              <TableCell className="text-right"><Button onClick={() => handleConvert('Embedding')}>Convert Embeddings</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ControlNets</TableCell>
              <TableCell className="text-right"><Button onClick={() => handleConvert('ControlNet')}>Convert ControlNets</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {status && <p className="mt-4 text-sm text-accent">Status: {status}</p>}
      </ParameterGroup>
    </div>
  );
};
