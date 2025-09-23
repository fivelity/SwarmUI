import { useEffect, useState } from 'react';
import { listExtensions, installExtension, uninstallExtension, updateExtension } from '../../services/api';
import { Button } from '../core/Button';
import { ParameterGroup } from '../layout/ParameterGroup';

export const ExtensionsPanel = () => {
  const [installed, setInstalled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [needsRestart, setNeedsRestart] = useState(false);

  const fetchExtensions = async () => {
    const data = await listExtensions();
    setInstalled(data.installed);
    setAvailable(data.available);
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const handleAction = async (actionFunc, name) => {
    try {
      await actionFunc(name);
      setNeedsRestart(true);
      fetchExtensions(); // Refresh list after action
    } catch (error) {
      alert(`Error performing action: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {needsRestart && (
        <div className="card border-warning mb-3 p-4 rounded-lg">
          <h3 className="font-bold text-warning">New Extensions Installed/Updated</h3>
          <p>Changes will apply the next time you restart the SwarmUI server.</p>
          <Button onClick={() => alert('TODO: Implement server restart API call')}>Restart Now</Button>
        </div>
      )}

      <ParameterGroup title="Installed Extensions">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Version</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {installed.map(ext => (
              <tr key={ext.name} className="border-t border-border">
                <td className="px-4 py-2">{ext.name}</td>
                <td className="px-4 py-2">{ext.version}</td>
                <td className="px-4 py-2">{ext.author}</td>
                <td className="px-4 py-2">{ext.description}</td>
                <td className="px-4 py-2 flex gap-2">
                  {ext.canUpdate && <Button onClick={() => handleAction(updateExtension, ext.name)}>Update</Button>}
                  <Button onClick={() => handleAction(uninstallExtension, ext.name)}>Uninstall</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ParameterGroup>

      <ParameterGroup title="Available Extensions">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {available.map(ext => (
              <tr key={ext.name} className="border-t border-border">
                <td className="px-4 py-2">{ext.name}</td>
                <td className="px-4 py-2">{ext.author}</td>
                <td className="px-4 py-2">{ext.description}</td>
                <td className="px-4 py-2">
                  <Button onClick={() => handleAction(installExtension, ext.name)}>Install</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ParameterGroup>
    </div>
  );
};
