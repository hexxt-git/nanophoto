import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { trpcRouter } from "@/integrations/trpc/router";

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
        return { userId: auth.userId ?? null };
      } catch (error) {
        console.error("error", error);
        return { userId: null };
      }
    },
  });
}

export const ServerRoute = createServerFileRoute("/api/trpc/$").methods({
  GET: handler,
  POST: handler,
});
