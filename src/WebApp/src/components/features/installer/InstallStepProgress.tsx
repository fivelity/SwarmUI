import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface InstallStepProgressProps {
    messages: string[];
    progress: number;
    stepProgress: number;
}

export const InstallStepProgress: React.FC<InstallStepProgressProps> = ({ messages, progress, stepProgress }) => {
    const [open, setOpen] = useState(true)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Installation in Progress</CardTitle>
                <CardDescription>Hang tight while we set everything up.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                            <span>Step Progress</span>
                            <span className="text-muted-foreground">{Math.round(stepProgress)}%</span>
                        </div>
                        <Progress value={stepProgress} />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                            <span>Overall Progress</span>
                            <span className="text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                </div>

                <Collapsible open={open} onOpenChange={setOpen}>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Live log output</div>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm">{open ? 'Hide Logs' : 'Show Logs'}</Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <div className="w-full rounded-lg border p-3 h-64 overflow-y-auto font-mono text-xs bg-card">
                            {messages.map((msg, i) => (
                                <div key={i} className="whitespace-pre-wrap">{msg}</div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )
}
