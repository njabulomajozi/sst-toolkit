import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { IPluginMetadata } from "~/lib/plugin-loader";

export interface IPluginDependenciesProps {
  plugins: IPluginMetadata[];
}

export function PluginDependencies({ plugins }: IPluginDependenciesProps) {
  const dependencyGraph = useMemo(() => {
    const graph: Record<string, string[]> = {};
    
    for (const plugin of plugins) {
      graph[plugin.name] = [];
    }
    
    return graph;
  }, [plugins]);

  if (plugins.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Plugin Dependencies</h2>
        <p className="text-muted-foreground">No plugins to visualize.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Plugin Dependencies</h2>
        <p className="text-muted-foreground">
          Visualize plugin dependency relationships
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dependency Graph</CardTitle>
          <CardDescription>
            {plugins.length} plugin(s) with their dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(dependencyGraph).map(([pluginName, deps]) => (
              <div key={pluginName} className="p-2 border rounded">
                <p className="font-semibold">{pluginName}</p>
                {deps.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                    {deps.map((dep) => (
                      <li key={dep}>{dep}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground ml-4">No dependencies</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

