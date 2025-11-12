import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ResourceIcon } from "../ResourceList";
import { cn } from "~/lib/utils";
import type { IWorkflowNode } from "@sst-toolkit/shared/types/workflow";

function ResourceNodeComponent({ data, selected }: NodeProps<IWorkflowNode>) {
  const nodeData = data as IWorkflowNode["data"];
  const { resource, label, status, category, provider } = nodeData;

  const statusColors = {
    completed: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    running: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  };

  const statusLabels = {
    completed: "Completed",
    running: "Running",
    failed: "Failed",
    pending: "Pending",
  };

  return (
    <Card
      className={cn(
        "min-w-[200px] max-w-[250px] shadow-lg",
        selected ? "ring-2 ring-primary" : undefined
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="mt-1">
            {resource && (
              <ResourceIcon type={resource.type} resource={resource} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{label}</div>
            <div className="text-xs text-muted-foreground truncate">
              {category}
            </div>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {provider}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs border", statusColors[status])}
              >
                {statusLabels[status]}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}

export const ResourceNode = memo(ResourceNodeComponent);

