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
  type ConstraintKey,
} from "@/stores/settings";
import { FaLightbulb, FaCubes } from "react-icons/fa";
import { MdFlipCameraAndroid, MdGridOn } from "react-icons/md";
import { cn } from "@/lib/utils";
import { ScanLine, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Help({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
          aria-label="Info"
        >
          <Info className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-w-xs text-xs leading-relaxed"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
}

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
  const showGuidelines = useSettingsStore((s) => s.showGuidelines);
  const setShowGuidelines = useSettingsStore((s) => s.setShowGuidelines);
  const constraints = useSettingsStore((s) => s.constraints);
  const addConstraint = useSettingsStore((s) => s.addConstraint);
  const removeConstraint = useSettingsStore((s) => s.removeConstraint);
  const clearConstraints = useSettingsStore((s) => s.clearConstraints);
  const mode = useSettingsStore((s) => s.mode);
  const setMode = useSettingsStore((s) => s.setMode);
  const aspectRatio = useSettingsStore((s) => s.aspectRatio);
  const setAspectRatio = useSettingsStore((s) => s.setAspectRatio);

  const availableConstraints: {
    key: ConstraintKey;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "background",
      label: "Background",
      icon: <FaCubes className="opacity-80" />,
    },
    { key: "props", label: "Props", icon: <FaCubes className="opacity-80" /> },
    {
      key: "lighting",
      label: "Lighting",
      icon: <FaLightbulb className="opacity-80" />,
    },
  ];

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-2 overflow-y-auto">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="camera">
              <AccordionTrigger className="px-2">
                Camera settings
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MdFlipCameraAndroid className="opacity-80" />
                      <span className="text-sm">Flip preview</span>
                      <Help text="Mirror the live preview only. The captured image is flipped based on this setting at capture time.">
                        <span />
                      </Help>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MdGridOn className="opacity-80" />
                      <span className="text-sm">Show guidelines</span>
                      <Help text="Overlay shooting guides such as rule-of-thirds to help composition.">
                        <span />
                      </Help>
                    </div>
                    <Button
                      size="sm"
                      variant={showGuidelines ? "default" : "outline"}
                      onClick={() => setShowGuidelines(!showGuidelines)}
                      className="rounded-full"
                    >
                      {showGuidelines ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm flex items-center gap-2">
                      <ScanLine className="size-4 opacity-80" /> Aspect ratio
                      <Help text="Sets the capture framing. The preview box uses this ratio and captures are center-cropped to match.">
                        <span />
                      </Help>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(
                        [
                          "9:16",
                          "3:4",
                          "1:1",
                          "4:3",
                          "4:5",
                          "16:9",
                        ] as AspectRatioKey[]
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="constraints">
              <AccordionTrigger className="px-2">Constraints</AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableConstraints
                      .filter((c) => !constraints.includes(c.key))
                      .map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => addConstraint(c.key)}
                          className="border rounded-full px-3 py-1 text-sm hover:bg-accent"
                        >
                          <span className="inline-flex items-center gap-2">
                            {c.icon}
                            {c.label}
                          </span>
                        </button>
                      ))}
                  </div>
                  {constraints.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                        Active constraints
                        <Help text="Constraints restrict what environment changes are allowed during edits. Add those you want to enforce.">
                          <span />
                        </Help>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {constraints.map((k) => {
                          const meta = availableConstraints.find(
                            (c) => c.key === k
                          )!;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => removeConstraint(k)}
                              className="border rounded-full px-3 py-1 text-sm bg-accent/50 hover:bg-accent"
                              title="Remove constraint"
                            >
                              <span className="inline-flex items-center gap-2">
                                {meta.icon}
                                {meta.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearConstraints}
                        >
                          Clear all
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mode">
              <AccordionTrigger className="px-2">Mode</AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      "Portraits",
                      "Landscapes",
                      "Street",
                      "Product",
                      "Events",
                      "Food",
                      "Other",
                    ] as PhotoshootMode[]
                  ).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "border rounded-lg px-3 py-2 text-sm text-left",
                        m === mode
                          ? "border-primary bg-primary/10"
                          : "hover:bg-accent"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
