import { ComfyOverlay } from "@/components/comfy/ComfyOverlay";

export function ComfyUIFrame() {
  return (
    <div className="h-full w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <ComfyOverlay />
        
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none"></div>
        <div className="text-center space-y-4 z-10">
            <h2 className="text-2xl font-bold">ComfyUI Workflow</h2>
            <p className="text-muted-foreground">Backend integration coming in Phase 2.</p>
            <div className="p-4 bg-muted/20 border border-border rounded-lg text-sm font-mono text-muted-foreground w-[600px] h-[400px] flex items-center justify-center mx-auto">
                <iframe 
                    title="ComfyUI Backend"
                    src="http://localhost:8188" 
                    className="w-full h-full border-0 opacity-50" 
                    style={{ pointerEvents: 'none' }} // Disabled for mock
                />
            </div>
            <p className="text-xs text-muted-foreground">Connecting to localhost:8188 (Default ComfyUI port)</p>
        </div>
    </div>
  );
}
