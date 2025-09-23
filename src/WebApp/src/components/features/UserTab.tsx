import { useTheme } from '@/contexts/ThemeProvider';
import { useLayout, layouts } from '@/contexts/LayoutProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';

export const UserTab = () => {
  const { theme, themes, setTheme } = useTheme();
  const { setLayout } = useLayout();

  return (
    <div className="max-w-md">
      <ParameterGroup title="Appearance Settings">
        <div className="grid gap-1.5">
            <Label htmlFor="theme-select">Theme</Label>
            <Select value={theme.id} onValueChange={setTheme}>
                <SelectTrigger id="theme-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {themes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="grid gap-1.5">
            <Label htmlFor="layout-select">Layout</Label>
            <Select defaultValue="default" onValueChange={e => setLayout(e as keyof typeof layouts)}>
                <SelectTrigger id="layout-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {Object.keys(layouts).map(layoutName => (
                        <SelectItem key={layoutName} value={layoutName}>
                            {layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </ParameterGroup>
    </div>
  );
};
