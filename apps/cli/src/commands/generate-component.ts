import { createPlugin } from "./plugin-create";

export interface IGenerateComponentOptions {
  name: string;
  template?: "basic" | "aws" | "cloudflare";
  namespace?: string;
  outputDir?: string;
}

export async function generateComponent(options: IGenerateComponentOptions): Promise<void> {
  await createPlugin({
    name: options.name,
    template: options.template || "basic",
    namespace: options.namespace || "example",
    outputDir: options.outputDir,
  });
}

