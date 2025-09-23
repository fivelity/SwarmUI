import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listExtensions, installExtension, uninstallExtension, updateExtension, restart } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ParameterGroup } from '@/components/layout/ParameterGroup';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Extension {
    name: string;
    version: string;
    author: string;
    description: string;
    canUpdate: boolean;
}

export const ExtensionsPanel = () => {
  const { t } = useTranslation();
  const [installed, setInstalled] = useState<Extension[]>([]);
  const [available, setAvailable] = useState<Extension[]>([]);
  const [needsRestart, setNeedsRestart] = useState(false);

  const fetchExtensions = async () => {
    const data = await listExtensions();
    setInstalled(data.installed || []);
    setAvailable(data.available || []);
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const handleAction = async (actionFunc: (name: string) => Promise<any>, name: string) => {
    try {
      await actionFunc(name);
      setNeedsRestart(true);
      fetchExtensions(); // Refresh list after action
      toast.success(t('Successfully initiated action on extension, restart may be required.'));
    } catch (error: any) {
      toast.error(t('Error performing action on extension'), { description: error.message });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {needsRestart && (
        <div className="card border-yellow-500 border-2 mb-3 p-4 rounded-lg bg-gray-800">
          <h3 className="font-bold text-yellow-500">{t('New Extensions Installed/Updated')}</h3>
          <p>{t('Changes will apply the next time you restart the SwarmUI server.')}</p>
          <Button onClick={restart}>{t('Restart Now')}</Button>
        </div>
      )}

      <ParameterGroup title={t('Installed Extensions')}>
        <Table>
          <TableHeader><TableRow><TableHead>{t('Name')}</TableHead><TableHead>{t('Version')}</TableHead><TableHead>{t('Author')}</TableHead><TableHead>{t('Description')}</TableHead><TableHead className="text-right">{t('Actions')}</TableHead></TableRow></TableHeader>
          <TableBody>
            {installed.map(ext => (
              <TableRow key={ext.name}>
                <TableCell>{ext.name}</TableCell>
                <TableCell>{ext.version}</TableCell>
                <TableCell>{ext.author}</TableCell>
                <TableCell>{ext.description}</TableCell>
                <TableCell className="text-right space-x-2">
<>
                  {ext.canUpdate && <Button onClick={() => handleAction(updateExtension, ext.name)}>{t('Update')}</Button>}
                  <Button variant="destructive" onClick={() => handleAction(uninstallExtension, ext.name)}>{t('Uninstall')}</Button>
                </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ParameterGroup>

      <ParameterGroup title={t('Available Extensions')}>
        <Table>
          <TableHeader><TableRow><TableHead>{t('Name')}</TableHead><TableHead>{t('Author')}</TableHead><TableHead>{t('Description')}</TableHead><TableHead className="text-right">{t('Actions')}</TableHead></TableRow></TableHeader>
          <TableBody>
            {available.map(ext => (
              <TableRow key={ext.name}>
                <TableCell>{ext.name}</TableCell>
                <TableCell>{ext.author}</TableCell>
                <TableCell>{ext.description}</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => handleAction(installExtension, ext.name)}>{t('Install')}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ParameterGroup>
    </div>
  );
};
