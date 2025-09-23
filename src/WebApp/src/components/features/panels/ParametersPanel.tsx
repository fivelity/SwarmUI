import { useEffect, useState } from 'react';
import { getParams } from '@/services/api';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import ParamInput from '@/components/core/ParamInput';

export interface T2IParam {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'integer' | 'decimal' | 'boolean' | 'dropdown';
  default?: any;
  min?: number;
  max?: number;
  step?: number;
  values?: string[];
  visible: boolean;
  advanced: boolean;
  group: string;
  view_type?: 'slider' | string;
}

interface ParametersPanelProps {
  params: Record<string, any>;
  setParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export const ParametersPanel: React.FC<ParametersPanelProps> = ({ params, setParams }) => {
      const [, setParamDefs] = useState<T2IParam[]>([]);
  const [paramGroups, setParamGroups] = useState<Record<string, T2IParam[]>>({});

  useEffect(() => {
            getParams().then((defs: T2IParam[]) => {
      const coreParams = defs.filter(p => p.visible && !p.advanced && p.group);
      setParamDefs(coreParams);
                  const groups = coreParams.reduce((acc: Record<string, T2IParam[]>, p) => {
        acc[p.group] = acc[p.group] || [];
        acc[p.group].push(p);
        return acc;
      }, {});
      // TODO: Sort groups based on group priority from backend
      setParamGroups(groups);

      // Initialize params state with defaults
                  const initialParams: Record<string, any> = {};
                  defs.forEach(p => {
        if (p.default) {
          initialParams[p.id] = p.default;
        }
      });
                  setParams(initialParams);
    });
  }, []);

    const handleParamChange = (id: string, value: any) => {
                setParams(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
                  {Object.entries(paramGroups).map(([groupId, defs]) => (
        <ParameterGroup key={groupId} title={groupId.replace(/_/g, ' ')}>
                    {defs.map((def: T2IParam) => (
            <div key={def.id}>
              <Label title={def.description}>{def.name}</Label>
              <ParamInput param={def} value={params[def.id]} onChange={handleParamChange} />
            </div>
          ))}
        </ParameterGroup>
      ))}
    </div>
  );
};