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

const exploreCommand = program
  .command("explore")
  .description("Explore SST state");

exploreCommand
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

program
  .command("visualize")
  .description("Visualize SST state")
  .argument("<state-file>", "Path to SST state JSON file")
  .option("-o, --output <file>", "Output file path")
  .option("-f, --format <format>", "Output format (json, image)", "json")
  .action(async (stateFile: string, options: { output?: string; format?: string }) => {
    try {
      const { visualize } = await import("./commands/visualize");
      await visualize({
        stateFile,
        output: options.output,
        format: options.format as "json" | "image",
      });
    } catch (error) {
      process.stderr.write(`Failed to visualize: ${error instanceof Error ? error.message : String(error)}\n`);
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
  .command("list")
  .description("List installed plugins")
  .action(async () => {
    try {
      const { listPlugins } = await import("./commands/plugin-list");
      await listPlugins();
    } catch (error) {
      process.stderr.write(`Failed to list plugins: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("install")
  .description("Install a plugin")
  .argument("<plugin>", "Plugin name or path")
  .option("-D, --dev", "Install as dev dependency")
  .action(async (plugin: string, options: { dev?: boolean }) => {
    try {
      const { installPlugin } = await import("./commands/plugin-install");
      await installPlugin({
        plugin,
        dev: options.dev,
      });
    } catch (error) {
      process.stderr.write(`Failed to install plugin: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("remove")
  .description("Remove a plugin")
  .argument("<plugin>", "Plugin name")
  .action(async (plugin: string) => {
    try {
      const { removePlugin } = await import("./commands/plugin-remove");
      await removePlugin({ plugin });
    } catch (error) {
      process.stderr.write(`Failed to remove plugin: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("test")
  .description("Test a plugin")
  .option("-p, --path <path>", "Plugin path")
  .action(async (options: { path?: string }) => {
    try {
      const { testPlugin } = await import("./commands/plugin-test");
      await testPlugin({ pluginPath: options.path });
    } catch (error) {
      process.stderr.write(`Failed to test plugin: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("publish")
  .description("Publish a plugin")
  .option("-p, --path <path>", "Plugin path")
  .option("--dry-run", "Dry run without publishing")
  .action(async (options: { path?: string; dryRun?: boolean }) => {
    try {
      const { publishPlugin } = await import("./commands/plugin-publish");
      await publishPlugin({
        pluginPath: options.path,
        dryRun: options.dryRun,
      });
    } catch (error) {
      process.stderr.write(`Failed to publish plugin: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("search")
  .description("Search for plugins")
  .argument("<query>", "Search query")
  .action(async (query: string) => {
    try {
      const Registry = await import("./utils/registry");
      const plugins = await Registry.searchPlugins(query);
      if (plugins.length === 0) {
        process.stdout.write("No plugins found.\n");
        return;
      }
      process.stdout.write(`Found ${plugins.length} plugin(s):\n`);
      for (const plugin of plugins) {
        process.stdout.write(`  - ${plugin.name}@${plugin.version}\n`);
      }
    } catch (error) {
      process.stderr.write(`Failed to search plugins: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

pluginCommand
  .command("browse")
  .description("Browse plugin marketplace")
  .option("-c, --category <category>", "Filter by category")
  .action(async (options: { category?: string }) => {
    try {
      const Registry = await import("./utils/registry");
      const plugins = await Registry.browsePlugins(options.category);
      if (plugins.length === 0) {
        process.stdout.write("No plugins found.\n");
        return;
      }
      process.stdout.write(`Found ${plugins.length} plugin(s):\n`);
      for (const plugin of plugins) {
        process.stdout.write(`  - ${plugin.name}@${plugin.version}\n`);
      }
    } catch (error) {
      process.stderr.write(`Failed to browse plugins: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

const generateCommand = program
  .command("generate")
  .description("Generate components and adapters");

generateCommand
  .command("component")
  .description("Generate a component from template")
  .argument("<name>", "Component name (e.g., MyComponent)")
  .option("-t, --template <template>", "Template to use (basic, aws, cloudflare)", "basic")
  .option("-n, --namespace <namespace>", "Namespace for the component", "example")
  .option("-o, --output <dir>", "Output directory", process.cwd())
  .action(async (name: string, options: { template?: string; namespace?: string; output?: string }) => {
    try {
      const { generateComponent } = await import("./commands/generate-component");
      await generateComponent({
        name,
        template: (options.template || "basic") as "basic" | "aws" | "cloudflare",
        namespace: options.namespace || "example",
        outputDir: options.output,
      });
      process.stdout.write(`✅ Generated component "${name}"\n`);
    } catch (error) {
      process.stderr.write(`Failed to generate component: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

generateCommand
  .command("adapter")
  .description("Generate an adapter from template")
  .argument("<name>", "Adapter name (e.g., MyAdapter)")
  .option("-n, --namespace <namespace>", "Namespace for the adapter", "example")
  .option("-o, --output <dir>", "Output directory", process.cwd())
  .action(async (name: string, options: { namespace?: string; output?: string }) => {
    try {
      const { generateAdapter } = await import("./commands/generate-adapter");
      await generateAdapter({
        name,
        namespace: options.namespace || "example",
        outputDir: options.output,
      });
      process.stdout.write(`✅ Generated adapter "${name}"\n`);
    } catch (error) {
      process.stderr.write(`Failed to generate adapter: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

const resourcesCommand = program
  .command("resources")
  .description("Manage AWS resources");

resourcesCommand
  .command("find")
  .description("Find AWS resources by tags")
  .option("--tagMatch <match>", "Tag matching logic (AND or OR)", "AND")
  .option("--region <region>", "AWS region", process.env.AWS_REGION || "us-east-1")
  .option("--profile <profile>", "AWS profile", process.env.AWS_PROFILE || "default")
  .allowUnknownOption()
  .action(async (options: { tagMatch?: string; region?: string; profile?: string }) => {
    try {
      // Parse tags from raw arguments (Commander doesn't handle --tag KEY VALUE well)
      const args = process.argv;
      const findIndex = args.indexOf("find");
      const tags: Array<{ key: string; value: string }> = [];
      
      for (let i = findIndex + 1; i < args.length; i++) {
        if (args[i] === "--tag" && i + 2 < args.length) {
          tags.push({ key: args[i + 1], value: args[i + 2] });
          i += 2; // Skip key and value
        } else if (args[i] === "--tagMatch" || args[i] === "--region" || args[i] === "--profile") {
          i++; // Skip option value
        } else if (args[i].startsWith("--")) {
          // Other options, skip
        }
      }

      if (tags.length === 0) {
        process.stderr.write("Error: --tag KEY VALUE is required for find command\n");
        process.stderr.write("Example: sst-toolkit resources find --tag sst:stage dev --tag sst:app insights\n");
        process.exit(1);
      }

      const { findResources } = await import("./commands/resources/find");
      await findResources({
        tags,
        tagMatch: (options.tagMatch?.toUpperCase() || "AND") as "AND" | "OR",
        region: options.region,
        awsProfile: options.profile,
      });
    } catch (error) {
      process.stderr.write(`Failed to find resources: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

resourcesCommand
  .command("delete")
  .description("Delete AWS resources by tags")
  .option("--tagMatch <match>", "Tag matching logic (AND or OR)", "AND")
  .option("--region <region>", "AWS region", process.env.AWS_REGION || "us-east-1")
  .option("--profile <profile>", "AWS profile", process.env.AWS_PROFILE || "default")
  .option("--dry-run", "Preview changes without deleting", false)
  .option("--force, -f", "Skip confirmation prompts", false)
  .allowUnknownOption()
  .action(async (options: { tagMatch?: string; region?: string; profile?: string; dryRun?: boolean; force?: boolean }) => {
    try {
      // Parse tags from raw arguments (Commander doesn't handle --tag KEY VALUE well)
      const args = process.argv;
      const deleteIndex = args.indexOf("delete");
      const tags: Array<{ key: string; value: string }> = [];
      let dryRun = false;
      let force = false;
      
      for (let i = deleteIndex + 1; i < args.length; i++) {
        if (args[i] === "--tag" && i + 2 < args.length) {
          tags.push({ key: args[i + 1], value: args[i + 2] });
          i += 2; // Skip key and value
        } else if (args[i] === "--dry-run") {
          dryRun = true;
        } else if (args[i] === "--force" || args[i] === "-f") {
          force = true;
        } else if (args[i] === "--tagMatch" || args[i] === "--region" || args[i] === "--profile") {
          i++; // Skip option value
        } else if (args[i].startsWith("--")) {
          // Other options, skip
        }
      }

      if (tags.length === 0) {
        process.stderr.write("Error: --tag KEY VALUE is required for delete command\n");
        process.stderr.write("Example: sst-toolkit resources delete --tag sst:stage dev --tag sst:app insights\n");
        process.exit(1);
      }

      const { deleteResources } = await import("./commands/resources/delete");
      await deleteResources({
        tags,
        tagMatch: (options.tagMatch?.toUpperCase() || "AND") as "AND" | "OR",
        region: options.region,
        awsProfile: options.profile,
        dryRun: dryRun || options.dryRun || false,
        force: force || options.force || false,
      });
    } catch (error) {
      process.stderr.write(`Failed to delete resources: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

if (process.argv.length <= 3) {
  program.help();
  process.exit(0);
}

program.exitOverride((err: any) => {
  if (err.code === "commander.helpDisplayed" || err.code === "commander.version") {
    process.exit(0);
  }
  if (err.code === "commander.missingArgument" || err.code === "commander.unknownCommand") {
    process.exit(err.exitCode || 1);
  }
  process.exit(0);
});

program.parse();












