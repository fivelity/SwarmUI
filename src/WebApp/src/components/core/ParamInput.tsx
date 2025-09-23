import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { T2IParam } from '../features/panels/ParametersPanel';

interface ParamInputProps {
  param: T2IParam;
  value: any;
  onChange: (id: string, value: any) => void;
}

const ParamInput: React.FC<ParamInputProps> = ({ param, value, onChange }) => {
  const currentValue = value ?? param.default;

  if (param.type === 'boolean') {
    return <Checkbox checked={currentValue} onCheckedChange={checked => onChange(param.id, checked)} />;
  }

  if (param.view_type === 'slider') {
    return (
      <div className="flex items-center gap-2">
        <Slider
          value={[currentValue]}
          onValueChange={([val]) => onChange(param.id, val)}
          min={param.min}
          max={param.max}
          step={param.step}
          className="w-full"
        />
        <span className="w-16 text-right">{currentValue}</span>
      </div>
    );
  }

  if (param.type === 'dropdown') {
    return (
      <Select value={currentValue} onValueChange={val => onChange(param.id, val)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {param.values?.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}
        </SelectContent>
      </Select>
    );
  }

  if (param.type === 'integer' || param.type === 'decimal') {
    return <Input type="number" value={currentValue} onChange={e => onChange(param.id, e.target.value)} step={param.step} />;
  }

  return <Input type="text" value={currentValue} onChange={e => onChange(param.id, e.target.value)} />;
};

export default ParamInput;
