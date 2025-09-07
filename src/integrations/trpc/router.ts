import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "./init";

export const trpcRouter = createTRPCRouter({});
export type TRPCRouter = typeof trpcRouter;
