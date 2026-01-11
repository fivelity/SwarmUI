import { useEffect, useState } from "react";
import { useExtensionStore } from "@/stores/useExtensionStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Trash2, AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

export function ExtensionsPage() {
  const {
    isLoading,
    installLog,
    serverUpdatesCount,
    serverUpdatesPreview,
    extensionUpdates,
    backendUpdates,
    checkForUpdates,
    installExtension,
    uninstallExtension,
    updateExtension,
    updateAndRestart,
  } = useExtensionStore();

  const [extensionName, setExtensionName] = useState("");

  useEffect(() => {
      checkForUpdates();
  }, [checkForUpdates]);

  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Extensions</h2>
                    <p className="text-muted-foreground">Manage third-party plugins and tools.</p>
                </div>
                <Button onClick={() => checkForUpdates()} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 me-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Core updates</div>
                    <div className="text-2xl font-bold">{serverUpdatesCount}</div>
                    {serverUpdatesPreview.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                            {serverUpdatesPreview.slice(0, 3).map((s) => (
                                <div key={s} className="truncate">{s}</div>
                            ))}
                        </div>
                    )}
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Extension updates</div>
                    <div className="text-2xl font-bold">{extensionUpdates.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Backend updates</div>
                    <div className="text-2xl font-bold">{backendUpdates.length}</div>
                </Card>
            </div>

            <Card className="p-6 space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">Extension Actions</h3>
                    <p className="text-sm text-muted-foreground">SwarmUI does not expose a list of known/installed extensions via API. Use the exact extension name.</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        value={extensionName}
                        onChange={(e) => setExtensionName(e.target.value)}
                        placeholder="ExtensionName (exact)"
                    />
                    <Button onClick={() => installExtension(extensionName)} disabled={!extensionName || isLoading}>
                        <Download className="w-4 h-4 me-2" />
                        Install
                    </Button>
                    <Button onClick={() => updateExtension(extensionName)} disabled={!extensionName || isLoading} variant="secondary">
                        <RotateCcw className="w-4 h-4 me-2" />
                        Update
                    </Button>
                    <Button onClick={() => uninstallExtension(extensionName)} disabled={!extensionName || isLoading} variant="destructive">
                        <Trash2 className="w-4 h-4 me-2" />
                        Uninstall
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => updateAndRestart({ force: true })} disabled={isLoading} variant="outline">
                        Restart Server
                    </Button>
                    <Button onClick={() => updateAndRestart({ updateExtensions: true, force: false })} disabled={isLoading} variant="outline">
                        Update Extensions + Restart
                    </Button>
                </div>
            </Card>

            {installLog.length > 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Installation Log</AlertTitle>
                    <AlertDescription className="font-mono text-xs mt-2 max-h-24 overflow-y-auto">
                        {installLog.map((log, i) => (
                            <div key={i}>{log}</div>
                        ))}
                    </AlertDescription>
                </Alert>
            )}

            {extensionUpdates.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Extensions with updates available</h3>
                        <Badge variant="secondary">{extensionUpdates.length}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {extensionUpdates.map((name) => (
                            <Button key={name} size="sm" variant="secondary" onClick={() => updateExtension(name)} disabled={isLoading}>
                                Update {name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
