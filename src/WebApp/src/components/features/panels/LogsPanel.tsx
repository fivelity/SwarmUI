import { useEffect, useState } from 'react';
import { Button } from '../core/Button';
import { ParameterGroup } from '../layout/ParameterGroup';
import { getLogs, submitLogsToPastebin } from '../../services/api';

export const LogsPanel = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [logLevel, setLogLevel] = useState('Info');
  const [pastebinUrl, setPastebinUrl] = useState('');

  const fetchLogs = async () => {
    const fetchedLogs = await getLogs(logLevel, filter);
    setLogs(fetchedLogs);
  };

  useEffect(() => {
    fetchLogs();
    // TODO: Implement WebSocket for real-time logs
    // const ws = new WebSocket('ws://localhost:7801/ws/logs');
    // ws.onmessage = (event) => setLogs(prev => [...prev, event.data]);
    // return () => ws.close();
  }, [logLevel, filter]);

  const handlePastebin = async () => {
    const payload = { logs: logs.join('\n') };
    try {
      const result = await submitLogsToPastebin(payload);
      setPastebinUrl(result.url);
    } catch (error) {
      alert(`Failed to submit logs: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ParameterGroup title="Server Logs">
        <div className="flex gap-2 mb-4">
          <label>View:</label>
          <select value={logLevel} onChange={e => setLogLevel(e.target.value)} className="bg-secondary border border-border rounded px-2 py-1">
            <option>Verbose</option>
            <option>Debug</option>
            <option>Info</option>
            <option>Warning</option>
            <option>Error</option>
            <option>Init</option>
          </select>
          <label>Filter:</label>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter logs..." className="bg-secondary border border-border rounded px-2 py-1 flex-grow" />
          <Button onClick={handlePastebin}>Pastebin</Button>
        </div>
        {pastebinUrl && <p className="text-sm text-success">Logs submitted: <a href={pastebinUrl} target="_blank" rel="noopener noreferrer">{pastebinUrl}</a></p>}
        <div className="bg-secondary border border-border rounded p-2 h-96 overflow-auto font-mono text-sm">
          {logs.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </ParameterGroup>
    </div>
  );
};
