import { createPlugin } from "./plugin-create";

export interface IGenerateAdapterOptions {
  name: string;
  namespace?: string;
  outputDir?: string;
}

export async function generateAdapter(options: IGenerateAdapterOptions): Promise<void> {
  await createPlugin({
    name: options.name,
    template: "basic",
    namespace: options.namespace || "example",
    outputDir: options.outputDir,
  });
}

