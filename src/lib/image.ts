import type { AspectRatioKey } from "@/stores/settings";

export function aspectKeyToSize(key: AspectRatioKey) {
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

export function aspectKeyToRatio(key: AspectRatioKey) {
  const a = aspectKeyToSize(key);
  return a.width / a.height;
}

export async function cropImageFileToViewportAspect(
  file: File,
  aspectKey: AspectRatioKey
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;
  const sourceRatio = width / height;
  const TARGET_RATIO = aspectKeyToRatio(aspectKey);

  let sx = 0;
  let sy = 0;
  let sWidth = width;
  let sHeight = height;
  if (sourceRatio > TARGET_RATIO) {
    sWidth = Math.floor(height * TARGET_RATIO);
    sx = Math.floor((width - sWidth) / 2);
  } else if (sourceRatio < TARGET_RATIO) {
    sHeight = Math.floor(width / TARGET_RATIO);
    sy = Math.floor((height - sHeight) / 2);
  }

  const canvas = document.createElement("canvas");
  const ASPECT = aspectKeyToSize(aspectKey);
  canvas.width = ASPECT.width * 1000;
  canvas.height = ASPECT.height * 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(
    bitmap,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
  );
  if (!blob) throw new Error("Failed to create blob");
  return blob;
}
