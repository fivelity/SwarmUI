import { ParameterGroup } from '../layout/ParameterGroup';
import { TextInput } from '../core/TextInput';
import { Select } from '../core/Select';

export const ParamsPanel = ({ steps, setSteps, cfgScale, setCfgScale, sampler, setSampler, width, setWidth, height, setHeight, seed, setSeed }) => (
  <div className="flex flex-col gap-4">
    <ParameterGroup title="Core Parameters">
      <TextInput type="number" value={steps} onChange={e => setSteps(parseInt(e.target.value))}/>
      <TextInput type="number" value={cfgScale} onChange={e => setCfgScale(parseFloat(e.target.value))} />
      <Select value={sampler} onChange={e => setSampler(e.target.value)}>
        <option>euler</option>
        <option>euler_ancestral</option>
        <option>lms</option>
      </Select>
    </ParameterGroup>
    <ParameterGroup title="Image Parameters">
      <TextInput type="number" value={width} onChange={e => setWidth(parseInt(e.target.value))} />
      <TextInput type="number" value={height} onChange={e => setHeight(parseInt(e.target.value))} />
      <TextInput type="number" value={seed} onChange={e => setSeed(parseInt(e.target.value))} />
    </ParameterGroup>
  </div>
);
