/**
 * CLI Plugin Types
 */

export interface IPluginMetadata {
  name: string;
  version: string;
  description?: string;
  main?: string;
  types?: string;
}

export interface IPluginInfo {
  name: string;
  version: string;
  description?: string;
  author?: string;
  downloads?: number;
  rating?: number;
}

