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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>
            Confirm the image before continuing.
          </DialogDescription>
        </DialogHeader>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="rounded-lg border border-border max-h-[65svh] w-auto"
          />
        ) : null}
        <DialogFooter>
          <Button onClick={onNext}>Next</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
