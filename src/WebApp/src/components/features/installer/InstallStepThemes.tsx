import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { themes, type Theme } from '@/themes';

interface InstallStepThemesProps {
    value: string;
    onChange: (value: string) => void;
}

export const InstallStepThemes: React.FC<InstallStepThemesProps> = ({ value, onChange }) => {
    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

    // Apply theme preview to document root
    useEffect(() => {
        const selectedTheme = themes.find(theme => theme.id === value);
        if (selectedTheme) {
            setCurrentTheme(selectedTheme);
            const root = document.documentElement;
            
            // Apply theme colors as CSS variables
            Object.entries(selectedTheme.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
        }
    }, [value]);

    const handleThemeChange = (themeId: string) => {
        onChange(themeId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Choose a Theme</CardTitle>
                <CardDescription>
                    You can always change this later in the User Settings page. 
                    {currentTheme && (
                        <span className="block mt-2 text-sm font-medium">
                            Preview: {currentTheme.name}
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup value={value} onValueChange={handleThemeChange}>
                    {themes.map(theme => (
                        <div key={theme.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                            <RadioGroupItem value={theme.id} id={theme.id} />
                            <div className="flex-1">
                                <Label htmlFor={theme.id} className="cursor-pointer font-medium">
                                    {theme.name}
                                </Label>
                                <div className="flex gap-2 mt-2">
                                    {/* Color preview swatches */}
                                    <div 
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors.background }}
                                        title="Background"
                                    />
                                    <div 
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors.primary }}
                                        title="Primary"
                                    />
                                    <div 
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors.accent }}
                                        title="Accent"
                                    />
                                    <div 
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: theme.colors.text }}
                                        title="Text"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
};
