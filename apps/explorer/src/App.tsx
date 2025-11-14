import { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ResourceList } from "~/components/ResourceList";
import { ResourceDetail } from "~/components/ResourceDetail";
import { WorkflowCanvas } from "~/components/workflow/WorkflowCanvas";
import { PendingOperationsList } from "~/components/PendingOperationsList";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { GlobalSearch } from "~/components/GlobalSearch";
import { StateFileUpload } from "~/components/StateFileUpload";
import * as State from "@sst-toolkit/core/state";
import * as Relationships from "@sst-toolkit/core/relationships";
import * as Workflow from "@sst-toolkit/core/workflow";
import type { ISSTState, ISSTResource } from "@sst-toolkit/shared/types/sst";
import { Spinner } from "~/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

function App() {
  const [state, setState] = useState<ISSTState | null>(null);
  const [selectedResource, setSelectedResource] = useState<ISSTResource | null>(null);
  const [nodes, setNodes] = useState<ReturnType<typeof State.parseState>>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setLoadingError(null);
    try {
      const text = await file.text();
      const parsedState = JSON.parse(text) as ISSTState;
      setState(parsedState);
      const parsedNodes = State.parseState(parsedState);
      setNodes(parsedNodes);
      setLoadingError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to parse state file";
      setLoadingError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResourceSelect = useCallback((resource: ISSTResource) => {
    setSelectedResource(resource);
  }, []);

  const allResources = useMemo(() => {
    return state?.latest?.resources ?? [];
  }, [state?.latest?.resources]);

  const pendingOperations = useMemo(() => {
    return state?.latest.pending_operations ?? [];
  }, [state?.latest.pending_operations]);

  const pendingOperationsResources = useMemo(() => {
    return pendingOperations.map((op) => op.resource);
  }, [pendingOperations]);

  const workflow = useMemo(() => {
    if (allResources.length === 0) {
      return { nodes: [], edges: [] };
    }
    const relationships = Relationships.parseResourceRelationships(allResources);
    return Workflow.buildWorkflow(allResources, relationships);
  }, [allResources]);

  if (!state && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Upload SST State File</CardTitle>
            <CardDescription>
              Upload a state file exported from your SST project to visualize your infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StateFileUpload onFileUpload={handleFileUpload} />
            {loadingError && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{loadingError}</p>
                </div>
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground space-y-1">
              <p>To export your SST state:</p>
              <code className="block p-2 bg-muted rounded text-xs">
                npx sst state export --stage dev &gt; state.json
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Spinner className="size-8 mx-auto" />
          <p className="text-muted-foreground">Loading state...</p>
        </div>
      </div>
    );
  }

  if (loadingError || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Failed to Load State</CardTitle>
            </div>
            <CardDescription>
              Unable to load the state file. Please check that the file is valid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingError && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-mono text-muted-foreground">{loadingError}</p>
              </div>
            )}
            <StateFileUpload onFileUpload={handleFileUpload} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h1 className="text-3xl font-bold">SST State Visualizer</h1>
                  <p className="text-muted-foreground">
                    Stack: <span className="font-mono">{state.stack}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Version: {state.latest.manifest.version} • Last updated:{" "}
                    {new Date(state.latest.manifest.time).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StateFileUpload onFileUpload={handleFileUpload} />
                  <GlobalSearch
                    resources={allResources}
                    pendingOperationsResources={pendingOperationsResources}
                    onSelectResource={handleResourceSelect}
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="explorer" className="space-y-4">
              <TabsList>
                <TabsTrigger value="explorer">Explorer</TabsTrigger>
                {pendingOperations.length > 0 && (
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                )}
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
              </TabsList>

              <TabsContent value="explorer" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 h-[calc(100vh-200px)]">
                  <div className="overflow-hidden">
                    <ResourceList
                      nodes={nodes}
                      onSelectResource={handleResourceSelect}
                      selectedUrn={selectedResource?.urn}
                    />
                  </div>
                  <div className="sticky top-0 h-full overflow-hidden">
                    <ResourceDetail resource={selectedResource} />
                  </div>
                </div>
              </TabsContent>

              {pendingOperations.length > 0 && (
                <TabsContent value="pending" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 h-[calc(100vh-200px)]">
                    <div className="overflow-hidden">
                      <PendingOperationsList
                        operations={pendingOperations}
                        onSelectResource={handleResourceSelect}
                        selectedUrn={selectedResource?.urn}
                      />
                    </div>
                    <div className="sticky top-0 h-full overflow-hidden">
                      <ResourceDetail resource={selectedResource} />
                    </div>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="workflow" className="space-y-6">
                <div className="h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
                  <WorkflowCanvas
                    nodes={workflow.nodes}
                    edges={workflow.edges}
                    onNodeSelect={(nodeId) => {
                      const resource = allResources.find((r) => r.urn === nodeId);
                      if (resource) {
                        handleResourceSelect(resource);
                      }
                    }}
                    selectedNodeId={selectedResource?.urn}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
