import { useEffect, useState } from 'react';
import { getParams } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import ParamInput from '@/components/core/ParamInput';
import { GenerationParams } from '@/types';

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
  params: GenerationParams;
  setParams: React.Dispatch<React.SetStateAction<GenerationParams>>;
}

export const ParametersPanel: React.FC<ParametersPanelProps> = ({ params, setParams }) => {
      const [, setParamDefs] = useState<T2IParam[]>([]);
  const [paramGroups, setParamGroups] = useState<Record<string, T2IParam[]>>({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getParams().then((defs: T2IParam[]) => {
      // Show both basic and advanced parameters, but group them appropriately
      const visibleParams = defs.filter(p => p.visible && p.group);
      setParamDefs(visibleParams);
      
      const groups = visibleParams.reduce((acc: Record<string, T2IParam[]>, p) => {
        acc[p.group] = acc[p.group] || [];
        acc[p.group].push(p);
        return acc;
      }, {});
      
      // Sort groups by priority (core parameters first)
      const sortedGroups: Record<string, T2IParam[]> = {};
      const groupOrder = [
        'Basic Parameters',
        'Sampling',
        'Image',
        'Advanced',
        'ControlNet',
        'Refine / Upscale',
        'Video',
        'Other'
      ];
      
      groupOrder.forEach(groupName => {
        if (groups[groupName]) {
          sortedGroups[groupName] = groups[groupName].sort((a, b) => 
            (a.advanced ? 1 : 0) - (b.advanced ? 1 : 0)
          );
        }
      });
      
      // Add any remaining groups
      Object.keys(groups).forEach(groupName => {
        if (!sortedGroups[groupName]) {
          sortedGroups[groupName] = groups[groupName];
        }
      });
      
      setParamGroups(sortedGroups);

      // Initialize params state with defaults, but don't override existing values
      const initialParams: GenerationParams = { 
        prompt: params.prompt || '', 
        negativeprompt: params.negativeprompt || '' 
      };
      
      defs.forEach(p => {
        if (p.default !== undefined && params[p.id] === undefined) {
          initialParams[p.id] = p.default;
        }
      });
      
      setParams(prev => ({ ...prev, ...initialParams }));
    });
  }, []);

    const handleParamChange = (id: string, value: any) => {
                setParams(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Controls */}
      <div className="space-y-3">
        <Input 
          placeholder="Search parameters..." 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="w-full"
        />
        
        {filter && (
          <div className="text-xs text-muted-foreground">
            Showing parameters matching "{filter}"
          </div>
        )}
      </div>

      {/* Parameter Groups */}
      <div className="space-y-4">
        {Object.entries(paramGroups).map(([groupId, defs]) => {
          const filteredDefs = defs.filter(def => 
            def.name.toLowerCase().includes(filter.toLowerCase()) ||
            def.description?.toLowerCase().includes(filter.toLowerCase()) ||
            def.id.toLowerCase().includes(filter.toLowerCase())
          );
          
          if (filteredDefs.length === 0) {
            return null;
          }

          // Separate basic and advanced parameters
          const basicParams = filteredDefs.filter(def => !def.advanced);
          const advancedParams = filteredDefs.filter(def => def.advanced);

          return (
            <ParameterGroup 
              key={groupId} 
              title={groupId.replace(/_/g, ' ')}
            >
              {/* Basic Parameters */}
              {basicParams.length > 0 && (
                <div className="space-y-3">
                  {basicParams.map((def: T2IParam) => (
                    <div key={def.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label 
                          htmlFor={def.id}
                          className="text-sm font-medium cursor-help"
                          title={def.description}
                        >
                          {def.name}
                        </Label>
                        {def.default !== undefined && (
                          <button
                            onClick={() => handleParamChange(def.id, def.default)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            title={`Reset to default: ${def.default}`}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <ParamInput 
                        param={def} 
                        value={params[def.id]} 
                        onChange={handleParamChange}
                      />
                      {def.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {def.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Advanced Parameters */}
              {advancedParams.length > 0 && (
                <details className="group">
                  <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <span className="transform transition-transform group-open:rotate-90">▶</span>
                    Advanced {groupId.replace(/_/g, ' ')} ({advancedParams.length})
                  </summary>
                  <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
                    {advancedParams.map((def: T2IParam) => (
                      <div key={def.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label 
                            htmlFor={def.id}
                            className="text-sm font-medium cursor-help"
                            title={def.description}
                          >
                            {def.name}
                          </Label>
                          {def.default !== undefined && (
                            <button
                              onClick={() => handleParamChange(def.id, def.default)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              title={`Reset to default: ${def.default}`}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <ParamInput 
                          param={def} 
                          value={params[def.id]} 
                          onChange={handleParamChange}
                        />
                        {def.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {def.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </ParameterGroup>
          );
        })}
      </div>

      {/* No Results */}
      {filter && Object.values(paramGroups).every(defs => 
        defs.filter(def => 
          def.name.toLowerCase().includes(filter.toLowerCase()) ||
          def.description?.toLowerCase().includes(filter.toLowerCase()) ||
          def.id.toLowerCase().includes(filter.toLowerCase())
        ).length === 0
      ) && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No parameters found matching "{filter}"</p>
          <p className="text-xs mt-1">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};