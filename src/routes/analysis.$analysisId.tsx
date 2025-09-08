import * as React from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { trpcClient } from "@/integrations/tanstack-query/root-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type Analysis } from "@/schema/analysis";
import { cn } from "@/lib/utils";
import { Header } from "@/components/app/header";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/analysis/$analysisId")({
  component: AnalysisPage,
  loader: async ({ params }) => {
    try {
      const analysis = await trpcClient.analysis.get.query({
        analysisId: params.analysisId,
      });

      return { analysis };
    } catch (error) {
      console.error(error);
      return { error: "Analysis not found" };
    }
  },
});

type ScoreLabel =
  | "major issue"
  | "bad"
  | "decent"
  | "good"
  | "great"
  | "excellent";

function scoreToValue(score: ScoreLabel): number {
  const map: Record<ScoreLabel, number> = {
    "major issue": 0,
    bad: 1,
    decent: 2,
    good: 3,
    great: 4,
    excellent: 5,
  };
  return map[score] ?? 0;
}

function scoreToGradient(score: ScoreLabel): string {
  const map: Record<ScoreLabel, string> = {
    "major issue": "from-red-500 to-red-600",
    bad: "from-orange-500 to-orange-600",
    decent: "from-amber-400 to-amber-500",
    good: "from-lime-500 to-lime-600",
    great: "from-emerald-500 to-emerald-600",
    excellent: "from-sky-500 to-sky-600",
  };
  return map[score] ?? "from-zinc-400 to-zinc-500";
}

function asImageSrc(base64: string | undefined): string | undefined {
  if (!base64) return undefined;
  return base64.startsWith("data:")
    ? base64
    : `data:image/png;base64,${base64}`;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-accent/50">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-sm bg-card/80 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-2",
        className
      )}
    >
      <div className="mb-3">
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        {description ? (
          <div className="text-xs text-muted-foreground mt-0.5">
            {description}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function AnalysisPage() {
  const { analysis, error } = useLoaderData({
    from: "/analysis/$analysisId",
  }) as {
    analysis: Analysis;
    error?: string;
  };

  const [selectedIssueIndex, setSelectedIssueIndex] = React.useState<
    number | null
  >(null);
  const [step, setStep] = React.useState(0);

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  const issues = analysis.judgement.actionableIssues ?? [];
  const sketches = analysis.sketches ?? [];
  const pairs = issues.map((issue, i) => ({ issue, sketch: sketches[i] }));
  const total = pairs.length;
  const isSummary = total === 0 || step >= total;

  const goNext = () => setStep((s) => Math.min(s + 1, total));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <>
      <Header />
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-xl sm:max-w-2xl">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
              {analysis.judgement.imageTitle}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Pill>{analysis.mode}</Pill>
              {analysis.constraints.map((c) => (
                <Pill key={c}>{c}</Pill>
              ))}
            </div>
          </div>

          {isSummary ? (
            <div className="mt-4 rounded-lg bg-card/60 p-3 sm:p-4">
              {analysis.judgement.verdict ? (
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground">Verdict</div>
                  <div className="text-sm font-medium leading-snug">
                    {analysis.judgement.verdict}
                  </div>
                </div>
              ) : null}

              <Accordion
                type="multiple"
                defaultValue={["tips", "scores", "description"]}
              >
                <AccordionItem value="tips">
                  <AccordionTrigger>Tips recap</AccordionTrigger>
                  <AccordionContent>
                    {pairs.length > 0 ? (
                      <div className="space-y-3">
                        {pairs.map(({ issue, sketch }, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                            className="rounded-lg bg-muted/30 p-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs text-muted-foreground">
                                Tip {i + 1}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {issue.location.type === "area" && (
                                  <span>area: {issue.location.area}</span>
                                )}
                                {issue.location.type === "settings" && (
                                  <span>
                                    settings: {issue.location.settings}
                                  </span>
                                )}
                                {issue.location.type === "framing" && (
                                  <span>framing: {issue.location.framing}</span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 rounded-md overflow-hidden bg-black/5">
                              {asImageSrc(sketch) ? (
                                <img
                                  src={asImageSrc(sketch)}
                                  alt={`Sketch ${i + 1}`}
                                  className="w-full object-contain"
                                />
                              ) : (
                                <div className="w-full grid place-items-center text-xs text-muted-foreground">
                                  No sketch available
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-sm font-medium">
                              {issue.issue}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {issue.visual_guidance}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        No tips generated.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="scores">
                  <AccordionTrigger>Scores</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {Object.entries(analysis.judgement.scores).map(
                        ([category, metrics]) => {
                          const metricEntries = Object.entries(
                            metrics as Record<
                              string,
                              { score: ScoreLabel; reason: string }
                            >
                          );
                          return (
                            <div key={category}>
                              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                {category}
                              </div>
                              <div className="rounded-lg bg-muted/30 p-3 divide-y">
                                {metricEntries.map(([metricKey, metric]) => {
                                  const v = scoreToValue(metric.score);
                                  const pct = Math.round((v / 5) * 100);
                                  const grad = scoreToGradient(metric.score);
                                  return (
                                    <div
                                      key={metricKey}
                                      className="py-2 first:pt-0 last:pb-0"
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-medium capitalize">
                                          {metricKey
                                            .replaceAll(/([A-Z])/g, " $1")
                                            .toLowerCase()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                          {metric.score}
                                        </div>
                                      </div>
                                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                                        <motion.div
                                          className={cn(
                                            "h-full rounded-full bg-gradient-to-r",
                                            grad
                                          )}
                                          initial={{ width: 0 }}
                                          animate={{
                                            width: `${Math.max(pct, 10)}%`,
                                          }}
                                          transition={{
                                            duration: 0.6,
                                            ease: [0.22, 1, 0.36, 1],
                                          }}
                                        />
                                      </div>
                                      <div className="mt-1 text-xs text-muted-foreground">
                                        {metric.reason}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="description">
                  <AccordionTrigger>Visual description</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {analysis.judgement.visualDescription}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="mt-4">
              <div className="mb-3 text-xs text-muted-foreground">
                Tip {step + 1} of {total}
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / total) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="mt-4 relative min-h-[300px] sm:min-h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-lg bg-card/60 p-3 sm:p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">Actionable tip</div>
                      <span className="text-[10px] rounded-full bg-accent/60 px-2 py-0.5">
                        {pairs[step]?.issue.location.type}
                      </span>
                    </div>

                    <div className="mt-3 rounded-md overflow-hidden bg-black/5">
                      {asImageSrc(pairs[step]?.sketch) ? (
                        <img
                          src={asImageSrc(pairs[step]?.sketch)}
                          alt={`Sketch ${step + 1}`}
                          className="w-full object-contain"
                        />
                      ) : (
                        <div className="w-full grid place-items-center text-xs text-muted-foreground">
                          No sketch available
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-sm font-medium">
                      {pairs[step]?.issue.issue}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {pairs[step]?.issue.visual_guidance}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="h-16" />

              <div className="fixed inset-x-0 bottom-0 z-40">
                <div className="mx-auto max-w-xl sm:max-w-2xl p-3">
                  <div className="rounded-xl bg-card shadow-xs px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="flex-1"
                        onClick={goPrev}
                        disabled={step === 0}
                      >
                        Back
                      </Button>
                      {step + 1 < total ? (
                        <Button className="flex-[2]" onClick={goNext}>
                          Next tip
                        </Button>
                      ) : (
                        <Button className="flex-[2]" onClick={goNext}>
                          Got to summary
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
