/**
 * AWS-specific SST resources
 *
 * Re-exports commonly used AWS SST components and their types
 * to make component creation cleaner and easier.
 */

// Functions
// @ts-expect-error - SST peer dependency, available at runtime
export { Function } from "sst/components/function";
// @ts-expect-error - SST peer dependency, available at runtime
export type { FunctionArgs } from "sst/components/function";

// API Gateway
// @ts-expect-error - SST peer dependency, available at runtime
export { ApiGatewayV2 } from "sst/components/api-gateway-v2";
// @ts-expect-error - SST peer dependency, available at runtime
export type { ApiGatewayV2Args } from "sst/components/api-gateway-v2";

// DynamoDB
// @ts-expect-error - SST peer dependency, available at runtime
export { DynamoDB } from "sst/components/dynamodb";
// @ts-expect-error - SST peer dependency, available at runtime
export type { DynamoDBArgs } from "sst/components/dynamodb";

// S3
// @ts-expect-error - SST peer dependency, available at runtime
export { Bucket } from "sst/components/bucket";
// @ts-expect-error - SST peer dependency, available at runtime
export type { BucketArgs } from "sst/components/bucket";

// EventBridge
// @ts-expect-error - SST peer dependency, available at runtime
export { EventBridge } from "sst/components/event-bridge";
// @ts-expect-error - SST peer dependency, available at runtime
export type { EventBridgeArgs } from "sst/components/event-bridge";

// Queue
// @ts-expect-error - SST peer dependency, available at runtime
export { Queue } from "sst/components/queue";
// @ts-expect-error - SST peer dependency, available at runtime
export type { QueueArgs } from "sst/components/queue";

// Topic
// @ts-expect-error - SST peer dependency, available at runtime
export { Topic } from "sst/components/topic";
// @ts-expect-error - SST peer dependency, available at runtime
export type { TopicArgs } from "sst/components/topic";

// Re-export AWS utilities
export { getRegionOutput } from "@pulumi/aws";

