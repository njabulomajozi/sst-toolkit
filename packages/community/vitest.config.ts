import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "@sst-toolkit/community",
    dir: "./src",
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
  },
});

