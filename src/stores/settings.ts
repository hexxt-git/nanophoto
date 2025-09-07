import * as React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PhotoshootMode = "social" | "pro" | "practice";
export type AspectRatioKey = "9:16" | "3:4" | "1:1" | "4:3" | "4:5" | "16:9";

interface SettingsState {
  flipped: boolean;
  lighting: number; // -100..100 exposure intent
  propsEnabled: boolean;
  outfitsEnabled: boolean;
  mode: PhotoshootMode;
  aspectRatio: AspectRatioKey;

  setFlipped: (v: boolean) => void;
  setLighting: (v: number) => void;
  setPropsEnabled: (v: boolean) => void;
  setOutfitsEnabled: (v: boolean) => void;
  setMode: (m: PhotoshootMode) => void;
  setAspectRatio: (r: AspectRatioKey) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      flipped: true,
      lighting: 0,
      propsEnabled: false,
      outfitsEnabled: false,
      mode: "social",
      aspectRatio: "3:4",

      setFlipped: (v) => set({ flipped: v }),
      setLighting: (v) => set({ lighting: Math.max(-100, Math.min(100, v)) }),
      setPropsEnabled: (v) => set({ propsEnabled: v }),
      setOutfitsEnabled: (v) => set({ outfitsEnabled: v }),
      setMode: (m) => set({ mode: m }),
      setAspectRatio: (r) => set({ aspectRatio: r }),
    }),
    {
      name: "nano-photo-settings",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Prevent SSR hydration mismatches; we will rehydrate on client
      skipHydration: true,
      partialize: (state) => ({
        flipped: state.flipped,
        lighting: state.lighting,
        propsEnabled: state.propsEnabled,
        outfitsEnabled: state.outfitsEnabled,
        mode: state.mode,
        aspectRatio: state.aspectRatio,
      }),
    }
  )
);

export function useSettingsHydrated() {
  const [hydrated, setHydrated] = React.useState<boolean>(
    (useSettingsStore.persist as any)?.hasHydrated?.() ?? false
  );
  React.useEffect(() => {
    const persistApi: any = useSettingsStore.persist;
    const unsub = persistApi?.onFinishHydration?.(() => setHydrated(true));
    if (!persistApi?.hasHydrated?.()) {
      persistApi?.rehydrate?.();
    }
    return () => {
      unsub?.();
    };
  }, []);
  return hydrated;
}
