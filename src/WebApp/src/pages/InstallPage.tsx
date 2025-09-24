import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { InstallStepLicense } from '@/components/features/installer/InstallStepLicense';
import { InstallStepThemes } from '@/components/features/installer/InstallStepThemes';
import { InstallStepUsage } from '@/components/features/installer/InstallStepUsage';
import { InstallStepBackend } from '@/components/features/installer/InstallStepBackend';
import { InstallStepModels } from '@/components/features/installer/InstallStepModels';
import { InstallStepConfirm } from '@/components/features/installer/InstallStepConfirm';
import { InstallStepProgress } from '@/components/features/installer/InstallStepProgress';
import { InstallSelections } from '@/types/installer';
import { getNewSession } from '@/services/api';

export default function InstallPage() {
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState<InstallSelections>({
        theme: 'modern_dark',
        installed_for: 'just_self',
        backend: 'comfyui',
        models: ['sdxl1'],
        install_amd: false, // TODO: Add UI for this
        make_shortcut: true, // TODO: Add UI for this
        language: 'en',
    });
    const [installMessages, setInstallMessages] = useState<string[]>([]);
    const [installProgress, setInstallProgress] = useState(0);
    const [installStepProgress, setInstallStepProgress] = useState(0);

    const handleSelection = (key: keyof InstallSelections, value: any) => {
        setSelections(prev => ({ ...prev, [key]: value }));
    };

    const handleModelSelection = (modelId: string, isChecked: boolean) => {
        setSelections(prev => ({
            ...prev,
            models: isChecked ? [...prev.models, modelId] : prev.models.filter(id => id !== modelId),
        }));
    };

    const handleSubmit = async () => {
        setStep(steps.length - 1); // Go to progress screen
        // Ensure we have a session for legacy API websocket route
        let session_id = localStorage.getItem('session_id');
        if (!session_id) {
            const sess = await getNewSession();
            if (sess && sess.session_id) {
                session_id = sess.session_id;
                localStorage.setItem('session_id', session_id);
            } else {
                setInstallMessages(prev => [...prev, 'ERROR: Failed to obtain a session. Check server logs.']);
                return;
            }
        }

        const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws = new WebSocket(`${proto}://${window.location.host}/API/InstallConfirmWS`);
        ws.onopen = () => {
            const payload = {
                session_id,
                theme: selections.theme,
                installed_for: selections.installed_for,
                backend: selections.backend,
                models: selections.models.join(','),
                install_amd: selections.install_amd,
                language: selections.language,
                make_shortcut: selections.make_shortcut,
            };
            ws.send(JSON.stringify(payload));
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.info) {
                setInstallMessages(prev => [...prev, data.info]);
            }
            if ('progress' in data) {
                setInstallProgress(data.total === 0 ? 0 : (data.progress / data.total) * 100);
                setInstallStepProgress(data.total_steps === 0 ? 0 : (data.steps / data.total_steps) * 100);
            }
            if (data.success) {
                window.location.href = '/';
            }
            if (data.error) {
                setInstallMessages(prev => [...prev, `ERROR: ${data.error}`]);
            }
        };
        ws.onerror = (err) => {
            setInstallMessages(prev => [...prev, `WebSocket Error: ${err}`]);
        };
    };

    const steps = useMemo(() => [
        <InstallStepLicense onNext={() => setStep(1)} />,
        <InstallStepThemes value={selections.theme} onChange={(v: string) => handleSelection('theme', v)} />,
        <InstallStepUsage value={selections.installed_for} onChange={(v: string) => handleSelection('installed_for', v)} />,
        <InstallStepBackend value={selections.backend} onChange={(v: string) => handleSelection('backend', v)} />,
        <InstallStepModels values={selections.models} onCheckedChange={handleModelSelection} />,
        <InstallStepConfirm selections={selections} onBack={() => setStep(step - 1)} onSubmit={handleSubmit} />,
        <InstallStepProgress messages={installMessages} progress={installProgress} stepProgress={installStepProgress} />
    ], [selections, installMessages, installProgress, installStepProgress]);

    const CurrentStepComponent = steps[step];

    const canGoNext = () => {
        // TODO: Add validation logic per step
        return true;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center">SwarmUI Installer</h1>
                {CurrentStepComponent}
                {step < steps.length - 2 && // Hide on confirm and progress screens
                    <div className="flex justify-between mt-4">
                        <Button onClick={() => setStep(step - 1)} disabled={step === 0}>Back</Button>
                        <span>Step {step + 1} of {steps.length - 1}</span>
                        <Button onClick={() => setStep(step + 1)} disabled={!canGoNext() || step >= steps.length - 2}>Next</Button>
                    </div>
                }
            </div>
        </div>
    );
}
