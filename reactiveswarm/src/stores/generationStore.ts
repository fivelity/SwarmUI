import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GenerationState {
  isGenerating: boolean;
  progress: number; // 0-100
  currentImage: string | null; // Base64 or URL
  queuePosition: number;
  totalQueue: number;
  currentStep: number;
  totalSteps: number;
  lastSeed: number;

  setGenerating: (isGenerating: boolean) => void;
  setProgress: (progress: number, step?: number, total?: number) => void;
  setQueueStatus: (position: number, total: number) => void;
  setCurrentImage: (image: string | null) => void;
  setLastSeed: (seed: number) => void;
  resetStatus: () => void;
}

export const useGenerationStore = create<GenerationState>()(
  devtools(
    (set) => ({
      isGenerating: false,
      progress: 0,
      currentImage: null,
      queuePosition: 0,
      totalQueue: 0,
      currentStep: 0,
      totalSteps: 0,
      lastSeed: -1,

      setGenerating: (isGenerating) => set({ isGenerating }),
      setProgress: (progress, currentStep, totalSteps) => 
        set((state) => ({ 
          progress, 
          currentStep: currentStep ?? state.currentStep, 
          totalSteps: totalSteps ?? state.totalSteps 
        })),
      setQueueStatus: (queuePosition, totalQueue) => set({ queuePosition, totalQueue }),
      setCurrentImage: (currentImage) => set({ currentImage }),
      setLastSeed: (lastSeed) => set({ lastSeed }),
      resetStatus: () => set({ 
        isGenerating: false, 
        progress: 0, 
        queuePosition: 0, 
        currentStep: 0 
      }),
    }),
    { name: 'GenerationStore' }
  )
);
