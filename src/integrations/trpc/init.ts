import { initTRPC } from "@trpc/server";
import type { Db } from "mongodb";

const t = initTRPC
  .context<{
    userId: string | null;
    db: Db;
  }>()
  .create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use((opts) => {
  const { ctx } = opts;
  if (!ctx.userId) {
    throw new Error("UNAUTHORIZED");
  }
  return opts.next({ ctx });
});
