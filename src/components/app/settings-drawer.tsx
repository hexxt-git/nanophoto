import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  useSettingsStore,
  useSettingsHydrated,
  type PhotoshootMode,
  type AspectRatioKey,
} from "@/stores/settings";
import { FaLightbulb, FaTshirt, FaCubes } from "react-icons/fa";
import { MdFlipCameraAndroid } from "react-icons/md";
import { cn } from "@/lib/utils";

function ModePill({
  value,
  active,
  onClick,
}: {
  value: PhotoshootMode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-sm border",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background hover:bg-accent"
      )}
    >
      {value}
    </button>
  );
}

export function SettingsDrawer({ trigger }: { trigger: React.ReactNode }) {
  const hydrated = useSettingsHydrated();
  const flipped = useSettingsStore((s) => s.flipped);
  const setFlipped = useSettingsStore((s) => s.setFlipped);
  const lighting = useSettingsStore((s) => s.lighting);
  const setLighting = useSettingsStore((s) => s.setLighting);
  const propsEnabled = useSettingsStore((s) => s.propsEnabled);
  const setPropsEnabled = useSettingsStore((s) => s.setPropsEnabled);
  const outfitsEnabled = useSettingsStore((s) => s.outfitsEnabled);
  const setOutfitsEnabled = useSettingsStore((s) => s.setOutfitsEnabled);
  const mode = useSettingsStore((s) => s.mode);
  const setMode = useSettingsStore((s) => s.setMode);
  const aspectRatio = useSettingsStore((s) => s.aspectRatio);
  const setAspectRatio = useSettingsStore((s) => s.setAspectRatio);

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>App preferences</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdFlipCameraAndroid className="opacity-80" />
              <span className="text-sm">Flip preview</span>
            </div>
            <Button
              size="sm"
              variant={flipped ? "default" : "outline"}
              onClick={() => setFlipped(!flipped)}
              className="rounded-full"
            >
              {flipped ? "On" : "Off"}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaLightbulb className="opacity-80" />
              <span className="text-sm">Lighting intent</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={lighting}
              onChange={(e) => setLighting(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">{lighting}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCubes className="opacity-80" />
              <span className="text-sm">Props allowed</span>
            </div>
            <Button
              size="sm"
              variant={propsEnabled ? "default" : "outline"}
              onClick={() => setPropsEnabled(!propsEnabled)}
              className="rounded-full"
            >
              {propsEnabled ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaTshirt className="opacity-80" />
              <span className="text-sm">Outfits allowed</span>
            </div>
            <Button
              size="sm"
              variant={outfitsEnabled ? "default" : "outline"}
              onClick={() => setOutfitsEnabled(!outfitsEnabled)}
              className="rounded-full"
            >
              {outfitsEnabled ? "On" : "Off"}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="text-sm">Mode</div>
            <div className="flex items-center gap-2">
              {(["social", "pro", "practice"] as PhotoshootMode[]).map((m) => (
                <ModePill
                  key={m}
                  value={m}
                  active={m === mode}
                  onClick={() => setMode(m)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm">Aspect ratio</div>
            <div className="flex items-center gap-2 flex-wrap">
              {(
                ["9:16", "3:4", "1:1", "4:3", "4:5", "16:9"] as AspectRatioKey[]
              ).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAspectRatio(r)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border",
                    r === aspectRatio
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
