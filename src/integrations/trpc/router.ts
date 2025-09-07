import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "./init";

export const trpcRouter = createTRPCRouter({
  analyze: createTRPCRouter({
    create: protectedProcedure
      .input(
        z.object({
          image: z.string().min(1),
          mode: z.string().min(1),
          constraints: z.array(z.enum(["background", "props", "lighting"])),
        })
      )
      .mutation(async ({ ctx, input }) => {
        console.log("ANALYZE CREATE", {
          userId: ctx.userId,
          image: input.image.substring(0, 64) + "...",
          mode: input.mode,
          constraints: input.constraints,
        });
        const analysisId = crypto.randomUUID();
        return { analysisId };
      }),
  }),
});
export type TRPCRouter = typeof trpcRouter;
