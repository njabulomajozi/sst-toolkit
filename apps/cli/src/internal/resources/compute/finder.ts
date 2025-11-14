/**
 * Compute Resource Finder
 * Finds Lambda functions and event source mappings
 */

import { findResourcesByTags } from "@sst-toolkit/shared/utils/cli/base";
import type { IResourceFinder, IFinderOptions } from "@sst-toolkit/shared/types/cli/resources";

export class ComputeResourceFinder implements IResourceFinder {
  async find(options: IFinderOptions) {
    return findResourcesByTags(options, "lambda");
  }
}

export const findComputeResources = async (options: IFinderOptions = {}) => {
  const finder = new ComputeResourceFinder();
  return finder.find(options);
};

