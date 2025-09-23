import { useState, useEffect, ChangeEvent } from 'react';
import { useCivitai } from '@/hooks/useCivitai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ParameterGroup } from '@/components/layout/ParameterGroup';

export interface CivitaiModel {
    id: number;
    name: string;
    creator: { username: string };
    type: string;
}

export interface CivitaiVersion {
    id: number;
    name: string;
    description: string;
    files: { name: string }[];
}

export interface CivitaiMetadata {
    model: CivitaiModel;
    version: CivitaiVersion;
}
import { startDownload, getDownloadStatus } from '@/services/api';

export const ModelDownloader = () => {
    const [url, setUrl] = useState<string>('');
    const [saveAs, setSaveAs] = useState<string>('');
    const [modelType, setModelType] = useState<string>('Stable-Diffusion');
        const { metadata, status: civitaiStatus, error: civitaiError, fetchMetadata } = useCivitai() as { metadata: CivitaiMetadata | null, status: string, error: string | null, fetchMetadata: (url: string) => void };
    const [downloadId, setDownloadId] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [downloadStatus, setDownloadStatus] = useState<string>('');

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        if (newUrl.includes('civitai.com')) {
            fetchMetadata(newUrl);
        }
    };

    const handleDownload = async () => {
        if (!metadata) {
            alert('Please load model metadata first.');
            return;
        }
        setDownloadProgress(0);
        setDownloadStatus('Initiating...');
        try {
            const result = await startDownload(url, modelType, saveAs || metadata.version.files[0].name.replace(/\.safetensors|\.pt/g, ''));
            setDownloadId(result.download_id);
            const pollInterval = setInterval(async () => {
                const statusResult = await getDownloadStatus(result.download_id);
                if (statusResult) {
                    setDownloadProgress(statusResult.progress);
                    setDownloadStatus(statusResult.status);
                    if (statusResult.status === 'Completed' || statusResult.status === 'Failed') {
                        clearInterval(pollInterval);
                        setDownloadId(null);
                    }
                }
            }, 1000);
        } catch (e: any) {
            setDownloadStatus(`Error: ${e.message}`);
        }
    };

    useEffect(() => {
        if (metadata) {
            setSaveAs(metadata.version.files[0].name.replace(/\.safetensors|\.pt/g, ''));
            setModelType(metadata.model.type);
        }
    }, [metadata]);

    return (
        <ParameterGroup title="Model Downloader">
            <div className="flex flex-col gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="model-url">Model URL</Label>
                    <Input id="model-url" type="text" value={url} onChange={handleUrlChange} placeholder="https://civitai.com/models/12345" />
                    <p className="text-sm text-muted-foreground">Status: {civitaiStatus}</p>
                    {civitaiError && <p className="text-sm text-destructive">Error: {civitaiError}</p>}
                </div>

                {metadata && (
                    <Card>
                        <CardHeader>
                                <CardTitle>{metadata.model.name}</CardTitle>
                                <CardDescription>Creator: {metadata.model.creator.username}</CardDescription>
                            </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="text-sm prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: metadata.version.description }}></div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="model-type">Model Type</Label>
                                <Select value={modelType} onValueChange={setModelType}>
                                    <SelectTrigger id="model-type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Stable-Diffusion">Base Model</SelectItem>
                                        <SelectItem value="LoRA">LoRA</SelectItem>
                                        <SelectItem value="VAE">VAE</SelectItem>
                                        <SelectItem value="Embedding">Embedding</SelectItem>
                                        <SelectItem value="ControlNet">ControlNet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="save-as">Save As</Label>
                                <Input id="save-as" type="text" value={saveAs} onChange={e => setSaveAs(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-2">
                            <Button onClick={handleDownload} disabled={downloadId !== null} className="w-full">
                                {downloadId ? 'Downloading...' : 'Download'}
                            </Button>
                            {downloadId && (
                                <div className="w-full">
                                    <p className="text-sm text-muted-foreground">{downloadStatus} ({downloadProgress.toFixed(2)}%)</p>
                                    <Progress value={downloadProgress} className="w-full" />
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                )}
            </div>
        </ParameterGroup>
    );
};