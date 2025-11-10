export interface IPluginInfo {
  name: string;
  version: string;
  description?: string;
  author?: string;
  downloads?: number;
  rating?: number;
}

export async function searchPlugins(_query: string): Promise<IPluginInfo[]> {
  return [];
}

export async function getPluginInfo(_name: string): Promise<IPluginInfo | null> {
  return null;
}

export async function browsePlugins(_category?: string): Promise<IPluginInfo[]> {
  return [];
}

