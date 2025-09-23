import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// TODO: Fetch themes dynamically
const themes = [
    { id: 'modern_dark', name: 'Modern Dark' },
    { id: 'modern_light', name: 'Modern Light' },
    { id: 'solarized', name: 'Solarized Light' },
    { id: 'dark_dreams', name: 'Dark Dreams' },
];

interface InstallStepThemesProps {
    value: string;
    onChange: (value: string) => void;
}

export const InstallStepThemes: React.FC<InstallStepThemesProps> = ({ value, onChange }) => (
    <Card>
        <CardHeader>
            <CardTitle>Choose a Theme</CardTitle>
            <CardDescription>You can always change this later in the User Settings page.</CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup value={value} onValueChange={onChange}>
                {themes.map(theme => (
                    <div key={theme.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={theme.id} id={theme.id} />
                        <Label htmlFor={theme.id}>{theme.name}</Label>
                    </div>
                ))}
            </RadioGroup>
        </CardContent>
    </Card>
);
