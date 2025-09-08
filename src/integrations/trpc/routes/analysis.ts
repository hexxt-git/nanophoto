import { generateSketch, judgeImage } from "@/lib/ai";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { z } from "zod";
import { Analysis } from "@/schema/analysis";
import { ObjectId } from "mongodb";

export const analysisRouter = createTRPCRouter({
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

      if ("error" in judgement || !("actionableIssues" in judgement)) {
        return {
          error: "error" in judgement ? judgement.error : "unknown error",
        };
      }

      console.log("generating sketches", judgement.actionableIssues.length);
      const sketches = await Promise.all(
        judgement.actionableIssues.map(async (issue) => {
          return await generateSketch({
            image: input.image,
            issue: issue,
          });
        })
      );

      console.log("saving to db");

      const analysisId = crypto.randomUUID();

      await ctx.db.collection<Analysis>("analyses").insertOne({
        _id: new ObjectId(),
        userId: ctx.userId,
        analysisId: analysisId,
        image: input.image,
        mode: input.mode,
        constraints: input.constraints,
        judgement: judgement,
        sketches: sketches,
      });

      return { analysisId: analysisId };
    }),
  get: publicProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.db
        .collection<Analysis>("analyses")
        .findOne({ analysisId: input.analysisId });

      if (!analysis) {
        throw new Error("Analysis not found");
      }

      return analysis;
    }),
});
