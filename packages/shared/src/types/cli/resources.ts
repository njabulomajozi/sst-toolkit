/**
 * CLI Resource Types
 * Types and interfaces for AWS resource management
 */

export interface IResource {
  arn: string;
  service: string;
  region: string;
  resourceId: string;
  resourceType: string;
}

export interface ITagFilter {
  key: string;
  value: string;
}

export interface IFinderOptions {
  stage?: string;
  app?: string;
  tags?: ITagFilter[];
  tagMatch?: "AND" | "OR";
  region?: string;
  awsProfile?: string;
}

export interface IRemoverOptions {
  region?: string;
  awsProfile?: string;
  dryRun?: boolean;
}

export interface IRemoverResult {
  success: boolean;
  error?: string;
}

/**
 * Resource Finder Interface
 * Single responsibility: Find resources by tags
 */
export interface IResourceFinder {
  find(options: IFinderOptions): Promise<IResource[]>;
}

/**
 * Resource Remover Interface
 * Single responsibility: Remove a single resource
 */
export interface IResourceRemover {
  remove(resource: IResource, options: IRemoverOptions): Promise<IRemoverResult>;
}

/**
 * Resource Router Interface
 * Routes resources to appropriate removers (Strategy pattern)
 */
export interface IResourceRouter {
  route(resource: IResource, options: IRemoverOptions): Promise<IRemoverResult>;
}

export interface IResourceNode {
  resource: IResource;
  dependencies: Set<string>; // ARNs this resource depends on
  dependents: Set<string>; // ARNs that depend on this resource
}

export interface IResourceGraph {
  nodes: Map<string, IResourceNode>;
  edges: Map<string, Set<string>>; // from -> to (dependencies)
}

