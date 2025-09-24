import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { themes } from '@/themes';
import { applyThemeVars } from '@/contexts/ThemeProvider';
import { ThemePreview } from './ThemePreview';

interface InstallStepThemesProps {
    value: string;
    onChange: (value: string) => void;
}

export const InstallStepThemes: React.FC<InstallStepThemesProps> = ({ value, onChange }) => {
    // Apply theme preview to document root
    useEffect(() => {
        const selectedTheme = themes.find(theme => theme.id === value);
        if (selectedTheme) {
            applyThemeVars(selectedTheme);
        }
    }, [value]);

    const handleThemeChange = (themeId: string) => {
        onChange(themeId);
        // Also persist immediately so navigating between steps keeps preview consistent
        localStorage.setItem('user-theme', themeId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Choose a Theme</CardTitle>
                <CardDescription>
                    You can always change this later in the User Settings. Select a card to preview instantly.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup value={value} onValueChange={handleThemeChange}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {themes.map(theme => {
                            const selected = value === theme.id;
                            return (
                                <Label
                                    key={theme.id}
                                    htmlFor={theme.id}
                                    className={`group cursor-pointer rounded-xl border p-4 transition-all select-none
                                    ${selected ? 'ring-2 ring-primary border-primary bg-secondary/30' : 'hover:bg-secondary/30 border-border'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="font-medium text-foreground">{theme.name}</div>
                                        <RadioGroupItem value={theme.id} id={theme.id} className="mt-0.5" />
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="w-4 h-4 rounded border border-border" style={{ background: theme.colors.background }} title="Background" />
                                        <div className="w-4 h-4 rounded border border-border" style={{ background: theme.colors.primary }} title="Primary" />
                                        <div className="w-4 h-4 rounded border border-border" style={{ background: theme.colors.accent }} title="Accent" />
                                        <div className="w-4 h-4 rounded border border-border" style={{ background: theme.colors.text }} title="Text" />
                                    </div>
                                </Label>
                            );
                        })}
                    </div>
                </RadioGroup>

                <div className="pt-2">
                    <ThemePreview />
                </div>
            </CardContent>
        </Card>
    );
}
