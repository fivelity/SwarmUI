import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const usageOptions = [
    { id: 'just_self', name: 'Just Yourself On This PC', description: 'Disables external access entirely, sets you as always a full administrator of the installation.' },
    { id: 'just_self_lan', name: 'Just Yourself, with LAN access', description: 'Enables LAN access (so you can eg open from your phone), sets you as always a full administrator of the installation.' },
    { id: 'friends_and_family', name: '(WIP): Friends & Family', description: 'Enables external access, makes it possible to register multiple accounts for the UI, generally trusted with access.', disabled: true },
];

interface InstallStepUsageProps {
    value: string;
    onChange: (value: string) => void;
}

export const InstallStepUsage: React.FC<InstallStepUsageProps> = ({ value, onChange }) => (
    <Card>
        <CardHeader>
            <CardTitle>Usage Scenario</CardTitle>
            <CardDescription>Choose how you plan to use SwarmUI. This sets sensible defaults for networking and permissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {usageOptions.map(option => {
                        const selected = value === option.id;
                        const disabled = option.disabled;
                        return (
                            <Label
                                key={option.id}
                                htmlFor={option.id}
                                className={`group cursor-pointer rounded-xl border p-4 transition-all select-none h-full
                                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    ${selected ? 'ring-2 ring-primary border-primary bg-secondary/30' : 'hover:bg-secondary/30 border-border'}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="font-medium text-foreground">{option.name}</div>
                                    <RadioGroupItem value={option.id} id={option.id} disabled={disabled} />
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
