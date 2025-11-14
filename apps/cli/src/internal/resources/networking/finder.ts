/**
 * Networking Resource Finder
 * Finds API Gateway, EventBridge, CloudWatch, EC2, and Service Discovery resources
 */

import { findResourcesByTags } from "@sst-toolkit/shared/utils/cli/base";
import type { IResourceFinder, IFinderOptions } from "@sst-toolkit/shared/types/cli/resources";

export class NetworkingResourceFinder implements IResourceFinder {
  private readonly services = ["apigateway", "events", "logs", "ec2", "servicediscovery", "cloudwatch"];

  async find(options: IFinderOptions) {
    const allResources = await Promise.all(
      this.services.map((service) => findResourcesByTags(options, service))
    );
    
    // Filter EventBridge buses from events resources
    const eventsResources = allResources[1]; // events is at index 1
    const eventBuses = eventsResources.filter((r) => r.resourceType === "event-bus");
    
    return [...allResources.flat(), ...eventBuses];
  }
}

export const findNetworkingResources = async (options: IFinderOptions = {}) => {
  const finder = new NetworkingResourceFinder();
  return finder.find(options);
};

