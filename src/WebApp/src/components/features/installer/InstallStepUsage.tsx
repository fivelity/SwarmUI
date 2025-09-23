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
            <CardDescription>Who is this SwarmUI installation going to be used by?</CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-4">
                {usageOptions.map(option => (
                    <div key={option.id} className="flex items-start space-x-2 p-4 rounded-md border border-input">
                        <RadioGroupItem value={option.id} id={option.id} disabled={option.disabled} />
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
