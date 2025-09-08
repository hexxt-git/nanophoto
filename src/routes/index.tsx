import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  CameraViewport,
  type CameraHandle,
} from "@/components/app/camera-viewport";
import { ControlsBar } from "@/components/app/controls-bar";
import { ImagePreviewDialog } from "@/components/app/image-preview-dialog";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Header } from "@/components/app/header";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraRef = useRef<CameraHandle | null>(null);
  const [lastCaptureUrl, setLastCaptureUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (lastCaptureUrl) {
        URL.revokeObjectURL(lastCaptureUrl);
      }
    };
  }, [lastCaptureUrl]);

  return (
    <div className="h-[calc(100dvh-2rem)] flex flex-col">
      <Header />

      <main className="flex-1 px-4 flex">
        <div className="m-auto w-full max-w-[480px] flex flex-col items-center">
          <SignedIn>
            <CameraViewport ref={cameraRef} className="w-full" />
          </SignedIn>
          <SignedOut>
            <div className="w-full p-6 border rounded-xl text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Please sign in to use the camera and upload photos.
              </p>
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground">
                  Sign in to continue
                </button>
              </SignInButton>
            </div>
          </SignedOut>
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
          // Reset the input value to allow selecting the same file again
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      />

      <footer className="h-24 flex items-center">
        <SignedIn>
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
        </SignedIn>
        <SignedOut>
          <ControlsBar
            className="py-4"
            disabled
            onGalleryClick={() => {}}
            onShutterClick={() => {}}
          />
        </SignedOut>
      </footer>

      <SignedIn>
        <ImagePreviewDialog
          open={previewOpen}
          onOpenChange={(open) => {
            setPreviewOpen(open);
            // Clean up blob URL when dialog is closed
            if (!open && lastCaptureUrl) {
              URL.revokeObjectURL(lastCaptureUrl);
              setLastCaptureUrl(null);
            }
          }}
          imageUrl={lastCaptureUrl}
        />
      </SignedIn>
    </div>
  );
}
