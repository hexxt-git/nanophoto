import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

import postgresPlugin from "@neondatabase/vite-plugin-postgres";

const config = defineConfig({
  plugins: [
    postgresPlugin({
      seed: {
        type: "sql-script",
        path: "db/init.sql",
      },
      referrer: "create-tanstack",
    }),

    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    viteReact(),
  ],
});

export default config;
