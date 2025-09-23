import { useTheme } from '../../contexts/ThemeProvider';
import { useLayout, layouts } from '../../contexts/LayoutProvider';
import { Select } from '../core/Select';
import { ParameterGroup } from '../layout/ParameterGroup';

export const UserTab = () => {
  const { theme, themes, setTheme } = useTheme();
  const { setLayout } = useLayout();

  return (
    <div className="max-w-md">
      <ParameterGroup title="Appearance Settings">
        <div>
          <label className="text-sm font-medium">Theme</label>
          <Select value={theme.id} onChange={e => setTheme(e.target.value)}>
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Layout</label>
          <Select defaultValue="default" onChange={e => setLayout(e.target.value as keyof typeof layouts)}>
            {Object.keys(layouts).map(layoutName => (
              <option key={layoutName} value={layoutName}>
                {layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </ParameterGroup>
    </div>
  );
};
