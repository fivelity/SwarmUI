import { useTheme } from "next-themes";
import { useBackendStore } from "@/stores/backendStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { backendUrl, setBackendUrl, isConnected } = useBackendStore();

  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">Manage your ReactiveSwarm preferences.</p>
            </div>
            
            {/* Appearance Settings */}
            <div className="p-6 border border-border rounded-lg bg-card space-y-4">
                <h3 className="font-semibold text-lg">Appearance</h3>
                
                <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                        <Button 
                            variant={theme === 'light' ? 'default' : 'outline'} 
                            onClick={() => setTheme('light')}
                            className="flex-1"
                        >
                            <Sun className="w-4 h-4 me-2" />
                            Light
                        </Button>
                        <Button 
                            variant={theme === 'dark' ? 'default' : 'outline'} 
                            onClick={() => setTheme('dark')}
                            className="flex-1"
                        >
                            <Moon className="w-4 h-4 me-2" />
                            Dark
                        </Button>
                        <Button 
                            variant={theme === 'system' ? 'default' : 'outline'} 
                            onClick={() => setTheme('system')}
                            className="flex-1"
                        >
                            <Monitor className="w-4 h-4 me-2" />
                            System
                        </Button>
                    </div>
                </div>
            </div>

            {/* Server Settings */}
            <div className="p-6 border border-border rounded-lg bg-card space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Server</h3>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-muted-foreground">{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="backend-url">Backend URL</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="backend-url"
                            value={backendUrl}
                            onChange={(e) => setBackendUrl(e.target.value)}
                            placeholder="http://localhost:7801"
                        />
                        {/* A save button isn't strictly needed as state updates instantly, but good for UX if we were validating */}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        The URL where your SwarmUI backend is running.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
