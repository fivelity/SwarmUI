import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface InstallStepLicenseProps {
    onNext: () => void;
}

export const InstallStepLicense: React.FC<InstallStepLicenseProps> = ({ onNext }) => (
    <Card>
        <CardHeader>
            <CardTitle>Before You Continue</CardTitle>
            <CardDescription>Please review the license information. You can view full terms anytime from the app menu.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Model Licenses</div>
                <p className="text-foreground">AI image generation models are licensed by their creators. Many are free for personal use; commercial use may be restricted depending on the model.</p>
                <p className="text-foreground">Please ensure any models you download comply with your intended use.</p>
            </div>
            <div className="space-y-3">
                <div className="text-sm text-muted-foreground">SwarmUI License</div>
                <p className="text-foreground">SwarmUI is open source and available under the MIT License.</p>
                <div>
                    <a href="https://github.com/mcmonkeyprojects/SwarmUI/blob/master/LICENSE.txt" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">View MIT License</Button>
                    </a>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button onClick={onNext}>I Agree</Button>
        </CardFooter>
    </Card>
);
