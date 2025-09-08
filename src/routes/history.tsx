import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpcClient } from "@/integrations/tanstack-query/root-provider";
import { Header } from "@/components/app/header";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

export const Route = createFileRoute("/history")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const {
    data: analyses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analysis-history"],
    queryFn: () => trpcClient.analysis.list.query(),
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="p-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading history...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="p-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center py-8">
              <div className="text-red-500">Failed to load history</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-semibold mb-2">Photo History</h1>

          {!analyses || analyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No analyses found</div>
              <div className="text-sm text-muted-foreground mt-2">
                Start by analyzing your first photo
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {analyses.map((analysis, i) => (
                <motion.button
                  key={analysis.analysisId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  onClick={() =>
                    navigate({ to: `/analysis/${analysis.analysisId}` })
                  }
                  className="group text-left rounded-lg bg-card p-3 shadow-sm transition-all hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none flex gap-2 justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-base/snug line-clamp-2 leading-tight">
                      {analysis.imageTitle}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-3">
                      {analysis.verdict}
                    </div>
                  </div>
                  <img
                    src={analysis.image}
                    alt={analysis.imageTitle}
                    className="aspect-square transition-all group-hover:scale-[1.02] h-24 object-cover rounded-md"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
