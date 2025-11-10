import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { IPluginMetadata } from "~/lib/plugin-loader";

export interface IPluginManagerProps {
  plugins: IPluginMetadata[];
  onInstall?: (pluginName: string) => void;
  onRemove?: (pluginName: string) => void;
  onUpdate?: (pluginName: string) => void;
}

export function PluginManager({ plugins, onInstall, onRemove, onUpdate }: IPluginManagerProps) {
  const [installInput, setInstallInput] = useState("");

  const handleInstall = () => {
    if (installInput && onInstall) {
      onInstall(installInput);
      setInstallInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Plugin Manager</h2>
        <p className="text-muted-foreground">
          Install, remove, and update plugins
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Install Plugin</CardTitle>
          <CardDescription>
            Install a plugin from npm or GitHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Plugin name (e.g., @sst/aws-bedrock)"
              value={installInput}
              onChange={(e) => setInstallInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInstall();
                }
              }}
            />
            <Button onClick={handleInstall} disabled={!installInput}>
              Install
            </Button>
          </div>
        </CardContent>
      </Card>

      {plugins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Installed Plugins</CardTitle>
            <CardDescription>
              {plugins.length} plugin(s) installed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {plugins.map((plugin) => (
                <div
                  key={plugin.name}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="font-semibold">{plugin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Version: {plugin.version}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {onUpdate && (
                      <Button
                        onClick={() => onUpdate(plugin.name)}
                        variant="outline"
                        size="sm"
                      >
                        Update
                      </Button>
                    )}
                    {onRemove && (
                      <Button
                        onClick={() => onRemove(plugin.name)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

