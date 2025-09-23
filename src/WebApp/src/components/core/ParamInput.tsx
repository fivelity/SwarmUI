import { TextInput } from './TextInput';
import { Select } from './Select';

const ParamInput = ({ param, value, onChange }) => {
  const commonProps = {
    value: value ?? param.default,
    onChange: e => onChange(param.id, e.target.value),
  };

  if (param.type === 'boolean') {
    return <input type="checkbox" checked={commonProps.value} onChange={e => onChange(param.id, e.target.checked)} />;
  }

  if (param.view_type === 'slider') {
    return (
      <div className="flex items-center gap-2">
        <input type="range" {...commonProps} min={param.min} max={param.max} step={param.step} className="w-full" />
        <span className="w-16 text-right">{commonProps.value}</span>
      </div>
    );
  }

  if (param.type === 'dropdown') {
    return (
      <Select {...commonProps}>
        {param.values.map(val => <option key={val} value={val}>{val}</option>)}
      </Select>
    );
  }

  if (param.type === 'integer' || param.type === 'decimal') {
    return <TextInput type="number" {...commonProps} step={param.step} />;
  }

  return <TextInput type="text" {...commonProps} />;
};

export default ParamInput;
