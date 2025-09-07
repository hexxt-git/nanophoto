import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { TRPCRouter } from "@/integrations/trpc/router";

import { TRPCProvider } from "@/integrations/trpc/react";
import { useAuth } from "@clerk/clerk-react";

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    // detecting vercel or window location
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/trpc`;
    }
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson as any,
      url: getUrl(),
      headers() {
        // This runs on client; Clerk provides userId via useAuth
        try {
          // dynamic import to avoid SSR mismatch
          const { userId } = (window as any).clerkAuth || {};
          return userId ? { "x-user-id": userId } : {};
        } catch {
          return {};
        }
      },
    }),
  ],
});

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  });

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  });
  return {
    queryClient,
    trpc: serverHelpers,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  // Bridge Clerk userId to TRPC headers via a global; avoids hook usage here
  try {
    const auth = (useAuth as any)?.();
    if (auth && typeof window !== "undefined") {
      (window as any).clerkAuth = { userId: auth.userId };
    }
  } catch {}
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  );
}
