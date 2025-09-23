import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface InstallStepLicenseProps {
    onNext: () => void;
}

export const InstallStepLicense: React.FC<InstallStepLicenseProps> = ({ onNext }) => (
    <Card>
        <CardHeader>
            <CardTitle>Legal Notice</CardTitle>
            <CardDescription>Please read the license agreements before proceeding.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <p>AI Image Generation models are subject to licensing defined by the model creator. Generally all are free for personal usage, but commercial usage may come under restrictions depending on the model.</p>
            <p>SwarmUI itself is free for any usage under the <a href="https://github.com/mcmonkeyprojects/SwarmUI/blob/master/LICENSE.txt" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">MIT License</a>.</p>
            <p>By using this software you agree to follow its license and the applicable licenses of any models included or separately downloaded.</p>
            {/* TODO: Add dynamic warnings for Python/Git if needed */}
        </CardContent>
        <CardFooter>
            <Button onClick={onNext}>I Agree</Button>
        </CardFooter>
    </Card>
);
