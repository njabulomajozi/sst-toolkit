/**
 * CLI Command Types
 * Types for CLI commands and argument parsing
 */

export interface IParsedCommand {
  command: string;
  subcommand?: string;
  options: Record<string, string | boolean | string[]>;
  tags: Array<{ key: string; value: string }>;
  tagMatch: "AND" | "OR";
}

export interface IGenerateComponentOptions {
  name: string;
  template?: "basic" | "aws" | "cloudflare";
  namespace?: string;
  outputDir?: string;
}

export interface IGenerateAdapterOptions {
  name: string;
  namespace?: string;
  outputDir?: string;
}

