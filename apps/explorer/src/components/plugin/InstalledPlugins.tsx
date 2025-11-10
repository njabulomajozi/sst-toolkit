import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { IPluginMetadata } from "~/lib/plugin-loader";

export interface IInstalledPluginsProps {
  plugins: IPluginMetadata[];
}

export function InstalledPlugins({ plugins }: IInstalledPluginsProps) {
  const validPlugins = useMemo(() => {
    return plugins.filter((plugin) => plugin.name && plugin.version);
  }, [plugins]);

  if (validPlugins.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Installed Plugins</h2>
        <p className="text-muted-foreground">No plugins installed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Installed Plugins</h2>
        <p className="text-muted-foreground">
          {validPlugins.length} plugin(s) installed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validPlugins.map((plugin) => (
          <Card key={plugin.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plugin.name}</span>
                <Badge variant="secondary">{plugin.version}</Badge>
              </CardTitle>
              {plugin.description && (
                <CardDescription>{plugin.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {plugin.author && (
                <p className="text-sm text-muted-foreground">
                  Author: {plugin.author}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

