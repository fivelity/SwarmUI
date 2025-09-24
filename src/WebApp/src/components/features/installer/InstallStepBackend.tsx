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
            <CardDescription>Choose a generation backend. You can change this later in Server settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {backendOptions.map(option => {
                        const selected = value === option.id;
                        return (
                            <Label
                                key={option.id}
                                htmlFor={option.id}
                                className={`group cursor-pointer rounded-xl border p-4 transition-all select-none h-full
                                    ${selected ? 'ring-2 ring-primary border-primary bg-secondary/30' : 'hover:bg-secondary/30 border-border'}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="font-medium text-foreground">{option.name}</div>
                                    <RadioGroupItem value={option.id} id={option.id} />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                            </Label>
                        );
                    })}
                </div>
            </RadioGroup>
        </CardContent>
    </Card>
);
