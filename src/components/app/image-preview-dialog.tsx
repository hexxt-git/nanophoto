import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoSparklesSharp } from "react-icons/io5";
import { useSettingsStore, type ConstraintKey } from "@/stores/settings";

interface ImagePreviewDialogProps {
  open: boolean;
  imageUrl: string | null;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
}

export function ImagePreviewDialog({
  open,
  imageUrl,
  onOpenChange,
  onNext,
}: ImagePreviewDialogProps) {
  const [step, setStep] = React.useState<1 | 2>(1);

  // Settings store
  const mode = useSettingsStore((s) => s.mode);
  const constraints = useSettingsStore((s) => s.constraints);

  React.useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open, imageUrl]);

  const constraintLabels: Record<ConstraintKey, string> = {
    background: "Background",
    props: "Props",
    lighting: "Lighting",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Preview" : "Review settings"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Confirm the image before continuing."
              : "Double-check settings before analysis."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-lg border border-border max-h-[65svh] w-auto"
            />
          ) : null
        ) : (
          <div className="max-h-[65svh] overflow-y-auto">
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 text-muted-foreground w-[40%]">
                      Mode
                    </td>
                    <td className="px-4 py-3">{mode}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground align-top">
                      Constraints
                    </td>
                    <td className="px-4 py-3">
                      {constraints.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {constraints.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-accent/50"
                            >
                              {constraintLabels[c]}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Change these anytime from Settings.
            </div>
          </div>
        )}
        <DialogFooter>
          {step === 1 ? (
            <>
              <Button
                variant="ghost"
                className="underline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} disabled={!imageUrl}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={onNext}>
                Analyze <IoSparklesSharp />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
