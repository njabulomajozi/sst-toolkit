#!/usr/bin/env node

import { Command } from "commander";
import * as Relationships from "@sst-toolkit/core/relationships";
import type { ISSTState } from "@sst-toolkit/shared/types/sst";

const parseResourceRelationships = Relationships.parseResourceRelationships;

const program = new Command();

program
  .name("sst-toolkit")
  .description("Toolkit for exploring, visualizing, and extending SST")
  .version("1.0.0");

program
  .command("explore")
  .description("Explore SST state")
  .argument("<state-file>", "Path to SST state JSON file")
  .action(async (stateFile: string) => {
    try {
      const state = (await import(stateFile)) as { default: ISSTState };
      const resources = state.default.latest.resources;
      const relationships = parseResourceRelationships(resources);
      
      process.stdout.write(`Found ${resources.length} resources\n`);
      process.stdout.write(`Found ${relationships.length} relationships\n`);
    } catch (error) {
      process.stderr.write(`Failed to explore state: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

const pluginCommand = program
  .command("plugin")
  .description("Manage plugins");

pluginCommand
  .command("create")
  .description("Create a new plugin component")
  .argument("<name>", "Component name (e.g., MyComponent)")
  .option("-t, --template <template>", "Template to use (basic, aws, cloudflare)", "basic")
  .option("-n, --namespace <namespace>", "Namespace for the component (e.g., mycompany)", "example")
  .option("-o, --output <dir>", "Output directory", process.cwd())
  .action(async (name: string, options: { template?: string; namespace?: string; output?: string }) => {
    try {
      const { createPlugin } = await import("./commands/plugin-create");
      await createPlugin({
        name,
        template: (options.template || "basic") as "basic" | "aws" | "cloudflare",
        namespace: options.namespace || "example",
        outputDir: options.output,
      });
      process.stdout.write(`✅ Created plugin component "${name}" in ${options.output || process.cwd()}\n`);
    } catch (error) {
      process.stderr.write(`Failed to create plugin: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("list", "List installed plugins")
  .action(() => {
    process.stdout.write("Plugin list command not yet implemented\n");
  });

pluginCommand
  .command("install", "Install a plugin")
  .action(() => {
    process.stdout.write("Plugin install command not yet implemented\n");
  });

pluginCommand
  .command("remove", "Remove a plugin")
  .action(() => {
    process.stdout.write("Plugin remove command not yet implemented\n");
  });

if (process.argv.length <= 3) {
  program.help();
  process.exit(0);
}

program.exitOverride((err) => {
  if (err.code === "commander.helpDisplayed" || err.code === "commander.version") {
    process.exit(0);
  }
  if (err.code === "commander.missingArgument" || err.code === "commander.unknownCommand") {
    process.exit(err.exitCode || 1);
  }
  process.exit(0);
});

program.parse();

