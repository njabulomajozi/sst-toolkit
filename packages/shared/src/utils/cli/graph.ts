/**
 * Resource Dependency Graph
 * Builds a graph of resource dependencies and determines optimal deletion order
 * Uses topological sort for O(V + E) complexity
 */

import type { IResource, IResourceNode, IResourceGraph } from "../../types/cli/resources";

/**
 * Build dependency graph from resources
 * Identifies dependencies between resources (e.g., Lambda event source mappings depend on functions)
 */
export function buildResourceGraph(resources: IResource[]): IResourceGraph {
  const nodes = new Map<string, IResourceNode>();
  const edges = new Map<string, Set<string>>();

  // Initialize nodes
  for (const resource of resources) {
    nodes.set(resource.arn, {
      resource,
      dependencies: new Set(),
      dependents: new Set(),
    });
    edges.set(resource.arn, new Set());
  }

  // Build dependency edges
  for (const resource of resources) {
    const dependencies = findResourceDependencies(resource, resources);
    
    for (const depArn of dependencies) {
      const depNode = nodes.get(depArn);
      if (depNode) {
        // Resource depends on depArn
        nodes.get(resource.arn)!.dependencies.add(depArn);
        depNode.dependents.add(resource.arn);
        edges.get(resource.arn)!.add(depArn);
      }
    }
  }

  return { nodes, edges };
}

/**
 * Find dependencies for a resource
 * Returns ARNs of resources this resource depends on
 * Uses efficient lookup with Map for O(1) access
 */
function findResourceDependencies(
  resource: IResource,
  allResources: IResource[]
): string[] {
  const dependencies: string[] = [];
  
  // Build lookup maps for O(1) access instead of O(n) find operations
  const functionMap = new Map<string, IResource>();
  const arnMap = new Map<string, IResource>();
  
  for (const r of allResources) {
    arnMap.set(r.arn, r);
    if (r.service === "lambda" && r.resourceType === "function") {
      functionMap.set(r.resourceId, r);
    }
  }

  switch (resource.service) {
    case "lambda":
      if (resource.resourceType === "event-source-mapping") {
        // Event source mappings depend on the Lambda function they're attached to
        // Extract function name from the mapping (format: function-name:uuid or just function-name)
        const parts = resource.resourceId.split(":");
        const functionName = parts[0];
        const functionResource = functionMap.get(functionName);
        if (functionResource) {
          dependencies.push(functionResource.arn);
        }
      }
      break;

    case "events":
      if (resource.resourceType === "rule") {
        // EventBridge rules depend on their targets (Lambda functions, etc.)
        // Try to infer from rule name pattern: insights-dev-FunctionName-RuleName
        // This is best-effort since we can't query targets without API calls
        const ruleName = resource.resourceId;
        // Common patterns: FunctionNameScheduleRule, FunctionNameHandlerRule
        const functionNameMatch = ruleName.match(/([A-Z][a-zA-Z0-9]+)(?:Schedule|Handler|Rule)/);
        if (functionNameMatch) {
          const potentialFunctionName = functionNameMatch[1];
          // Try exact match first
          let functionResource = functionMap.get(potentialFunctionName);
          // Try with stage prefix
          if (!functionResource && ruleName.includes("-dev-")) {
            functionResource = functionMap.get(`insights-dev-${potentialFunctionName}`);
          }
          if (functionResource) {
            dependencies.push(functionResource.arn);
          }
        }
      }
      break;

    case "ec2":
      if (resource.resourceType === "route-table" || 
          resource.resourceType === "subnet" || 
          resource.resourceType === "security-group" ||
          resource.resourceType === "internet-gateway" ||
          resource.resourceType === "nat-gateway") {
        // These resources depend on VPC
        // Extract VPC ID from ARN or try to find VPC resource
        // For now, we'll handle this during removal by checking VPC associations
        // In a more sophisticated implementation, we could query AWS to find the VPC
      }
      break;

    case "logs":
      if (resource.resourceType === "log-group") {
        // Log groups might be associated with Lambda functions
        // Extract function name from log group path: /aws/lambda/function-name
        if (resource.resourceId.startsWith("/aws/lambda/")) {
          const functionName = resource.resourceId.replace("/aws/lambda/", "").split("/")[0];
          const functionResource = functionMap.get(functionName);
          if (functionResource) {
            dependencies.push(functionResource.arn);
          }
        }
      }
      break;

    case "apigateway":
      // API Gateway APIs might have integrations, but we handle those during removal
      break;

    case "s3":
      // S3 buckets don't have dependencies on other tracked resources
      break;

    case "dynamodb":
      // DynamoDB tables don't have dependencies on other tracked resources
      break;

    case "sqs":
      // SQS queues don't have dependencies on other tracked resources
      break;

    case "servicediscovery":
      // Service Discovery namespaces don't have dependencies on other tracked resources
      break;

    case "rds":
      if (resource.resourceType === "db") {
        // RDS databases depend on clusters (if part of a cluster)
        // Try to find cluster by matching name patterns
        const dbName = resource.resourceId;
        // Common pattern: cluster-instance-0, cluster-instance-1
        const clusterNameMatch = dbName.match(/^(.+?)(?:-\d+)?$/);
        if (clusterNameMatch) {
          const potentialClusterName = clusterNameMatch[1];
          const clusterResource = allResources.find(
            (r) => r.service === "rds" && r.resourceType === "cluster" && r.resourceId === potentialClusterName
          );
          if (clusterResource) {
            dependencies.push(clusterResource.arn);
          }
        }
      }
      break;

    case "elasticache":
      if (resource.resourceType === "cluster") {
        // ElastiCache clusters might be part of replication groups
        // Try to find replication group
        const clusterName = resource.resourceId;
        const replicationGroupResource = allResources.find(
          (r) => r.service === "elasticache" && r.resourceType === "replication-group" && r.resourceId.includes(clusterName)
        );
        if (replicationGroupResource) {
          dependencies.push(replicationGroupResource.arn);
        }
      }
      break;

    case "iam":
      if (resource.resourceType === "role") {
        // IAM roles might be used by Lambda functions
        // Try to find Lambda functions that might use this role
        // Pattern: role name often matches function name or contains function name
        const roleName = resource.resourceId;
        // Common patterns: insights-dev-FunctionName-role-xxx or FunctionNameRole
        const functionNameMatch = roleName.match(/([A-Z][a-zA-Z0-9]+)(?:Role|role)/);
        if (functionNameMatch) {
          const potentialFunctionName = functionNameMatch[1];
          const functionResource = functionMap.get(potentialFunctionName);
          if (functionResource) {
            // Roles depend on functions (delete roles after functions)
            dependencies.push(functionResource.arn);
          }
        }
      }
      break;
  }

  return dependencies;
}

/**
 * Topological sort for deletion order
 * Returns resources in order (dependencies first, dependents last)
 * Uses Kahn's algorithm: O(V + E) where V = vertices, E = edges
 * 
 * For deletion, we want to delete dependents first, then dependencies
 * (opposite of typical topological sort for build order)
 */
export function topologicalSort(graph: IResourceGraph): IResource[] {
  const sorted: IResource[] = [];
  const inDegree = new Map<string, number>();
  const queue: string[] = [];

  // Calculate in-degree (number of dependents) for each node
  // For deletion, we want to delete nodes with no dependents first
  for (const [arn, node] of graph.nodes) {
    const dependentsCount = node.dependents.size;
    inDegree.set(arn, dependentsCount);
    if (dependentsCount === 0) {
      queue.push(arn);
    }
  }

  // Process nodes with no dependents first (safe to delete)
  while (queue.length > 0) {
    const arn = queue.shift()!;
    const node = graph.nodes.get(arn)!;
    
    sorted.push(node.resource);

    // Decrease in-degree for dependencies (they now have one less dependent)
    for (const depArn of node.dependencies) {
      const depNode = graph.nodes.get(depArn);
      if (depNode) {
        const currentInDegree = inDegree.get(depArn)! - 1;
        inDegree.set(depArn, currentInDegree);
        
        if (currentInDegree === 0) {
          queue.push(depArn);
        }
      }
    }
  }

  // If we couldn't process all nodes, there's a cycle or isolated nodes
  if (sorted.length !== graph.nodes.size) {
    const processedArns = new Set(sorted.map((r) => r.arn));
    // Add remaining nodes (cycles or isolated nodes)
    for (const [arn, node] of graph.nodes) {
      if (!processedArns.has(arn)) {
        sorted.push(node.resource);
      }
    }
  }

  return sorted;
}

/**
 * Get optimal deletion order using topological sort with service-specific priorities
 * Combines dependency graph with priority-based ordering for optimal O(V + E) performance
 */
export function getOptimalDeletionOrder(resources: IResource[]): IResource[] {
  if (resources.length === 0) return [];

  // Build dependency graph: O(V + E)
  const graph = buildResourceGraph(resources);

  // Get topologically sorted order: O(V + E)
  const topoSorted = topologicalSort(graph);

  // Create priority map for stable sorting: O(V)
  const priorityMap = new Map<string, number>();
  
  // Define service priorities (lower = deleted first)
  const servicePriorities: Record<string, number> = {
    "events": 1,           // EventBridge rules first
    "lambda": 2,          // Lambda resources
    "apigateway": 3,      // API Gateway
    "logs": 4,            // Log groups after functions
    "s3": 5,              // Storage
    "dynamodb": 5,
    "sqs": 5,
    "ec2": 6,             // Networking (VPC resources last)
    "servicediscovery": 6,
    "iam": 7,             // IAM roles after functions (they use roles)
    "elasticache": 5,     // Storage (same as other storage)
    "rds": 5,             // Storage (same as other storage)
    "cloudwatch": 4,      // Monitoring (after functions)
  };

  // Assign priorities: O(V)
  for (const resource of topoSorted) {
    let priority = servicePriorities[resource.service] ?? 99;
    
    // Adjust priority for specific resource types
    if (resource.service === "lambda" && resource.resourceType === "event-source-mapping") {
      priority = 1.5; // Event source mappings before functions
    } else if (resource.service === "lambda" && resource.resourceType === "function") {
      priority = 2.5; // Functions after event source mappings
    }
    
    priorityMap.set(resource.arn, priority);
  }

  // Sort by priority, maintaining topological order within same priority: O(V log V)
  // Use stable sort to preserve topological order
  const sorted = [...topoSorted].sort((a, b) => {
    const priorityA = priorityMap.get(a.arn) ?? 999;
    const priorityB = priorityMap.get(b.arn) ?? 999;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // Within same priority, maintain topological order (already sorted)
    return 0;
  });

  return sorted;
}
