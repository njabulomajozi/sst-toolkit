/**
 * Storage Resource Finder
 * Finds S3 buckets, DynamoDB tables, SQS queues, ElastiCache, and RDS
 */

import { findResourcesByTags } from "@sst-toolkit/shared/utils/cli/base";
import type { IResourceFinder, IFinderOptions } from "@sst-toolkit/shared/types/cli/resources";

export class StorageResourceFinder implements IResourceFinder {
  private readonly services = ["s3", "dynamodb", "sqs", "elasticache", "rds"];

  async find(options: IFinderOptions) {
    const allResources = await Promise.all(
      this.services.map((service) => findResourcesByTags(options, service))
    );
    return allResources.flat();
  }
}

export const findStorageResources = async (options: IFinderOptions = {}) => {
  const finder = new StorageResourceFinder();
  return finder.find(options);
};

