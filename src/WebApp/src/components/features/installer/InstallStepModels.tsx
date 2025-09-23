import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const modelOptions = [
    { id: 'sdxl1', name: 'Stable Diffusion XL 1.0 (Base)', description: 'A popular core model from July 2023, good for 1024x1024 images.' },
    { id: 'fluxdev', name: 'Flux.1 Dev', description: 'A very large, high-quality model from July 2024.' },
    { id: 'fluxschnell', name: 'Flux.1 Schnell', description: 'A faster, turbo-style variant of Flux.1.' },
    { id: 'sd35large', name: 'Stable Diffusion 3.5 Large', description: 'A very large model from October 2024 with competitive quality.' },
];

interface InstallStepModelsProps {
    values: string[];
    onCheckedChange: (id: string, checked: boolean) => void;
}

export const InstallStepModels: React.FC<InstallStepModelsProps> = ({ values, onCheckedChange }) => (
    <Card>
        <CardHeader>
            <CardTitle>Download Models</CardTitle>
            <CardDescription>Select any models you would like to download automatically.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                {modelOptions.map(option => (
                    <div key={option.id} className="flex items-start space-x-2 p-4 rounded-md border border-input">
                        <Checkbox id={option.id} checked={values.includes(option.id)} onCheckedChange={(checked) => onCheckedChange(option.id, !!checked)} />
                        <div className="grid gap-1.5">
                            <Label htmlFor={option.id}>{option.name}</Label>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);
