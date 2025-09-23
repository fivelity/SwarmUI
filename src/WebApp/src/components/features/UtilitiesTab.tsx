import { Tabs, Tab } from '../core/Tabs';
import { Button } from '../core/Button';
import { ParameterGroup } from '../layout/ParameterGroup';
import { useState } from 'react';
import { tokenize } from '../../services/api';

const InfoTab = () => (
  <div className="max-w-xl flex flex-col gap-4">
    <ParameterGroup title="Utilities">
      <p className="text-text/70">The "Utilities" tab provides a variety of general utilities and tools in the sub-tabs, and the quick-tools below.</p>
    </ParameterGroup>
    <ParameterGroup title="Metadata Utilities">
      <p className="text-text/70">If you click this button, all Model and Image metadata datastores will be reset, and they will be reloaded from source files. This is useful for example if you've externally modified your model or image files and want to clean out or update Swarm's metadata tracking.</p>
      <div className="flex justify-center">
        <Button onClick={() => alert('TODO: Call ResetAllMetadata API')}>Reset All Metadata</Button>
      </div>
    </ParameterGroup>
  </div>
);

const ClipTokenizerTab = () => {
  const [text, setText] = useState('');
  const [tokens, setTokens] = useState([]);

  const handleTokenize = async () => {
    const result = await tokenize(text);
    setTokens(result);
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <ParameterGroup title="CLIP Tokenizer">
        <p className="text-text/70">This is a tool to analyze CLIP tokenization for Stable Diffusion models. Simply type some text in the box below to see how it gets tokenized.</p>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={3} className="bg-secondary border border-border rounded px-2 py-1 w-full" />
        <Button onClick={handleTokenize}>Tokenize</Button>
        {tokens.length > 0 &&
          <div className="p-2 bg-secondary rounded-lg flex flex-wrap gap-1">
            {tokens.map(token => (
              <div key={token.id} className="border border-border rounded p-1 text-sm">
                <span className="font-bold">{token.text}</span> <span className="text-text/50">({token.id})</span>
              </div>
            ))}
          </div>
        }
      </ParameterGroup>
    </div>
  );
};

import { ModelDownloader } from './tools/ModelDownloader';

const PlaceholderTab = ({ name }) => (
    <div className="max-w-xl"><ParameterGroup title={name}><p>This feature has not been implemented in the new UI yet.</p></ParameterGroup></div>
);

export const UtilitiesTab = () => {
  return (
    <Tabs>
      <Tab label="Info">
        <InfoTab />
      </Tab>
      <Tab label="CLIP Tokenizer">
        <ClipTokenizerTab />
      </Tab>
      <Tab label="Pickle To Safetensors">
        <PickleToSafetensorsPanel />
      </Tab>
      <Tab label="LoRA Extractor">
        <LoRAExtractorPanel />
      </Tab>
      <Tab label="Model Downloader">
        <PlaceholderTab name="Model Downloader" />
      </Tab>
    </Tabs>
  );
};
Downloader">
        <PlaceholderTab name="Model Downloader" />
      </Tab>
    </Tabs>
  );
};
        <PlaceholderTab name="Model Downloader" />
      </Tab>
    </Tabs>
  );
};
