export function SettingsPage() {
  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">Manage your ReactiveSwarm preferences.</p>
            </div>
            
            <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold mb-4">Appearance</h3>
                <p className="text-sm text-muted-foreground">Theme customization is handled via the ThemeProvider.</p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold mb-4">Server</h3>
                <p className="text-sm text-muted-foreground">Connected to: http://localhost:7801</p>
            </div>
        </div>
    </div>
  );
}
