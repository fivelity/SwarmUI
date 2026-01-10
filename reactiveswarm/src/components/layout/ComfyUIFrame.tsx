import { ComfyOverlay } from "@/components/comfy/ComfyOverlay";
import { useBackendStore } from "@/stores/backendStore";
import { resolveSwarmUiUrl } from "@/lib/config/swarmEndpoints";

export function ComfyUIFrame() {
  const backendUrl = useBackendStore((s) => s.backendUrl);
  const src = resolveSwarmUiUrl("ComfyBackendDirect/", backendUrl);

  return (
    <div className="h-full w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <ComfyOverlay />
        
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 z-10">
          <iframe
            title="ComfyUI Backend"
            src={src}
            className="w-full h-full border-0 pointer-events-auto"
          />
        </div>
    </div>
  );
}
