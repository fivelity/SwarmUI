import { swarmApi } from "./apiClient";
import { useParameterStore } from "@/stores/parameterStore";
import { useGenerationStore } from "@/stores/generationStore";

export const generateImage = async () => {
  const params = useParameterStore.getState();
  const genStore = useGenerationStore.getState();

  if (genStore.isGenerating) return;

  try {
    genStore.setGenerating(true);
    genStore.setProgress(0, 0, params.steps);
    genStore.setCurrentImage(null);

    // Ensure WebSocket is connected before sending request if it's not
    // socketService.connect(); // This handles its own state check

    // Construct the payload.
    // NOTE: This structure matches typical SwarmUI/ComfyUI-backend expectations
    // but may need adjustment based on exact API docs.
    const payload = {
      prompt: params.prompt,
      negative_prompt: params.negativePrompt,
      seed: params.seed,
      steps: params.steps,
      cfg_scale: params.cfgScale,
      width: params.width,
      height: params.height,
      images: 1, // Batch size
      session_id: swarmApi.getSessionId() || "test-session",
      // ... other params
    };

    console.log("Sending Generation Request:", payload);

    // Call the API
    // The endpoint might be /API/GenerateText2Image or similar.
    const response = await swarmApi.post<{ id?: string }>("/GenerateText2Image", payload);

    console.log("Generation Request Sent, ID:", response.id);

    // The rest is handled by WebSocket updates (progress, image, etc.)

  } catch (error) {
    console.error("Generation failed:", error);
    genStore.setGenerating(false);
    // TODO: Show error toast
  }
};

export const cancelGeneration = async () => {
    try {
        await swarmApi.post("/Cancel", {});
        useGenerationStore.getState().setGenerating(false);
    } catch (error) {
        console.error("Failed to cancel generation:", error);
    }
}

export const interruptGeneration = async (includeOtherSessions: boolean = false) => {
    try {
        await swarmApi.post("/InterruptAll", { other_sessions: includeOtherSessions });
        // We don't necessarily set generating to false here, as backend will send events.
        // But for UI responsiveness we might want to.
        // However, interrupt just skips current. Queue might continue.
        // If we want to stop EVERYTHING, we usually Cancel.
        // SwarmUI distinction:
        // Interrupt: Stop current image, proceed to next in batch/queue.
        // Cancel: Stop current and clear queue (usually).
        // The API docs say "InterruptAll": Tell all waiting generations in this session or all sessions to interrupt.
        // Wait, "waiting generations... to interrupt".
        // Does it clear queue?
        // Usually Interrupt = Skip current.
        // SwarmUI might treat "InterruptAll" as "Stop everything".
        // Let's assume InterruptAll stops the current execution.
    } catch (error) {
        console.error("Failed to interrupt generation:", error);
    }
}
