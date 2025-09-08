import { createTRPCRouter, publicProcedure } from "./init";
import { analysisRouter } from "./routes/analysis";

export const trpcRouter = createTRPCRouter({
  analysis: analysisRouter,
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
});
export type TRPCRouter = typeof trpcRouter;
