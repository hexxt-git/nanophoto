import * as React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PhotoshootMode =
  | "Portraits"
  | "Landscapes"
  | "Street"
  | "Product"
  | "Events"
  | "Food"
  | "Other";
export type AspectRatioKey = "9:16" | "3:4" | "1:1" | "4:3" | "4:5" | "16:9";
export type ConstraintKey = "background" | "props" | "lighting";

interface SettingsState {
  // Camera settings
  flipped: boolean;
  aspectRatio: AspectRatioKey;
  showGuidelines: boolean;

  // Constraints (none by default) - add items to restrict environment edits
  constraints: ConstraintKey[];

  // Shooting mode
  mode: PhotoshootMode;

  setFlipped: (v: boolean) => void;
  setAspectRatio: (r: AspectRatioKey) => void;
  setShowGuidelines: (v: boolean) => void;
  addConstraint: (c: ConstraintKey) => void;
  removeConstraint: (c: ConstraintKey) => void;
  clearConstraints: () => void;
  setMode: (m: PhotoshootMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      flipped: true,
      aspectRatio: "3:4",
      showGuidelines: false,

      constraints: [],

      mode: "Other",

      setFlipped: (v) => set({ flipped: v }),
      setAspectRatio: (r) => set({ aspectRatio: r }),
      setShowGuidelines: (v) => set({ showGuidelines: v }),
      addConstraint: (c) =>
        set((s) =>
          s.constraints.includes(c) ? s : { constraints: [...s.constraints, c] }
        ),
      removeConstraint: (c) =>
        set((s) => ({ constraints: s.constraints.filter((k) => k !== c) })),
      clearConstraints: () => set({ constraints: [] }),
      setMode: (m) => set({ mode: m }),
    }),
    {
      name: "nano-photo-settings",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Prevent SSR hydration mismatches; we will rehydrate on client
      skipHydration: true,
      partialize: (state) => ({
        flipped: state.flipped,
        aspectRatio: state.aspectRatio,
        showGuidelines: state.showGuidelines,
        constraints: state.constraints,
        mode: state.mode,
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
