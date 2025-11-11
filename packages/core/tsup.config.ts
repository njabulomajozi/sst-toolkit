import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/state/index.ts",
    "src/relationships/index.ts",
    "src/workflow/index.ts",
    "src/adapters/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["node-gyp"],
});

