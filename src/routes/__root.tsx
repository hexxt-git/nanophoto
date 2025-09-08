import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

import ClerkProvider from "../integrations/clerk/provider";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";
import "../styles.css";

import type { QueryClient } from "@tanstack/react-query";

import type { TRPCRouter } from "@/integrations/trpc/router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { Toaster } from "@/components/ui/sonner";

interface MyRouterContext {
  queryClient: QueryClient;

  trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      },
      {
        title: "NanoPhoto - AI Photography Coach & Photo Analysis Tool",
      },
      {
        name: "description",
        content:
          "Improve your photography skills with AI analysis, visual guidance overlays, and smart editing suggestions. Get red sharpie annotations, composition feedback, and learn photography fundamentals.",
      },
      {
        name: "keywords",
        content:
          "photography coach, photo analysis, AI photo critique, photography learning, composition guide, exposure correction, photography improvement, amateur photography, photo editing AI",
      },
      {
        name: "author",
        content: "NanoPhoto Team",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "NanoPhoto - AI Photography Coach & Photo Analysis Tool",
      },
      {
        property: "og:description",
        content:
          "Improve your photography skills with AI analysis, visual guidance overlays, and smart editing suggestions. Perfect for amateur photographers learning composition and exposure.",
      },
      {
        property: "og:image",
        content: "/logo.png",
      },
      // Twitter
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "NanoPhoto - AI Photography Coach & Photo Analysis Tool",
      },
      {
        name: "twitter:description",
        content:
          "Improve your photography skills with AI analysis, visual guidance overlays, and smart editing suggestions. Perfect for amateur photographers learning composition and exposure.",
      },
      {
        name: "twitter:image",
        content: "/logo.png",
      },
      // Additional SEO
      {
        name: "robots",
        content: "index, follow",
      },
      {
        name: "theme-color",
        content: "#000000",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Lora:ital,wght@0,400..700;1,400..700&family=IBM+Plex+Mono:ital,wght@0,100..700;1,100..700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <Toaster />
          {children}
          {/* <TanstackDevtools
            config={{
              position: "bottom-left",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          /> */}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
