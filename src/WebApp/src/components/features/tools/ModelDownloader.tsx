import { useState } from 'react';
import { useCivitai } from '../../hooks/useCivitai';
import { Button } from '../core/Button';
import { TextInput } from '../core/TextInput';
import { Select } from '../core/Select';
import { ParameterGroup } from '../layout/ParameterGroup';
import { startDownload, getDownloadStatus } from '../../services/api';

export const ModelDownloader = () => {
    const [url, setUrl] = useState('');
    const [saveAs, setSaveAs] = useState('');
    const [modelType, setModelType] = useState('Stable-Diffusion'); // Default type
    const { metadata, status: civitaiStatus, error: civitaiError, fetchMetadata } = useCivitai();
    const [downloadId, setDownloadId] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStatus, setDownloadStatus] = useState('');

    const handleUrlChange = (e) => {
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
            const result = await startDownload(url, modelType, saveAs || metadata.version.files[0].name.replace('.safetensors', ''));
            setDownloadId(result.download_id);
            // Start polling for status
            const pollInterval = setInterval(async () => {
                const statusResult = await getDownloadStatus(result.download_id);
                if (statusResult) {
                    setDownloadProgress(statusResult.progress);
                    setDownloadStatus(statusResult.status);
                    if (statusResult.status === 'Completed' || statusResult.status === 'Failed') {
                        clearInterval(pollInterval);
                        setDownloadId(null); // Clear download ID after completion
                    }
                }
            }, 1000);
        } catch (e) {
            setDownloadStatus(`Error: ${e.message}`);
        }
    };

    useEffect(() => {
        if (metadata) {
            setSaveAs(metadata.version.files[0].name.replace('.safetensors', ''));
            setModelType(metadata.model.type); // Set model type from metadata
        }
    }, [metadata]);

    return (
        <ParameterGroup title="Model Downloader">
            <div className="flex flex-col gap-4">
                <div>
                    <label>Model URL</label>
                    <TextInput type="text" value={url} onChange={handleUrlChange} placeholder="https://civitai.com/models/12345" />
                    <p className="text-sm text-text/70">Status: {civitaiStatus}</p>
                    {civitaiError && <p className="text-sm text-danger">Error: {civitaiError}</p>}
                </div>

                {metadata && (
                    <div className="border border-border p-4 rounded-lg bg-secondary flex flex-col gap-2">
                        <h3 className="text-lg font-bold">{metadata.model.name}</h3>
                        <p className="text-sm">Type: <span className="font-semibold">{metadata.model.type}</span></p>
                        <p className="text-sm">Creator: <span className="font-semibold">{metadata.model.creator.username}</span></p>
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: metadata.version.description }}></div>
                        
                        <div className="mt-4">
                            <label>Model Type</label>
                            <Select value={modelType} onChange={e => setModelType(e.target.value)}>
                                <option value="Stable-Diffusion">Base Model</option>
                                <option value="LoRA">LoRA</option>
                                <option value="VAE">VAE</option>
                                <option value="Embedding">Embedding</option>
                                <option value="ControlNet">ControlNet</option>
                            </Select>
                        </div>
                        <div className="mt-2">
                            <label>Save as</label>
                            <TextInput type="text" value={saveAs} onChange={e => setSaveAs(e.target.value)} />
                        </div>
                        <Button className="mt-2" onClick={handleDownload} disabled={downloadId !== null}>Download</Button>
                        {downloadId && (
                            <div className="mt-2">
                                <p>Download Status: {downloadStatus} ({downloadProgress}%)</p>
                                <progress className="w-full" value={downloadProgress} max="100"></progress>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ParameterGroup>
    );
};