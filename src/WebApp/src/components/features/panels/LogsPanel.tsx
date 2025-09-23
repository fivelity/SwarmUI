import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { getLogs, submitLogsToPastebin } from '@/services/api';

export const LogsPanel = () => {
  const { t } = useTranslation();
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
    } catch (error: any) {
      alert(`${t('Failed to submit logs')}: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ParameterGroup title={t('Server Logs')}>
        <div className="flex items-end gap-2 mb-4">
          <div className="grid gap-1.5">
            <Label htmlFor="log-level">{t('View')}</Label>
            <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger id="log-level" className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Verbose">Verbose</SelectItem>
                    <SelectItem value="Debug">Debug</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Error">Error</SelectItem>
                    <SelectItem value="Init">Init</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 flex-grow">
            <Label htmlFor="log-filter">{t('Filter')}</Label>
            <Input id="log-filter" type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder={t('Filter logs...')} />
          </div>
          <Button onClick={handlePastebin}>{t('Pastebin')}</Button>
        </div>
        {pastebinUrl && <p className="text-sm text-green-500">{t('Logs submitted')}: <a href={pastebinUrl} target="_blank" rel="noopener noreferrer" className="underline">{pastebinUrl}</a></p>}
        <ScrollArea className="h-96 w-full rounded-md border p-4 font-mono text-sm">
          {logs.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </ScrollArea>
      </ParameterGroup>
    </div>
  );
};
