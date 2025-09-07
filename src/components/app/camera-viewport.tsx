import * as React from "react";
import { cn } from "@/lib/utils";
import {
  useSettingsStore,
  useSettingsHydrated,
  type AspectRatioKey,
} from "@/stores/settings";
import { Button } from "../ui/button";
import { Camera, CameraOff, RefreshCcw } from "lucide-react";

export interface CameraHandle {
  start: () => Promise<void>;
  stop: () => void;
  capturePhoto: () => Promise<Blob | null>;
}

interface CameraViewportProps {
  className?: string;
}

function aspectKeyToSize(key: AspectRatioKey) {
  switch (key) {
    case "9:16":
      return { width: 9, height: 16 } as const;
    case "4:3":
      return { width: 4, height: 3 } as const;
    case "1:1":
      return { width: 1, height: 1 } as const;
    case "4:5":
      return { width: 4, height: 5 } as const;
    case "16:9":
      return { width: 16, height: 9 } as const;
    case "3:4":
    default:
      return { width: 3, height: 4 } as const;
  }
}

function aspectKeyToRatio(key: AspectRatioKey) {
  const a = aspectKeyToSize(key);
  return a.width / a.height;
}

export const CameraViewport = React.forwardRef<
  CameraHandle,
  CameraViewportProps
>(function CameraViewport({ className }, ref) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const isStartingRef = React.useRef(false);
  const [isActive, setIsActive] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [facing, setFacing] = React.useState<"environment" | "user">(
    "environment"
  );

  const aspectKey = useSettingsStore((s) => s.aspectRatio);
  const aspect = aspectKeyToSize(aspectKey);
  const targetRatio = aspectKeyToRatio(aspectKey);

  const startWithFacing = React.useCallback(
    async (mode: "environment" | "user" = facing) => {
      if (streamRef.current || isStartingRef.current) return;
      isStartingRef.current = true;
      try {
        const tryGet = async (
          f: "environment" | "user"
        ): Promise<MediaStream> => {
          // Prefer exact to force the requested camera; fall back later
          try {
            return await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { exact: f } as any },
              audio: false,
            });
          } catch {
            return await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: f } },
              audio: false,
            });
          }
        };

        let stream: MediaStream | null = null;
        try {
          stream = await tryGet(mode);
        } catch {
          // Fallback to the opposite facing
          const other = mode === "environment" ? "user" : "environment";
          stream = await tryGet(other);
          setFacing(other);
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setIsActive(true);
        setErrorMsg(null);
      } catch (err) {
        console.error("Camera start failed", err);
        setErrorMsg("Camera permission denied or unavailable");
        setIsActive(false);
      } finally {
        isStartingRef.current = false;
      }
    },
    [facing]
  );

  const stop = React.useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const start = React.useCallback(async () => {
    await startWithFacing();
  }, [startWithFacing]);

  const capturePhoto = React.useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video) return null;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;
    // center-crop to the target aspect ratio
    const sourceRatio = width / height;
    let sx = 0;
    let sy = 0;
    let sWidth = width;
    let sHeight = height;
    if (sourceRatio > targetRatio) {
      // too wide -> crop sides
      sWidth = Math.floor(height * targetRatio);
      sx = Math.floor((width - sWidth) / 2);
    } else if (sourceRatio < targetRatio) {
      // too tall -> crop top/bottom
      sHeight = Math.floor(width / targetRatio);
      sy = Math.floor((height - sHeight) / 2);
    }
    const canvas = document.createElement("canvas");
    canvas.width = aspect.width * 1000; // scale to a reasonable size
    canvas.height = aspect.height * 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const flip = useSettingsStore.getState().flipped;
    if (flip) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92)
    );
  }, [aspect.height, aspect.width, targetRatio]);

  React.useEffect(() => {
    void startWithFacing();
    return () => {
      stop();
    };
  }, [startWithFacing, stop]);

  React.useImperativeHandle(ref, () => ({ start, stop, capturePhoto }), [
    start,
    stop,
    capturePhoto,
  ]);

  const flipped = useSettingsStore((s) => s.flipped);
  const hydrated = useSettingsHydrated();

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "rounded-3xl border border-border bg-muted/30 shadow-lg overflow-hidden w-full max-w-[480px] max-h-full",
          className
        )}
        style={{
          aspectRatio: `${aspect.width} / ${aspect.height}`,
        }}
      >
        <video
          ref={videoRef}
          className={cn(
            "w-full h-full object-cover",
            hydrated && flipped && "-scale-x-100",
            !isActive && "opacity-0"
          )}
          playsInline
          muted
          autoPlay
        />
      </div>
      <div className="flex items-center justify-end">
        {/* <div className="text-xs text-muted-foreground">
          {isActive ? facing : "inactive"}
        </div> */}
        <div className="flex justify-end gap-2">
          {isActive ? (
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full size-8"
              aria-label="turn off camera"
              onClick={stop}
            >
              <CameraOff className="size-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="rounded-full size-8"
              aria-label="turn on camera"
              onClick={() => startWithFacing()}
            >
              <Camera className="size-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full size-8"
            aria-label="switch camera"
            onClick={async () => {
              const next = facing === "environment" ? "user" : "environment";
              setFacing(next);
              if (isActive) {
                stop();
                await startWithFacing(next);
              }
            }}
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </div>
      {errorMsg ? (
        <div className="text-xs text-destructive">{errorMsg}</div>
      ) : null}
    </div>
  );
});
