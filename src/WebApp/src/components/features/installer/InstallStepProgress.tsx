import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface InstallStepProgressProps {
    messages: string[];
    progress: number;
    stepProgress: number;
}

export const InstallStepProgress: React.FC<InstallStepProgressProps> = ({ messages, progress, stepProgress }) => (
    <Card>
        <CardHeader>
            <CardTitle>Installation in Progress</CardTitle>
            <CardDescription>Please wait while SwarmUI is being installed...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <div className="w-full bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {messages.map((msg, i) => (
                    <div key={i}>{msg}</div>
                ))}
            </div>
            <div>
                <p className="text-sm mb-1">Step Progress</p>
                <Progress value={stepProgress} />
            </div>
            <div>
                <p className="text-sm mb-1">Overall Progress</p>
                <Progress value={progress} />
            </div>
        </CardContent>
    </Card>
);
