import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/analysis/$analysisId")({
  component: AnalysisPage,
});

function AnalysisPage() {
  const { analysisId } = useParams({ from: "/analysis/$analysisId" });
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Analysis</h2>
      <p className="text-sm text-muted-foreground">ID: {analysisId}</p>
    </div>
  );
}
