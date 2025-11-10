import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { IPluginMetadata } from "~/lib/plugin-loader";

export interface IPluginDetailProps {
  plugin: IPluginMetadata;
  onInstall?: () => void;
  onClose?: () => void;
}

export function PluginDetail({ plugin, onInstall, onClose }: IPluginDetailProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{plugin.name}</CardTitle>
            <CardDescription>
              Version: {plugin.version}
            </CardDescription>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {plugin.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{plugin.description}</p>
          </div>
        )}

        {plugin.author && (
          <div>
            <h3 className="font-semibold mb-2">Author</h3>
            <p className="text-sm text-muted-foreground">{plugin.author}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Package Info</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            {plugin.main && <p>Main: {plugin.main}</p>}
            {plugin.types && <p>Types: {plugin.types}</p>}
          </div>
        </div>

        {onInstall && (
          <Button onClick={onInstall} className="w-full">
            Install Plugin
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

