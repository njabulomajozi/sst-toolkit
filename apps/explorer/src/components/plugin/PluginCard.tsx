import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { IPluginMetadata } from "~/lib/plugin-loader";

export interface IPluginCardProps {
  plugin: IPluginMetadata;
  onInstall?: () => void;
  onView?: () => void;
}

export function PluginCard({ plugin, onInstall, onView }: IPluginCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{plugin.name}</CardTitle>
        <CardDescription>
          {plugin.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Version: {plugin.version}
          </p>
          {plugin.author && (
            <p className="text-sm text-muted-foreground">
              Author: {plugin.author}
            </p>
          )}
          <div className="flex gap-2">
            {onInstall && (
              <Button onClick={onInstall} size="sm">
                Install
              </Button>
            )}
            {onView && (
              <Button onClick={onView} variant="outline" size="sm">
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

