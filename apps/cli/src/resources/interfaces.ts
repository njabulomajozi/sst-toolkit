/**
 * Resource Interfaces
 * Defines contracts for resource finders and removers (DIP, ISP)
 */

import type { IResource, IFinderOptions, IRemoverOptions, IRemoverResult } from "./types.js";

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

