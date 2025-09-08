import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { trpcRouter } from "@/integrations/trpc/router";
import { getDatabase } from "@/db";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: "/api/trpc",
    onError: ({ error, type, path, input, ctx, req }) => {
      // Centralized tRPC error logging
      console.error("[tRPC Error]", {
        type,
        path,
        url: req.url,
        userId: ctx?.userId ?? null,
        input,
        error: {
          name: error.name,
          message: error.message,
          code: (error as any).code,
          stack: error.stack,
        },
      });
    },
    createContext: async () => {
      try {
        const auth = await getAuth(request);
        const db = await getDatabase();
        return {
          userId: auth.userId ?? null,
          db,
        };
      } catch (error) {
        console.error("error", error);
        // Fallback: get database connection even if auth fails
        const db = await getDatabase();
        return {
          userId: null,
          db,
        };
      }
    },
  });
}

export const ServerRoute = createServerFileRoute("/api/trpc/$").methods({
  GET: handler,
  POST: handler,
});
