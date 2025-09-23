import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { InstallSelections } from '@/types/installer';

interface InstallStepConfirmProps {
    selections: InstallSelections;
    onBack: () => void;
    onSubmit: () => void;
}

export const InstallStepConfirm: React.FC<InstallStepConfirmProps> = ({ selections, onBack, onSubmit }) => (
    <Card>
        <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>Review your selections before starting the installation. You can change these settings later.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Theme:</span> {selections.theme}</li>
                <li><span className="font-semibold">Usage Scenario:</span> {selections.installed_for}</li>
                <li><span className="font-semibold">Backend:</span> {selections.backend}</li>
                <li><span className="font-semibold">Models to Download:</span> {selections.models.join(', ') || 'None'}</li>
                {/* TODO: Add AMD and Shortcut options */}
            </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={onBack}>Back</Button>
            <Button onClick={onSubmit}>Yes, I'm sure (Install Now)</Button>
        </CardFooter>
    </Card>
);
