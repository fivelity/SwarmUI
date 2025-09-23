import { ParameterGroup } from '../layout/ParameterGroup';
import { Select } from '../core/Select';

export const ModelPanel = ({ models, currentModel, setCurrentModel }) => (
  <ParameterGroup title="Model">
    <Select value={currentModel} onChange={e => setCurrentModel(e.target.value)}>
      {models.length > 0 ? (
        models.map(model => <option key={model}>{model}</option>)
      ) : (
        <option>Loading models...</option>
      )}
    </Select>
  </ParameterGroup>
);
