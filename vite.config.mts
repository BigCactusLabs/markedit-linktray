import { createRequire } from "node:module";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);
const { peerDependencies = {} } = require("markedit-api/package.json") as {
  peerDependencies?: Record<string, string>;
};
const external = ["markedit-api", ...Object.keys(peerDependencies)];

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: "main.ts",
      fileName: () => "markedit-repotray.js",
      formats: ["cjs"]
    },
    outDir: "dist",
    rollupOptions: {
      external,
      output: {
        exports: "named"
      }
    },
    sourcemap: true,
    target: "es2022"
  }
});
