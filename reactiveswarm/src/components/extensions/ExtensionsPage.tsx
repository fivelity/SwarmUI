import { useEffect } from "react";
import { useExtensionStore } from "@/stores/extensionStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Trash2, Github, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ExtensionsPage() {
  const { 
      extensions, 
      isLoading, 
      installLog, 
      fetchExtensions, 
      installExtension, 
      uninstallExtension, 
      updateExtension 
  } = useExtensionStore();

  useEffect(() => {
      fetchExtensions();
  }, [fetchExtensions]);

  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Extensions</h2>
                    <p className="text-muted-foreground">Manage third-party plugins and tools.</p>
                </div>
                <Button onClick={() => fetchExtensions()} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 me-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extensions.map((ext) => (
                    <Card key={ext.id} className="flex flex-col h-full">
                        <div className="p-6 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{ext.name}</h3>
                                    <p className="text-xs text-muted-foreground">by {ext.author}</p>
                                </div>
                                {ext.isInstalled && (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                        Installed
                                    </Badge>
                                )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {ext.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="font-mono text-xs">v{ext.version}</Badge>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
                            <div className="flex gap-2">
                                {ext.githubUrl && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                        <a href={ext.githubUrl} target="_blank" rel="noreferrer">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                {ext.isInstalled ? (
                                    <>
                                        {ext.canUpdate && (
                                            <Button 
                                                size="sm" 
                                                variant="default"
                                                onClick={() => updateExtension(ext.id)}
                                            >
                                                Update
                                            </Button>
                                        )}
                                        <Button 
                                            variant="destructive" 
                                            size="icon"
                                            onClick={() => uninstallExtension(ext.id)}
                                            title="Uninstall"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        size="sm" 
                                        onClick={() => installExtension(ext.id)}
                                    >
                                        <Download className="w-4 h-4 me-2" />
                                        Install
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );
}
