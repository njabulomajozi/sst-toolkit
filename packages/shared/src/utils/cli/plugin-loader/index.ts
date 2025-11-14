/**
 * Plugin Loader Utility
 */

import * as fs from "fs/promises";
import * as path from "path";
import type { IPluginMetadata } from "../../../types/cli/plugins";

export async function loadPluginFromPath(pluginPath: string): Promise<IPluginMetadata> {
  try {
    const packageJsonPath = path.join(pluginPath, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      main: packageJson.main,
      types: packageJson.types,
    };
  } catch (error) {
    throw new Error(`Failed to load plugin from path: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function validatePluginStructure(pluginPath: string): Promise<boolean> {
  try {
    const packageJsonPath = path.join(pluginPath, "package.json");
    await fs.access(packageJsonPath);
    
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    
    if (!packageJson.name || !packageJson.version) {
      throw new Error("Plugin package.json must have name and version");
    }
    
    if (packageJson.main) {
      const mainPath = path.join(pluginPath, packageJson.main);
      await fs.access(mainPath);
    }
    
    return true;
  } catch (error) {
    throw new Error(`Plugin validation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

