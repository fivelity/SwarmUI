import { useState, useCallback } from 'react';

const CIVITAI_API_PROXY = '/API/Downloader/ProxyCivitai';

export const useCivitai = () => {
    const [metadata, setMetadata] = useState(null);
    const [status, setStatus] = useState('Idle');
    const [error, setError] = useState(null);

    const parseCivitaiUrl = (url) => {
        const match = url.match(/civitai.com\/models\/(\d+)(?:.*modelVersionId=(\d+))?/);
        if (!match) return [null, null];
        return [match[1], match[2] || null];
    };

    const fetchMetadata = useCallback(async (url) => {
        setStatus('Loading...');
        setError(null);
        setMetadata(null);

        const [modelId, modelVersionId] = parseCivitaiUrl(url);

        if (!modelId) {
            setStatus('Invalid Civitai URL');
            setError('Could not parse model ID from URL.');
            return;
        }

        try {
            const modelResponse = await fetch(`${CIVITAI_API_PROXY}/v1/models/${modelId}`);
            if (!modelResponse.ok) throw new Error('Failed to fetch model data.');
            const modelData = await modelResponse.json();

            let versionData;
            if (modelVersionId) {
                const versionResponse = await fetch(`${CIVITAI_API_PROXY}/v1/model-versions/${modelVersionId}`);
                if (!versionResponse.ok) throw new Error('Failed to fetch model version data.');
                versionData = await versionResponse.json();
            } else {
                versionData = modelData.modelVersions[0];
            }

            setMetadata({ model: modelData, version: versionData });
            setStatus('Metadata loaded successfully.');
        } catch (e) {
            setStatus('Failed to load metadata.');
            setError(e.message);
            console.error(e);
        }
    }, []);

    return { metadata, status, error, fetchMetadata };
};