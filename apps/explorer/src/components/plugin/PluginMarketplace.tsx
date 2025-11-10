import { useState, useMemo } from "react";
import { Input } from "~/components/ui/input";
import { PluginCard } from "./PluginCard";
import type { IPluginMetadata } from "~/lib/plugin-loader";

export interface IPluginMarketplaceProps {
  plugins: IPluginMetadata[];
  onInstall?: (plugin: IPluginMetadata) => void;
  onView?: (plugin: IPluginMetadata) => void;
}

export function PluginMarketplace({ plugins, onInstall, onView }: IPluginMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlugins = useMemo(() => {
    if (!searchQuery) {
      return plugins;
    }
    const query = searchQuery.toLowerCase();
    return plugins.filter(
      (plugin) =>
        plugin.name.toLowerCase().includes(query) ||
        plugin.description?.toLowerCase().includes(query)
    );
  }, [plugins, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Plugin Marketplace</h2>
        <p className="text-muted-foreground">
          Discover and install SST plugins
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search plugins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredPlugins.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {searchQuery ? "No plugins found matching your search." : "No plugins available."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.map((plugin) => (
              <PluginCard
                key={plugin.name}
                plugin={plugin}
                onInstall={onInstall ? () => onInstall(plugin) : undefined}
                onView={onView ? () => onView(plugin) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

