import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const modelOptions = [
    { id: 'sdxl1', name: 'Stable Diffusion XL 1.0 (Base)', description: 'Popular core model (1024×1024).', sizeGB: 7.1, tags: ['SDXL', 'Base'] },
    { id: 'fluxdev', name: 'Flux.1 Dev', description: 'High quality, larger size.', sizeGB: 25.4, tags: ['Flux', 'HQ'] },
    { id: 'fluxschnell', name: 'Flux.1 Schnell', description: 'Turbo-speed variant.', sizeGB: 12.2, tags: ['Flux', 'Turbo'] },
    { id: 'sd35large', name: 'Stable Diffusion 3.5 Large', description: 'Very large, competitive quality.', sizeGB: 40.0, tags: ['SD3.5', 'Large'] },
];

interface InstallStepModelsProps {
    values: string[];
    onCheckedChange: (id: string, checked: boolean) => void;
}

export const InstallStepModels: React.FC<InstallStepModelsProps> = ({ values, onCheckedChange }) => {
    const totalGB = modelOptions
        .filter(m => values.includes(m.id))
        .reduce((sum, m) => sum + (m.sizeGB || 0), 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Download Models</CardTitle>
                <CardDescription>Select any models to download automatically. You can always add more later.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {modelOptions.map(option => {
                        const checked = values.includes(option.id);
                        return (
                            <Label
                                key={option.id}
                                htmlFor={option.id}
                                className={`group rounded-xl border p-4 transition-all cursor-pointer select-none h-full
                                    ${checked ? 'ring-2 ring-primary border-primary bg-secondary/30' : 'hover:bg-secondary/30 border-border'}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="font-medium text-foreground">{option.name}</div>
                                    <Checkbox id={option.id} checked={checked} onCheckedChange={(checked) => onCheckedChange(option.id, !!checked)} />
                                </div>
                                <p className="mt-1.5 text-sm text-muted-foreground">{option.description}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {option.tags?.map(t => (
                                        <Badge key={t} variant="secondary">{t}</Badge>
                                    ))}
                                    {option.sizeGB ? (
                                        <Badge variant="outline">{option.sizeGB.toFixed(1)} GB</Badge>
                                    ) : null}
                                </div>
                            </Label>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div className="text-muted-foreground">
                        Selected models: <span className="text-foreground font-medium">{values.length}</span>
                    </div>
                    <div className="text-muted-foreground">
                        Estimated download size: <span className="text-foreground font-medium">{totalGB.toFixed(1)} GB</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
