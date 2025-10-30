import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["../../packages/ui"] }),
    tailwindcss(),
    tanstackRouter(),
    react(),
    {
      name: "hmr-logger",
      handleHotUpdate({ file }) {
        // Log HMR updates in development
        if (isDev) {
          console.info(`[Shell HMR] File changed: ${file}`);
        }
        return;
      },
    },
    federation({
      name: "shell",
      // No remotes defined - apps are loaded dynamically at runtime
      // via remoteLoader.ts using the /applications API
      remotes: {},
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.2.0",
        },
        "@tanstack/react-query": {
          singleton: true,
        },
        "@tanstack/react-router": {
          singleton: true,
        },
        "lucide-react": {
          singleton: true,
        },
        zustand: {
          singleton: true,
        },
      },
    }),
  ],
  server: {
    port: 5000,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
    cors: true,
  },
  build: {
    target: "esnext",
    modulePreload: false,
    minify: true,
    cssCodeSplit: false,
  },
});
