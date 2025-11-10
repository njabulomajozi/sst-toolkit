import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/types/index.ts",
    "src/types/sst.ts",
    "src/types/workflow.ts",
    "src/utils/index.ts",
    "src/utils/state.ts",
    "src/utils/relationships.ts",
    "src/utils/workflow.ts",
    "src/schemas/index.ts",
    "src/constants/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});

