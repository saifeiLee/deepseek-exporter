import { resolve } from "node:path";
import { defineConfig } from "vite";
import libAssetsPlugin from "@laynezh/vite-plugin-lib-assets";
import makeManifestPlugin from "./utils/plugins/make-manifest-plugin";
import { watchPublicPlugin, watchRebuildPlugin } from "@extension/hmr";
import { isDev, isProduction, watchOption } from "@extension/vite-config";
import fs from 'node:fs'

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");

const outDir = resolve(rootDir, "..", "dist");

// copy content.css to dist
fs.copyFileSync(resolve(rootDir, "src/content/content.css"), resolve(outDir, "content.css"));

export default defineConfig({
  resolve: {
    alias: {
      "@root": rootDir,
      "@src": srcDir,
      "@assets": resolve(rootDir, "assets"),
    },
  },
  plugins: [
    libAssetsPlugin({
      outputPath: outDir,
    }),
    watchPublicPlugin(),
    makeManifestPlugin({ outDir }),
    isDev && watchRebuildPlugin({ reload: true }),
  ],
  publicDir: resolve(rootDir, "public"),
  build: {
    lib: {
      formats: ["iife"],
      entry: resolve(__dirname, "src/content/index.ts"),
      name: "ContentScript",
      fileName: "content",
    },
    outDir,
    emptyOutDir: false,
    sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    watch: watchOption,
    rollupOptions: {
      external: ["chrome"],
    },
  },
  envDir: "../",
});
