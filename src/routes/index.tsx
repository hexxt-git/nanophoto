import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CameraViewport,
  type CameraHandle,
} from "@/components/app/camera-viewport";
import { ControlsBar } from "@/components/app/controls-bar";
import { ImagePreviewDialog } from "@/components/app/image-preview-dialog";
import { UserButton } from "@clerk/clerk-react";
// Note: keep original aspect in preview; crop/flip only on capture

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraRef = useRef<CameraHandle | null>(null);
  const [lastCaptureUrl, setLastCaptureUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="h-[calc(100dvh-1rem)] flex flex-col">
      <header className="flex items-center gap-4 justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="size-12" />
          <h1 className="font-bold uppercase">NanoPhoto</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 flex">
        <div className="m-auto w-full max-w-[480px] flex flex-col items-center">
          <CameraViewport ref={cameraRef} className="w-full" />
        </div>
      </main>

      {/* Hidden gallery input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (lastCaptureUrl) URL.revokeObjectURL(lastCaptureUrl);
            const url = URL.createObjectURL(file);
            setLastCaptureUrl(url);
            setPreviewOpen(true);
          }
        }}
      />

      <footer className="h-24 flex items-center">
        <ControlsBar
          className="py-4"
          onGalleryClick={() => fileInputRef.current?.click()}
          onShutterClick={async () => {
            const blob = await cameraRef.current?.capturePhoto();
            if (blob) {
              if (lastCaptureUrl) URL.revokeObjectURL(lastCaptureUrl);
              const url = URL.createObjectURL(blob);
              setLastCaptureUrl(url);
              setPreviewOpen(true);
            }
          }}
        />
      </footer>

      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        imageUrl={lastCaptureUrl}
        onNext={() => {
          // TODO: route to analysis page with the chosen image
          setPreviewOpen(false);
        }}
      />
    </div>
  );
}
