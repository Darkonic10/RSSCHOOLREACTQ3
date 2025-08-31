import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "./",
  publicDir: "public",
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    minify: "esbuild",
    sourcemap: false,
    target: "esnext",
  },
});
