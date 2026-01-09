export function ComfyUIFrame() {
  return (
    <div className="h-full w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none"></div>
        <div className="text-center space-y-4 z-10">
            <h2 className="text-2xl font-bold">ComfyUI Workflow</h2>
            <p className="text-muted-foreground">Backend integration coming in Phase 2.</p>
            <div className="p-4 bg-muted/20 border border-border rounded-lg text-sm font-mono text-muted-foreground">
                iframe src="/ComfyBackendDirect/"
            </div>
        </div>
    </div>
  );
}
