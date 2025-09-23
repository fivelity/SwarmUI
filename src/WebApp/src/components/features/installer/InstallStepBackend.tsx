import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const backendOptions = [
    { id: 'comfyui', name: 'ComfyUI (Local)', description: 'ComfyUI is a powerful node-based Stable Diffusion engine that runs entirely on your local PC. This option is best if you have a powerful GPU.' },
    { id: 'none', name: 'None / Custom / Choose Later', description: 'If you have a pre-existing backend installation (eg ComfyUI, Auto WebUI, etc) or want to deal with it later, click here.' },
];

interface InstallStepBackendProps {
    value: string;
    onChange: (value: string) => void;
}

export const InstallStepBackend: React.FC<InstallStepBackendProps> = ({ value, onChange }) => (
    <Card>
        <CardHeader>
            <CardTitle>Backend Selection</CardTitle>
            <CardDescription>What backend would you like to use?</CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-4">
                {backendOptions.map(option => (
                    <div key={option.id} className="flex items-start space-x-2 p-4 rounded-md border border-input">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="grid gap-1.5">
                            <Label htmlFor={option.id}>{option.name}</Label>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                    </div>
                ))}
            </RadioGroup>
        </CardContent>
    </Card>
);
