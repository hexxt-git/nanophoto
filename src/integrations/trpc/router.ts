import { createTRPCRouter, publicProcedure } from "./init";
import { aiRouter } from "./routes/ai";

export const trpcRouter = createTRPCRouter({
  ai: aiRouter,
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
});
export type TRPCRouter = typeof trpcRouter;
