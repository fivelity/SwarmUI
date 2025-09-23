import { useEffect, useState } from 'react';
import { getParams } from '../../services/api';
import { ParameterGroup } from '../layout/ParameterGroup';
import ParamInput from '../core/ParamInput';

export const ParametersPanel = ({ params, setParams }) => {
  const [paramDefs, setParamDefs] = useState([]);
  const [paramGroups, setParamGroups] = useState({});

  useEffect(() => {
    getParams().then(defs => {
      const coreParams = defs.filter(p => p.visible && !p.advanced && p.group);
      setParamDefs(coreParams);
      const groups = coreParams.reduce((acc, p) => {
        acc[p.group] = acc[p.group] || [];
        acc[p.group].push(p);
        return acc;
      }, {});
      // TODO: Sort groups based on group priority from backend
      setParamGroups(groups);

      // Initialize params state with defaults
      const initialParams = {};
      defs.forEach(p => {
        if (p.default) {
          initialParams[p.id] = p.default;
        }
      });
      setParams(initialParams);
    });
  }, []);

  const handleParamChange = (id, value) => {
    setParams(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(paramGroups).map(([groupId, defs]) => (
        <ParameterGroup key={groupId} title={groupId.replace(/_/g, ' ')}>
          {defs.map(def => (
            <div key={def.id}>
              <label className="text-sm font-medium" title={def.description}>{def.name}</label>
              <ParamInput param={def} value={params[def.id]} onChange={handleParamChange} />
            </div>
          ))}
        </ParameterGroup>
      ))}
    </div>
  );
};