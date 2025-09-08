import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { trpcClient } from "@/integrations/tanstack-query/root-provider";

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

function AnalysisPage() {
  const { analysis, error } = useLoaderData({ from: "/analysis/$analysisId" });

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Analysis</h2>
      <p className="text-sm text-muted-foreground">
        ID: {analysis.analysisId} {analysis.userId}
      </p>
      <img
        className="text-sm text-muted-foreground"
        src={`data:image/png;base64,${analysis.image}`}
        alt="Image"
      />
      <p className="text-sm text-muted-foreground">Mode: {analysis.mode}</p>
      <p className="text-sm text-muted-foreground">
        Constraints: {analysis.constraints.join(", ")}
      </p>
      <p className="text-sm text-muted-foreground">
        Judgement: {analysis.judgement.verdict}
      </p>
      <p className="text-sm text-muted-foreground">
        Sketches: {analysis.sketches.length}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {analysis.sketches.map((sketch) => (
          <img
            key={sketch}
            src={`data:image/png;base64,${sketch}`}
            alt="Sketch"
          />
        ))}
      </div>
    </div>
  );
}
