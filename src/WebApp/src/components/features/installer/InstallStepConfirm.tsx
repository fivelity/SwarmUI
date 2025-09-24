import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InstallSelections } from '@/types/installer';
import { getThemeById } from '@/themes';

interface InstallStepConfirmProps {
    selections: InstallSelections;
    onBack: () => void;
    onSubmit: () => void;
}

export const InstallStepConfirm: React.FC<InstallStepConfirmProps> = ({ selections, onBack, onSubmit }) => {
    const theme = getThemeById(selections.theme);
    const usageLabel: Record<string, string> = {
        just_self: 'Just Yourself (Local Only)',
        just_self_lan: 'Just Yourself (LAN Enabled)',
        friends_and_family: 'Friends & Family (WIP)'
    };
    const backendLabel: Record<string, string> = {
        comfyui: 'ComfyUI (Local)',
        none: 'None / Custom / Later'
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review & Confirm</CardTitle>
                <CardDescription>Double‑check your setup. You can adjust settings later in the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Theme</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{theme?.name ?? selections.theme}</Badge>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded border border-border" style={{ background: theme?.colors.background }} />
                                <div className="w-3 h-3 rounded border border-border" style={{ background: theme?.colors.primary }} />
                                <div className="w-3 h-3 rounded border border-border" style={{ background: theme?.colors.accent }} />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Usage Scenario</div>
                        <Badge variant="secondary">{usageLabel[selections.installed_for] ?? selections.installed_for}</Badge>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Backend</div>
                        <Badge variant="secondary">{backendLabel[selections.backend] ?? selections.backend}</Badge>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground mb-1">Models</div>
                        <div className="flex flex-wrap gap-2">
                            {(selections.models?.length ? selections.models : ['None']).map(m => (
                                <Badge key={m} variant={m === 'None' ? 'outline' : 'secondary'}>{m}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={onBack}>Back</Button>
                <Button onClick={onSubmit}>Install Now</Button>
            </CardFooter>
        </Card>
    );
};
