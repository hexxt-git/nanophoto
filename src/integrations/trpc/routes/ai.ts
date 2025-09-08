import { generateSketch, judgeImage } from "@/lib/ai";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";

export const aiRouter = createTRPCRouter({
  analyze: protectedProcedure
    .input(
      z.object({
        image: z.string().min(1),
        mode: z.string().min(1),
        constraints: z.array(z.enum(["background", "props", "lighting"])),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("judging image");
      const judgement = await judgeImage({
        image: input.image,
        mode: input.mode,
        constraints: input.constraints,
      });
      // const sketches = await Promise.all(
      //   judgement.actionable_issues.map(async ({ issue, instruction }) => {
      //     return await generateSketch({
      //       image: input.image,
      //       mode: input.mode,
      //       constraints: input.constraints,
      //       issue: issue,
      //       instruction: instruction,
      //     });
      //   })
      // );

      console.log("\n".repeat(5));
      console.log("---input");
      console.dir(
        { ...input, image: input.image.slice(0, 100) },
        { depth: null }
      );
      console.log("---judgement");
      console.dir(judgement, { depth: null });
      // console.log("---sketches");
      // console.dir(sketches, { depth: null });
      console.log("\n".repeat(5));

      const analysisId = crypto.randomUUID();
      return { analysisId };
    }),
});
