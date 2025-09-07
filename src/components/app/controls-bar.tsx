import * as React from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Settings } from "lucide-react";
import { SettingsDrawer } from "@/components/app/settings-drawer";
import { cn } from "@/lib/utils";

interface ControlsBarProps {
  onGalleryClick: () => void;
  onShutterClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function ControlsBar({
  onGalleryClick,
  onShutterClick,
  className,
  disabled,
}: ControlsBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="w-full max-w-md mx-auto px-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full size-14"
          onClick={disabled ? undefined : onGalleryClick}
          disabled={disabled}
          aria-label="Open gallery"
        >
          <ImageIcon className="size-6" />
        </Button>

        <button
          type="button"
          aria-label="Shutter"
          onClick={disabled ? undefined : onShutterClick}
          disabled={disabled}
          className="relative size-20 rounded-full border-4 border-white/80 shadow-2xl outline-none ring-4 ring-black/5 transition active:scale-95 dark:border-white/60 dark:ring-white/10 bg-white/70 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="absolute inset-[6px] rounded-full bg-primary/90" />
        </button>

        <SettingsDrawer
          trigger={
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full size-14"
              aria-label="Open settings"
            >
              <Settings className="size-6" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
